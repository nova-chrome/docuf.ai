import { Chat, KnownModelIds } from "@hashbrownai/core";
import { HashbrownOpenAI } from "@hashbrownai/openai";
import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { tryCatch } from "~/util/try-catch";

const KNOWN_OPENAI_MODEL_NAMES: KnownModelIds[] = [
  "gpt-3.5",
  "gpt-4",
  "gpt-4o",
  "gpt-4o-mini",
  "o1-mini",
  "o1",
  "o1-pro",
  "o3-mini",
  "o3-mini-high",
  "o3",
  "o3-pro",
  "o4-mini",
  "o4-mini-high",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4.5",
];

export async function POST(request: NextRequest) {
  const { data: body, error: parseError } = await tryCatch(
    request.json() as Promise<Chat.Api.CompletionCreateParams>
  );

  if (parseError || !body) {
    console.error("Failed to parse request body:", parseError);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const modelName = body.model;

  if (!KNOWN_OPENAI_MODEL_NAMES.includes(modelName as KnownModelIds)) {
    return NextResponse.json(
      { error: `Unknown model: ${modelName}` },
      { status: 400 }
    );
  }

  const { data: stream, error: streamError } = await tryCatch(
    (async () => {
      return HashbrownOpenAI.stream.text({
        apiKey: env.OPENAI_API_KEY,
        request: body,
      });
    })()
  );

  if (streamError || !stream) {
    console.error("Failed to create stream:", streamError);
    return NextResponse.json(
      { error: "Failed to initialize AI stream" },
      { status: 500 }
    );
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      const { error: streamProcessError } = await tryCatch(
        (async () => {
          for await (const chunk of stream) {
            controller.enqueue(chunk);
          }
          controller.close();
        })()
      );

      if (streamProcessError) {
        console.error("Stream processing error:", streamProcessError);
        controller.error(streamProcessError);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

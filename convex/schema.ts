import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const documents = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
});

export default defineSchema({
  documents,
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const documents = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  storageId: v.id("_storage"),
});

export default defineSchema({
  documents,
});

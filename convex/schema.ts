import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const documents = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  storageId: v.id("_storage"),
}).index("by_slug", ["slug"]);

export default defineSchema({
  documents,
});

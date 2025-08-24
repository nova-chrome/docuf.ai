import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const documents = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  storageId: v.optional(v.id("_storage")),
  userId: v.string(),
})
  .index("by_slug", ["slug"])
  .index("by_user_id", ["userId"]);

export default defineSchema({
  documents,
});

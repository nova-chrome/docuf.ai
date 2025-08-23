import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserDocuments = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("documents").collect();
  },
});

export const deleteUserDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

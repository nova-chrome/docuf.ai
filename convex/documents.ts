import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getUserDocuments = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("documents").collect();
  },
});

export const createDocument = mutation({
  args: { name: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      name: args.name,
      description: args.description,
    });
  },
});

export const deleteUserDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

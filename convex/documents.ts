import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// -----===[Queries]===-----
export const getDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getDocuments = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("documents").collect();
  },
});

// -----===[Mutations]===-----
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createDocument = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      name: args.name,
      description: args.description,
      storageId: args.storageId,
    });
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) throw new Error("Document not found");
    await ctx.storage.delete(document.storageId);
    await ctx.db.delete(args.id);
  },
});

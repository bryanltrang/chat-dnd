import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  entries: defineTable({
    input: v.string(),
    response: v.string(),
    adventureId: v.id("adventures"),
    imageUrl: v.optional(v.string()),
    health: v.optional(v.number()),
    inventory: v.optional(v.array(v.string())),
  }),
  adventures: defineTable({
    characterClass: v.string(),
  }),
});
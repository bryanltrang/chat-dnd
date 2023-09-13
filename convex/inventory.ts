import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { api, internal } from '../convex/_generated/api';

import OpenAI from 'openai';

const openai = new OpenAI();


export const summarizeInventory = action({
  args: {
    adventureId: v.id('adventures'),
    entryId: v.id('entries'),
  },
  handler: async (ctx, args) => {
    const adventure = await ctx.runQuery(internal.adventure.getAdventure, {
      adventureId: args.adventureId
    });

    if (!adventure) {
      throw new Error('adventure not found.')
    }

    const entries = await ctx.runQuery(internal.chat.getEntriesForAdventure, {adventureId: args.adventureId});

    const entriesString = entries.map((entry) => {
      return `${entry.input}\n\n${entry.response}`
    }).join("\n\n");

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `
      Here are entries for a text based rpg game that I'm playing. Return a JSON string with the following format so that I can know my current inventory items and current health points.

      // typescript type
      {
        health: number,
        inventory: string[],
      }
      
      please only provide a JSON. nothing else.

      Here is the current log of the game:
      "${entriesString}"`
    }],
      model: 'gpt-3.5-turbo',
    });

    const response = completion.choices[0].message.content ?? "";

    const stats = JSON.parse(response);

    await ctx.runMutation(internal.inventory.storeStatsIntoEntry, {
      entryId: args.entryId,
      health: stats.health,
      inventory: stats.inventory,
    })

    await Promise.all(
      stats.inventory.map((itemName: string) => {
        return ctx.runAction(internal.visualize.generateInventoryIcon, {
          itemName,
          adventureId: args.adventureId,
        })
      })
    )

  }
});


export const storeStatsIntoEntry = internalMutation({
  args:{
    entryId: v.id('entries'),
    health: v.number(),
    inventory: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.entryId, {
      health: args.health,
      inventory: args.inventory,
    })
  }
});


export const getAllItems = query({
  args: {
    adventureId: v.id('adventures'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
    .query('items')
    .filter((q) => q.eq(q.field('adventureId'), args.adventureId))
    .collect();
  }
});
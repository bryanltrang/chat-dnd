import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { api, internal } from '../convex/_generated/api';

import OpenAI from 'openai';

const openai = new OpenAI();


export const visualizLastestEntries = action({
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

    const lastestEntry = entries[entries.length - 1].response;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `
      Take this content and write 2 sentences that describe what an artist should draw for a fictional book.
      
      Here is the content:
      "${lastestEntry}"`
    }],
      model: 'gpt-3.5-turbo',
    });

    const imageDescription = completion.choices[0].message.content ?? "";
    console.log('image description:', imageDescription);

    const imageResponse = await openai.images.generate({
      prompt: imageDescription,
      n: 1,
      size: "512x512",
    });

    const image_url: string = imageResponse.data[0].url!;
    
    await ctx.runMutation(internal.visualize.addEntryVisualization, {
      entryId: args.entryId,
      imageUrl: image_url,
    });
  }
})


export const addEntryVisualization = internalMutation({
  args:{
    entryId: v.id('entries'),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.entryId, {
      imageUrl: args.imageUrl,
    })
  }
})
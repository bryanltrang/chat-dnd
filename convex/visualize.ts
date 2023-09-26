import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from '../convex/_generated/api';

import OpenAI from 'openai';

const openai = new OpenAI();


export const visualizeLatestEntries = action({
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

    const latestEntry = entries[entries.length - 1].response;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `
      Take this content and write 2 sentences that describe what an artist should draw for a fictional book.
      
      Here is the content:
      "${latestEntry}"`
    }],
      model: 'gpt-3.5-turbo',
    });

    const imageDescription = completion.choices[0].message.content ?? "";
    console.log('image description:', imageDescription);

    const openaiResponse = await openai.images.generate({
      prompt: imageDescription,
      n: 1,
      size: "512x512",
    });

    const imageUrl: string = openaiResponse.data[0].url!;
    const imageResponse = await fetch(imageUrl);
    const image = await imageResponse.blob();
    const storageId = await ctx.storage.store(image);
    
    await ctx.runMutation(internal.visualize.addEntryVisualization, {
      entryId: args.entryId,
      imageUrl: await ctx.storage.getUrl(storageId) ?? '',
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

export const generateInventoryIcon = internalAction({
  args: {
    itemName: v.string(),
    adventureId: v.id('adventures'),
  },
  handler: async (ctx, args) => {

    const items = await ctx.runQuery(internal.visualize.getItems, {
      itemName: args.itemName,
    })

    let adventureHasItem = false;

    for (let item of items) {
      if (item.adventureId === args.adventureId) {
        adventureHasItem = true;
      }
    }

    if (adventureHasItem) return;

    if (items[0]) {
      await ctx.runMutation(internal.visualize.storeItemIcon, {
        itemName: args.itemName,
        imageUrl: items[0].imageUrl ?? '',
        adventureId: args.adventureId,
      });
      return;
    }

    const openaiResponse = await openai.images.generate({
      prompt: args.itemName,
      n: 1,
      size: "256x256",
    });

    const imageUrl: string = openaiResponse.data[0].url!;
    const imageResponse = await fetch(imageUrl);
    const image = await imageResponse.blob();
    const storageId = await ctx.storage.store(image);
    
    await ctx.runMutation(internal.visualize.storeItemIcon, {
      itemName: args.itemName,
      imageUrl: await ctx.storage.getUrl(storageId) ?? '',
      adventureId: args.adventureId,
    });
  }
});

export const storeItemIcon = internalMutation({
  args:{
    itemName: v.string(),
    imageUrl: v.string(),
    adventureId: v.id('adventures'),
  },
  handler: async (ctx, args) => {

    await ctx.db.insert("items", {
      itemName: args.itemName,
      imageUrl: args.imageUrl,
      adventureId: args.adventureId,
    });

  }
})

export const getItems = internalQuery({
  args: {
    itemName: v.string(),
  },
  handler: async (ctx,args) => {
    const items = await ctx.db.query('items').filter((q) => q.eq(q.field('itemName'), args.itemName)).collect();

    return items;
  }
})

export const generatePlayerIcon = internalAction({
  args: {
    adventureId: v.id('adventures'),
    characterClass: v.string(),
  },
  handler: async (ctx, args) => {

    // const adventureInfo = await ctx.runQuery(internal.visualize.getAdventureByClass, {
    //   characterClass: args.characterClass
    // });

      const openaiResponse = await openai.images.generate({
        prompt: `A headshot illustration of a ${args.characterClass} in the style of Dungeons and Dragons`,
        n: 1,
        size: "256x256",
      });
  
      const imageUrl: string = openaiResponse.data[0].url!;
      const imageResponse = await fetch(imageUrl);
      const image = await imageResponse.blob();
      const storageId = await ctx.storage.store(image);

    await ctx.runMutation(internal.visualize.storePlayerIcon, {
      adventureId: args.adventureId,
      imageUrl: await ctx.storage.getUrl(storageId) ?? '',
    })
  }
});

export const storePlayerIcon = internalMutation({
  args: {
    adventureId: v.id('adventures'),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.adventureId, {
      imageUrl: args.imageUrl,
    })
  }
})

export const getAdventureByClass = internalQuery({
  args: {
    characterClass: v.string(),
  },
  handler: async (ctx, args) => {
    const adventureInfo = await ctx.db
    .query("adventures")
    .filter((q) => q.eq(q.field('characterClass'), args.characterClass))
    .first();

    return adventureInfo;
  }
})
import { v } from "convex/values";
import { internalAction, internalQuery, mutation } from "./_generated/server";

import OpenAI from 'openai';
import { api, internal } from "./_generated/api";

const openai = new OpenAI();

export const createAdventure = mutation({
  args: {
    characterClass: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("adventures", {
      characterClass: args.characterClass,
    });

    await ctx.scheduler.runAfter(0, internal.adventure.setupAdventureEntries, {
      adventureId: id,
    })

    return id;
  }
})

export const getAdventure = internalQuery({
  args: {
    adventureId: v.id('adventures'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.adventureId);
  }
})


export const setupAdventureEntries = internalAction({
  args: {
    adventureId: v.id("adventures"),
  },
  handler: async (ctx, args) => {
    const adventure = await ctx.runQuery(internal.adventure.getAdventure, args);

    if (!adventure) {
      throw new Error('adventure not found.')
    }

    const input: string = `
    You are a dungeon master that will run a text based adventure RPG for me. You will need to set up an adventure for me which will involve having me fight random enemies, reward me with loot after killing enemies, give me goals and quests, and finally let me know when I win or lose the adventure.

    When I am fighting enemies, please ask me to roll a 6 sided dice, with a 1 being the worst outcome, and 6 being the best outcome of the scenario. Do not roll the dice for me. I will provide you with a dice roll and you will provide a response that continues the adventure based on my provided roll and response.

    During this time, please track my health points which will start at 10, my character class which is a ${adventure.characterClass}, and my inventory which will start with.
    - a sword
    - a bronze helmet
    - a health potion that heals 3 health points

    the adventure should have the following:
    - the hero must beat all enemies.
    - the dungeon has 3 levels.
    - each level has 1 set of enemies to fight.
    - the final level has a boss.
    - the final level has a chest filled a legendary weapon or armor that fits my class.
    
    At the start of every new adventure you will:
    - Provide me a summary of my character class, my current health, my inventory.
    - Provide me with a fictional description of my character based on my class.
    - The first question will always be "What art thou name brave adventurer?"

    Here are some additional rules to follow:
    - Always prompt me with a question after each response you provide.
    - Never answer the questions.
    - Never roll the dice or make decisions.
    - Always require a dice roll for each attack.
    `

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: input }],
      model: 'gpt-3.5-turbo',
    });

    const response = completion.choices[0].message.content ?? "";

    await ctx.runMutation(api.chat.insertEntry, {
      input,
      response,
      adventureId: args.adventureId,
      health: 10,
      inventory: [],
    });

    return completion;
  },
});
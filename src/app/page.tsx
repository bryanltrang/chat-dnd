"use client"

import { useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useRouter } from 'next/navigation';
import CharacterSelect from './components/CharacterSelect';
import ArcherImg from '/public/archer.png';
import WarriorImg from '/public/warrior.png';
import WizardImg from '/public/wizard.png';
import DnDLogo from '/public/chat_dnd_logo_dark.svg';
import Image from 'next/image';

export default function Main() {
  const createAdventure = useMutation(api.adventure.createAdventure);
  const router = useRouter();
  const [characterClass, setCharacterClass] = useState('');
  const [title, setTitle] = useState(`
  Ah, brave adventurer, it's time to embark on your quest. 
Consider well, for your journey begins when you select your class.
`)

  useEffect(() => {
    if (characterClass === 'Archer') {
      setTitle(`
      Ah, splendid choice! You've embraced the way of the ${characterClass} – a true marksman, swift and precise, with an arrow for every foe. With your bow in hand, let your journey commence.
      `)
    } else if (characterClass === 'Warrior') {
      setTitle(`
      Ah, well done! A valiant choice indeed – the noble ${characterClass}, strong and resolute, a shield against the encroaching darkness. With your path set, our journey begins forthwith.
      `)
    } else if (characterClass === 'Wizard') {
      setTitle(`
      Wondrous! You've delved into the arcane arts, becoming a ${characterClass} – a master of spells and mysteries, wielding the power of the arcane. With your spellbook open, our adventure shall begin.
      `)
    }
  },[characterClass]);

  const handleCharacterClick = (character:string) => {
    if (character === characterClass) {
      setCharacterClass('');
      setTitle(`Ah, brave adventurer, it's time to embark on your quest. 
      Consider well, for your journey begins when you select your class.`)
    } else {
    setCharacterClass(character);
  }
  };

  return (
    <section className='flex flex-col justify-center items-center w-full h-screen'>
      <div className='flex flex-col items-center max-w-6xl'>
        <Image src={DnDLogo} width={300} alt="icon of dnd logo" className='mb-12'/>
        <h1 className='mb-12 text-center max-w-3xl'>{title}</h1>
        <button
          className='px-8 py-4 bg-yellow-600 rounded mb-5 hover:bg-yellow-700 cursor-pointer disabled:bg-slate-300 disabled:text-slate-400'
          disabled={characterClass === '' ? true : false}
          onClick={async () => {
            const adventureId = await createAdventure({characterClass});
            router.push(`/adventures/${adventureId}`)
          }}
          >Start your Adventure
        </button>
        <div className='flex'>
          <CharacterSelect characterClass='Warrior' 
          imageUrl={WarriorImg} 
          handleCharacterClick={handleCharacterClick} 
          currCharacter={characterClass} />
          <CharacterSelect characterClass='Wizard' 
          imageUrl={WizardImg} 
          handleCharacterClick={handleCharacterClick} 
          currCharacter={characterClass} />
          <CharacterSelect characterClass='Archer' 
          imageUrl={ArcherImg} 
          handleCharacterClick={handleCharacterClick} 
          currCharacter={characterClass} />
        </div>
      </div>
    </section>
  )
}

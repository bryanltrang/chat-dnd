"use client"

import { useMutation } from 'convex/react'
import React, { MouseEventHandler, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useRouter } from 'next/navigation';

export default function Main() {
  const createAdventure = useMutation(api.adventure.createAdventure);
  const router = useRouter();
  const [characterClass, setCharacterClass] = useState('');


  const handleClassClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLElement).innerText;
    setCharacterClass(buttonText);
  }

  return (
    <div className='flex justify-center item-center w-full h-screen'>
      <div className='flex flex-col'>
        <h1 className='text-center'>{characterClass === '' ? 'Choose a class' : `You selected ${characterClass}. Your adventure awaits...`}</h1>
        <button onClick={handleClassClick}>Warrior</button>
        <button onClick={handleClassClick}>Wizard</button>
        <button onClick={handleClassClick}>Ranger</button>
        <button
        disabled={characterClass === '' ? true : false}
        onClick={async () => {
          const adventureId = await createAdventure({characterClass});
          router.push(`/adventures/${adventureId}`)
        }}
        >Start an Adventure
        </button>
      </div>
    </div>
  )
}

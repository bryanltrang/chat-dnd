import Image, { StaticImageData } from 'next/image';
import React, { use, useState } from 'react'

type CharacterSelectProps = {
  characterClass: string;
  imageUrl: StaticImageData;
  handleCharacterClick: (character: string) => void;
  currCharacter: string;
}

export default function CharacterSelect({characterClass, imageUrl, handleCharacterClick, currCharacter}: CharacterSelectProps) {

  const [hover, setHover] = useState(false);

  const handleHover = () => {
    setHover(!hover);
  }

  return (
    <div className='cursor-pointer px-12 pt-8 h-[300px]' onMouseEnter={handleHover} onMouseLeave={handleHover}>
      {currCharacter === characterClass ? (
        <div className='flex flex-col items-center justify-center' onClick={() => handleCharacterClick(characterClass)}>
          <Image className='border-solid border-4 rounded border-yellow-600 mb-4 drop-shadow-md' src={imageUrl} width={150}alt="picture of character"/>
          <h3>{characterClass}</h3>
          <p> Selected </p>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center' onClick={() => handleCharacterClick(characterClass)}>
          <Image className='border-solid border-4 rounded border-black hover:border-yellow-600 mb-4' src={imageUrl} width={150} alt="picture of character"/>
          <h3>{characterClass}</h3>
          {hover && <p> Click to select</p>}
        </div>
      )}
    </div>
  )
}
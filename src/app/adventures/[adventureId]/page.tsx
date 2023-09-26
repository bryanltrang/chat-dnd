"use client"

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import HeartIcon from '/public/icon-color-heart.svg';
import DungeonMasterImage from '/public/dungeon-master.png';
import BlurImage from '/public/blur-bg.jpg';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';

export default function Adventure(props: {params: {adventureId: Id<'adventures'>}}) {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const adventureId = props.params.adventureId;
  const entries = useQuery(api.chat.getAllEntries, {
    adventureId,
  });
  const inventoryItems = useQuery(api.inventory.getAllItems, {
    adventureId,
  });

  const adventureInfo = useQuery(api.chat.getAdventureData, {
    adventureId,
  });

  const adventureClass = adventureInfo && adventureInfo[0].characterClass
  const playerIcon =  adventureInfo && adventureInfo[0].imageUrl

  const [message, setMessage] = useState('');
  const [rolled, setRolled] = useState(false);
  const lastEntry = entries && entries[entries.length - 1];
  const reactDice = useRef<ReactDiceRef>(null);

  useEffect(() => {
    const scrollMessageBottom = () => {
      const scrollDiv = document.querySelector('#scroll-div')!;
      scrollDiv.scrollTop = scrollDiv?.scrollHeight;
    }
    scrollMessageBottom();
  }, [entries])

  const rollDone = (totalValue: number, values: number[]) => {
    if (rolled) setMessage(`I rolled a ${totalValue}!`);
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-16 font-fraunces">
      <div className="z-10 max-w-7xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className='flex flex-col relative mr-8'>
          <Image alt='picture of evil wizard' src={DungeonMasterImage} width={800} height={500} className='absolute top-[-150px]'/>
          <div id="scroll-div" className="z-[1] rounded h-[450px] w-[550px] mb-2 p-2 overflow-y-auto bg-cover" style={{backgroundImage: `url(/scroll-image.svg)`}}>
            {entries?.map((entry) => {
                return (
                <div className='flex flex-col gap-2 text-black mb-2' key={entry._id}>
                    <div> 
                      <p>
                        {entry.input.includes(`You are a dungeon master that will run a text based adventure RPG for me.`) ? ""  : entry.input} 
                      </p>
                    </div>
                    <div><p> {entry.response} </p></div>
                </div>
                )
            })}
          </div>
          <form 
          className='flex items-center'
          onSubmit={(e) => {
            e.preventDefault();
            setMessage('');
            handlePlayerAction({message, adventureId: adventureId})
          }}>
              <div className='flex items-center justify-start' onClick={() => setRolled(true)}>
                <ReactDice
                  dotColor='#000000'
                  faceColor='#ffffff'
                  numDice={1}
                  ref={reactDice}
                  rollDone={rollDone}
                  dieSize={30}
                  rollTime={1}
                />
              </div>
              <input 
                className='text-black w-[400px] h-[40px] rounded p-2' 
                name="message" 
                placeholder='type your response here'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className='bg-yellow-600 hover:bg-yellow-700 text-white rounded mx-2 p-2'>Send</button>
          </form>
        </div>
        <div>
        {((lastEntry && lastEntry.imageUrl) ? (
           <div className="h-[300px] w-[500px] rounded bg-cover" style={{backgroundImage: `url(${lastEntry.imageUrl})`}} />
            ) : (
              <div className='flex relative items-center justify-center bg-cover rounded h-[300px] w-[500px]'> 
                <span className='text-white z-[2]'>Generating Scene...</span>
                <Image alt='blur image' className='absolute rounded blur' src={BlurImage} height={300} width={500}/>
              </div>
           )
          )}
          <div className='h-[2px] bg-teal-900 my-8 rounded' />
          <div className='flex items-center'>
            { playerIcon && <Image className='mr-4 rounded-full' alt='picture of character class' src={playerIcon} width={50} height={50}/>}
            <div>
              <h2>{adventureClass}</h2>
              <div className='flex items-center'>
                {new Array(lastEntry?.health).fill('').map((e,idx) => {
                  return <Image alt="heart icon" key={idx} src={HeartIcon} height={30} width={30}/>
                })}
                <p className='text-white'>{lastEntry?.health}/10 </p>
              </div>
            </div>
          </div>
          <div className='h-[2px] bg-teal-900 my-8 rounded' />
          <h1 className='text-white mb-4'>Inventory</h1>
          <div className='flex flex-col gap-4'>
            {inventoryItems?.map((item, idx) => {
              return (
              <div className='flex items-center' key={item._id}>
                {item.imageUrl && <Image className='mr-2 rounded-full' alt="icon of inventory item" src={item.imageUrl} width={50} height={50}/>}
                <p> {item.itemName}</p>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

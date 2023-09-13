"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import HeartIcon from '../../../../public/icon-color-heart.svg';

export default function Adventure(props: {params: {adventureId: Id<'adventures'>}}) {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const adventureId = props.params.adventureId;
  const entries = useQuery(api.chat.getAllEntries, {
    adventureId,
  });
  const inventoryItems = useQuery(api.inventory.getAllItems, {
    adventureId,
  });
  const [message, setMessage] = useState('')
  const lastEntry = entries && entries[entries.length - 1];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

        <div className='flex flex-col'>
          <div className='bg-white rounded-xl h-[450px] w-[600px] mb-2 p-2 overflow-y-auto'>
            {entries?.map((entry) => {
              return (
              <div className='flex flex-col gap-2 text-black mb-2' key={entry._id}>
                  <div> {entry.input} </div>
                  <div> {entry.response} </div>
              </div>
              )
            })}
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            setMessage('')
            handlePlayerAction({message, adventureId: adventureId})
          }}>
              <input 
              className='text-black w-[400px] h-[40px] rounded p-2' 
              name="message" 
              placeholder='type your response here'
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              />
              <button className='bg-white text-black rounded mx-2 p-2'>Submit</button>
          </form>
        </div>
        <div>
        {((lastEntry && lastEntry.imageUrl) ? (
           <div>
            <Image width={350} height={350} alt='picture of adventure' src={lastEntry.imageUrl} />
           </div>
            ) : (
           <span className='text-white'>loading...</span>)
          )}
          <div className='flex items-center'>
            <h1 className='text-white'> HP: {lastEntry?.health} </h1>
            {new Array(lastEntry?.health).fill('').map((e,idx) => {
              return <Image alt="heart icon" key={idx} src={HeartIcon} height={30} width={30}/>
            })}
          </div>
            <h1 className='text-white'>Inventory:</h1>
          <div className='flex text-white'>
            {inventoryItems?.map((item, idx) => {
              return (
              <div key={item._id}>
                <p> {item.itemName}</p>
                {item.imageUrl && <Image  alt="icon of inventory item" src={item.imageUrl} width={70} height={70}/>}
              </div>
              )
            })}
          </div>
          </div>
      </div>
    </main>
  )
}

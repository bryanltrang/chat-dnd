"use client";

import Image from 'next/image'
import { useState } from 'react'
import { useAction, useQuery } from "convex/react";
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function Adventure(props: {params: {adventureId: Id<'adventures'>}}) {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const adventureId = props.params.adventureId;
  const entries = useQuery(api.chat.getAllEntries, {
    adventureId: adventureId,
  });
  const [message, setMessage] = useState('')

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
            // TODO convex action
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

      </div>
    </main>
  )
}

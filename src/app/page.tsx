"use client";

import Image from 'next/image'
import { useState } from 'react'
import { useAction, useQuery } from "convex/react";
import { api } from '../../convex/_generated/api';

export default function Home() {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const entries = useQuery(api.chat.getAllEntries);
  const [message, setMessage] = useState('')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

        <div className='flex flex-col'>
          <div className='bg-white rounded-xl h-[400px] w-[500px] mb-2 p-2 overflow-y-auto'>
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
            handlePlayerAction({message})
          }}>
              <input name="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              />
              <button className='bg-white rounded-l mx-2 p-2'>Submit</button>
          </form>
        </div>

      </div>
    </main>
  )
}

'use client'
import React, { useEffect, useState } from 'react'

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'
import fetchSuggestion from '@/lib/fetchSuggestion'

type Props = {}

const Header = (props: Props) => {
    const [loading, setloading] = useState<boolean>(false)
    const [suggestion, setSuggestion] = useState<string>('')


    const [searchString, setSearchString, board ] = useBoardStore(state => [state.searchString, state.setSearchString, state.board])

    useEffect(() => {
        if(board.columns.size === 0) return;

        setloading(true)

        const fetchSuggestionFunc = async () => {
            const suggestion = await fetchSuggestion(board);

            setSuggestion(suggestion)
            setloading(false)
        }

        fetchSuggestionFunc();
    }, [board])


  return (
    <header>
        <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>

            <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-purple-500 rounded-md filter blur-3xl opacity-50 -z-50' />

            <h2 className='text-purple-700 text-3xl flex font-extrabold'>Rello</h2>

            <div className='flex items-center space-x-5 flex-1 justify-end w-full'>

                <form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
                    <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                    <input type="text" placeholder='Search' className='flex-1 outline-none p-2' value={searchString} onChange={e => setSearchString(e.target.value)} />
                    <button type='submit' hidden>search</button>
                </form>

                {/* avatar */}
                <Avatar name='Patrick Miracle Oliver' round color='purple' size='50' />
            </div>

        </div>

        <div className='flex items-center justify-center py-2 md:py-5 px-5'>
            <p className='text-sm pr-5 flex items-center italic bg-white w-fit rounded-xl shadow-lg max-w-3xl text-purple-500 p-5'> <UserCircleIcon className={`inline-block h-10 w-10 text-purple-500 mr-1 ${loading && 'animate-spin'}`} /> {suggestion  && !loading ? suggestion : 'GPT is summarizing your task for the day...'}</p>
        </div>
    </header>
  )
}

export default Header
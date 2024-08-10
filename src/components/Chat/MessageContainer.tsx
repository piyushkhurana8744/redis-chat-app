import React, { useEffect } from 'react'
import ChatBottomBar from './ChatBottomBar'
import MessageList from './MessageList'
import ChatTopBar from './ChatTopBar'
import { useSelectedUser } from '@/store/useSelectedUser'

const MessageContainer = () => {

  const {setSelectedUser} = useSelectedUser()
  useEffect(() => {
   const handleEscape = (e:KeyboardEvent) => {
    if(e.key === 'Escape'){
      setSelectedUser(null)
    }
   }
   document.addEventListener('keydown',handleEscape)

   return () => {
      document.removeEventListener('keydown',handleEscape)
   }
  },[setSelectedUser])
  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <ChatTopBar />
      <div className='overflow-y-auto overflow-x-hidden w-full h-full flex flex-col'>
       <MessageList />
       <ChatBottomBar />
      </div>
    </div>
  )
}

export default MessageContainer



import React, { useState ,useRef, useEffect} from 'react'
import {Image as ImageIcon, Loader, SendHorizonal, ThumbsUp} from 'lucide-react'
import { AnimatePresence,motion } from 'framer-motion'
import { Textarea } from '../ui/textarea'
import EmojiPicker from './EmojiPicker'
import { Button } from '../ui/button'
import useSound from 'use-sound'
import usePreferences from '@/store/usePreferences'
import { useSelectedUser } from '@/store/useSelectedUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessageAction } from '@/actions/message.action'

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import Image from 'next/image'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { pusherClient } from '@/lib/pusher'
import { Message } from "@/db/dummy";

const ChatBottomBar = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [message,setMessage]  = useState("")
  const queryClient = useQueryClient()

  const {user:currentUser} = useKindeBrowserClient()

  const [playSound1] = useSound('/sounds/keystroke1.mp3')
  const [playSound2] = useSound('/sounds/keystroke2.mp3')
  const [playSound3] = useSound('/sounds/keystroke3.mp3')
  const [playSound4] = useSound('/sounds/keystroke4.mp3')
  const [playNotificationSound] = useSound("/sounds/notification.mp3");

  const {soundenabled} = usePreferences()

  const {selectedUser} = useSelectedUser()

  const [imgUrl,setImgUrl] = useState("")


  const playbacksoundarray = [playSound1,playSound2,playSound3,playSound4]

  const randomSound = () => {
    const randomIndex = Math.floor(Math.random() * playbacksoundarray.length)
    console.log(randomIndex,"randomIndex")
    soundenabled && playbacksoundarray[randomIndex]()
  }

  const {mutate:sendmessage,isPending} = useMutation({
    mutationFn: sendMessageAction
  })

  const handeleSendMessage = () => {
    sendmessage({content:message,receiverId:selectedUser?.id!,messageType:"text"})
    setMessage('')
    textAreaRef.current?.focus()
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      console.log("enter key is pressed")
      handeleSendMessage()
    }

    if(e.key === 'Enter' && e.shiftKey){
      e.preventDefault()
      setMessage(message + '\n')
    }
  }

  useEffect(() => {
    // Generate a unique channel name based on the current and selected user IDs
    const channelName = `${currentUser?.id}__${selectedUser?.id}`.split("__").sort().join("__");

    // Subscribe to the channel using Pusher
    const channel = pusherClient.subscribe(channelName);

    // Handle incoming new messages
    const handleNewMessage = (data: { message: Message }) => {
        queryClient.setQueryData(['messages', selectedUser?.id], (oldData: Message[] | undefined) => {
            return [...(oldData || []),data.message];
        });
        if (soundenabled && data.message.senderId !== currentUser?.id) {
          playNotificationSound();
        }
    };

    // Bind the 'newMessage' event to the handler
    channel.bind('newMessage', handleNewMessage);

    // Cleanup function to unbind the event and unsubscribe from the channel
    return () => {
        channel.unbind('newMessage', handleNewMessage);
        pusherClient.unsubscribe(channelName);
    };
}, [currentUser?.id, selectedUser?.id, queryClient,playNotificationSound, soundenabled]);

  

  
  return (
    <div className='p-2 flex justify-between w-full items-center gap-2'>
      {!message.trim() && 
      <CldUploadWidget 
      signatureEndpoint={"/api/sign-cloudinary-params"}
      onSuccess={(result,{widget}) =>{
        setImgUrl((result.info as CloudinaryUploadWidgetInfo).secure_url )
        widget.close()
      }}
      >
      {({ open }) => {
        return (
          <ImageIcon
           size={20} 
           onClick={() => open()}
           className='cursor-pointer text-muted-foreground'/>
        );
      }}
    </CldUploadWidget>
      }

      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preivew</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center relative h-96 w-full mx-auto'>
            <Image src={imgUrl} alt="Image Preivew" fill className="object-contain"/>
          </div>
          <DialogFooter>
          <Button
          onClick={() => {
            sendmessage({
              content:imgUrl,messageType:"image",receiverId:selectedUser?.id!
            })
            setImgUrl('')
          }}
          >Send</Button>
        </DialogFooter>
        </DialogContent>
        
      </Dialog>

      <AnimatePresence>
        <motion.div
         layout
         initial={{ opacity: 0,scale:1,}}
         animate={{ opacity: 1,scale:1 }}
         exit={{ opacity: 0,scale:1 }}
         transition={{
          duration: 0.5,
          layout:{
            type:"spring",
            bounce:0.15,
          }
         }}
         className='w-full relative'
        >
       <Textarea 
       autoComplete='off'
       placeholder='Type a message...'
       rows={1}
       className='w-full border rounded-full flex items-center h-9 resize-none overflow-hidden min-h-0'
       value={message}
       onChange={(e) => {
        setMessage(e.target.value)
        randomSound()
       }}
       onKeyDown={handleKeyDown}
       ref={textAreaRef}
       />
       <div className='absolute right-2 bottom-0.5'>
       <EmojiPicker 
       onChange = {
        (emoji) => {
          setMessage(message + emoji)
          textAreaRef.current?.focus()
        }
       }
       />
       </div>
      
        </motion.div>
          {
            message.trim() ? (
              <Button onClick={()=>{
                handeleSendMessage()
              }} className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:text-white shrink' size="icon">
                <SendHorizonal size={20} className='text-muted-foreground' />
              </Button>
            ):(
              <Button size={"icon"} className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:text-white shrink'>
                 {
                  !isPending?(
                   <ThumbsUp size={20} className='text-muted-foreground' onClick={()=>{
                    sendmessage({
                      content:"👍",
                      messageType:"text",
                      receiverId:selectedUser?.id!
                    })
                   }}/>
                  ):(
                    <Loader size={20} className='animate-spin'/>
                  )
                 }
              </Button>
            )
          }
      </AnimatePresence>
    </div>
  )
}

export default ChatBottomBar

"use client";

import React from 'react'
import { SmileIcon } from "lucide-react"

import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"

interface EmojiPickerProps {
  onChange: (emoji: string) => void
}

const EmojiPicker = ({onChange}:EmojiPickerProps) => {
  const {theme} = useTheme()
  return (
    <div>
       <Popover>
          <PopoverTrigger>
            <SmileIcon className='h-5 w-5 text-muted-foreground hover:text-foreground transition'/> 
          </PopoverTrigger>
          <PopoverContent className='w-full p-0'>
            <Picker onEmojiSelect={(emoji:any)=>onChange(emoji.native)} size={18} data={data} maxFrequentRows={1} theme={theme === "dark"?"dark":'light'} />
          </PopoverContent>
        </Popover>
    </div>
  )
}

export default EmojiPicker

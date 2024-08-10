"use client"

import { CheckAuthStatus } from '@/actions/auth.action'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import React from 'react'

import { useRouter } from 'next/navigation'



const page = async() => {

   const router = useRouter()


 

   const { data, isLoading } = useQuery({
      queryKey: ['auth'],
      queryFn: async () => {
        return await CheckAuthStatus();
      }
    });

  console.log(data,'data')

  if(data?.success){
   router.push('/')
  }

  return <div className='mt-20 w-full justify-center'>
     <div className='flex flex-col items-center gap-2'>
     <Loader className='w-10 h-10 animate-spin text-muted-foreground'/>
     <h3 className='text-xl font-bold'>
        Redirecting...
     </h3>
     <p>
        Please Wait...
     </p>
     </div>
    </div>
  
}

export default page

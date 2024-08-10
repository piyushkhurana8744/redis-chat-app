"use client"

import React, { ReactNode } from 'react'

import {QueryClient,QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient()

const TanstackProvider = ({children}:{children:ReactNode}) => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    </div>
  )
}

export default TanstackProvider

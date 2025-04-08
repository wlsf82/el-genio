'use client'

import { system } from '@/theme'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}

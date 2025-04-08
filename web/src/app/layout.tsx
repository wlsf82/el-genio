import { PageHeader } from '@/components/page-header'
import { Providers } from '@/components/providers'
import { Flex } from '@chakra-ui/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Test Genie - No-code AI testing',
  description:
    'Test Genie is a no-code AI testing tool that allows you to create and run tests for your web application.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Flex flexDir="column" minH="100dvh">
            <PageHeader />
            {children}
          </Flex>
        </Providers>
      </body>
    </html>
  )
}

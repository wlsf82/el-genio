'use client'

import { BoxProps } from '@chakra-ui/react'
import React from 'react'

export type TestSuite = {
  id: string
  name: string
  description: string
}

interface SuitesDashboardContextValue {
  suites: TestSuite[]
  runningSuiteIds: string[]
  runTestSuite: (suiteId: string) => void
}

const SuitesDashboardContext = React.createContext<SuitesDashboardContextValue | null>(null)

export const useSuitesDashboardContext = () => {
  const context = React.useContext(SuitesDashboardContext)
  if (!context) {
    throw new Error('SuitesDashboard components must be used within SuitesDashboard.Root')
  }
  return context
}

interface SuitesDashboardRootProps extends BoxProps {
  children: React.ReactNode
}

export const SuitesDashboardRoot = ({ children }: SuitesDashboardRootProps) => {
  const { suites } = useGetAllTestSuites()
  const [runningSuiteIds, setRunningSuiteIds] = React.useState<string[]>([])

  const runTestSuite = async (suiteId: string) => {
    try {
      setRunningSuiteIds(prev => [...prev, suiteId])

      const response = await fetch(`http://localhost:3003/api/test-suites/${suiteId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grepTags: [],
        }),
      })

      const data = await response.json()
      console.log('Run test suite response:', data)
    } catch (error) {
      console.error(`Failed to run test suite ${suiteId}:`, error)
    } finally {
      setRunningSuiteIds(prev => prev.filter(id => id !== suiteId))
    }
  }

  return (
    <SuitesDashboardContext.Provider value={{ suites, runningSuiteIds, runTestSuite }}>
      {children}
    </SuitesDashboardContext.Provider>
  )
}

const useGetAllTestSuites = () => {
  const [suites, setSuites] = React.useState<TestSuite[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3003/api/test-suites')
      const data = await response.json()
      setSuites(data)
    }

    fetchData()
  }, [])

  return {
    suites,
  }
}

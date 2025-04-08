'use client'

import { Stack } from '@chakra-ui/react'
import { useSuitesDashboardContext } from './context'
import { SuitesDashboardListItem } from './list-item'

export const SuitesDashboardList = () => {
  const { suites } = useSuitesDashboardContext()

  return (
    <Stack gap="4">
      {suites.map(suite => (
        <SuitesDashboardListItem key={suite.id} suite={suite} />
      ))}
    </Stack>
  )
}

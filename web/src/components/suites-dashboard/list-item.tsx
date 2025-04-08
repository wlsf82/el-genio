'use client'

import { Box, Button, ButtonGroup, Card, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { LuPencil, LuPlay } from 'react-icons/lu'
import { TestSuite, useSuitesDashboardContext } from './context'

interface SuitesDashboardListItemProps {
  suite: TestSuite
}

export const SuitesDashboardListItem = ({ suite }: SuitesDashboardListItemProps) => {
  const { runTestSuite, runningSuiteIds } = useSuitesDashboardContext()

  return (
    <Card.Root size="sm">
      <Card.Body>
        <HStack gap="4">
          <Box flex="1">
            <Card.Title>{suite.name}</Card.Title>
            <Card.Description>{suite.description}</Card.Description>
          </Box>

          <ButtonGroup gap="2">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={() => runTestSuite(suite.id)}
              disabled={runningSuiteIds.length > 0}
              loading={runningSuiteIds.includes(suite.id)}
              loadingText="Running..."
            >
              <LuPlay />
              Run
            </Button>

            <Link href={`/suites/${suite.id}`}>
              <Button variant="outline" colorPalette="gray">
                <LuPencil />
                Edit
              </Button>
            </Link>
          </ButtonGroup>
        </HStack>
      </Card.Body>
    </Card.Root>
  )
}

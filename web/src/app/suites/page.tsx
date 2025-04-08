import { SuitesDashboard } from '@/components/suites-dashboard'
import { Box, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.xl">
      <Stack height="full">
        <HStack px="4" py="4" justify="space-between" borderBottomWidth="1px">
          <HStack gap="8">
            <HStack gap="4">
              <Text fontWeight="medium" textStyle="sm" hideBelow="sm">
                Project name
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <Flex direction="row" flex="2">
          <Box borderRightWidth="1px" flex="1" maxW="sm" p={4} px="4" py="4">
            <SuitesDashboard.Root>
              <SuitesDashboard.List />
            </SuitesDashboard.Root>
          </Box>

          <Box flex="1" width="full" px="4" py="4">
            <p>logs and details</p>
          </Box>
        </Flex>
      </Stack>
    </Container>
  )
}

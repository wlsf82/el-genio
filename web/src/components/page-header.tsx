import { Box, Button, Container, HStack, Link } from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { Logo } from './logo'
export const PageHeader = () => {
  return (
    <Box borderBottomWidth="1px" bg="bg.panel" mb={10}>
      <Container maxW="container.xl" py={{ base: '3.5', md: '4' }}>
        <HStack justify="space-between">
          <Logo />

          <Link href="/create-test-suite">
            <Button>
              <LuPlus />
              Create test
            </Button>
          </Link>
        </HStack>
      </Container>
    </Box>
  )
}

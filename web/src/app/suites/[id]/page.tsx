import { Container, Stack, Text } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="xl" py="20">
      <Stack gap="6">
        <Stack gap="1">
          <Text fontWeight="semibold" textStyle="lg">
            Test suite details
          </Text>
          <Text color="fg.muted">tbd</Text>
        </Stack>
      </Stack>
    </Container>
  )
}

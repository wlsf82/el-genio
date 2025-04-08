import { CreateSuiteForm } from '@/components/create-suite-form'
import { Container, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.lg">
      <Heading size="2xl">Create test suite</Heading>

      <CreateSuiteForm.Root>
        <CreateSuiteForm.Details />
      </CreateSuiteForm.Root>
    </Container>
  )
}

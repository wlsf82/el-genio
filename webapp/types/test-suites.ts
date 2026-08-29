import { TestCase, TestCaseStep } from './test-case'

export interface TestSuite {
  id: string
  name: string
  projectId: string
  testCases: TestCase[]
  beforeEachSteps: TestCaseStep[]
  commandTimeout: number | null
  createdAt: string
  updatedAt: string
}

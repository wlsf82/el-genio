export interface TestCaseStep {
  command: string
  selector: string
  value: string
  lengthValue: string
  containedText: string
  equalText: string
  chainOption: string
}

export interface TestCase {
  description: string
  steps: TestCaseStep[]
}

export interface TestCaseFormData {
  name: string
  commandTimeout: number | null
  testCases: TestCase[]
}

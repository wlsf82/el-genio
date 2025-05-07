export interface TestCaseStep {
  command: string
  selector: string
  value: string
  lengthValue: string
  containedText: string
  equalText: string
}

export interface TestCase {
  description: string
  steps: TestCaseStep[]
}

export interface FormData {
  name: string
  command_timeout: string
  test_cases: TestCase[]
}

import { TestSuite } from '@/types/test-suites'

export const runTestSuiteById = async (testSuiteId: string): Promise<TestSuite[]> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-suites/${testSuiteId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error running test suite:', error)
    throw error
  }
}

export const runAllTestSuites = async (projectId: string): Promise<TestSuite[]> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-run/project/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error running all test suites for project:', error)
    throw error
  }
}

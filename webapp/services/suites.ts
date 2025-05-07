import { TestSuite } from '@/types/test-suites'

export const fetchTestSuites = async (projectId: string): Promise<TestSuite[]> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-suites/project/${projectId}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching test suites:', error)
    throw error
  }
}

export const deleteTestSuite = async (suiteId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-suites/${suiteId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting test suite:', error)
    throw error
  }
}

export const updateTestSuite = async (
  suiteId: string,
  data: {
    name: string
    description?: string
    testCases?: any[]
    beforeEachSteps?: any[]
    commandTimeout?: number | null
  },
): Promise<TestSuite> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-suites/${suiteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating test suite:', error)
    throw error
  }
}

export const createTestSuite = async (data: {
  name: string
  projectId: string
  commandTimeout?: number | null
  testCases: {
    name: string
    steps: { command: string; target: string }[]
  }[]
}): Promise<TestSuite> => {
  try {
    const response = await fetch(`http://localhost:3003/api/test-suites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating test suite:', error)
    throw error
  }
}

import { TestSuite } from '@/types/test-suites'

export const runTestSuite = async (projectId: string): Promise<TestSuite[]> => {
  try {
    // const response = await axios.post(`/api/test-run/project/${projectId}`);
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
    console.error('Error running test suite:', error)
    throw error
  }
}

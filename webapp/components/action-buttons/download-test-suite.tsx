import { DownloadIcon } from 'lucide-react'
import { Button } from '../ui/button'

export const DownloadTestSuiteButton = ({ suiteId }: { suiteId: string }) => {
  const downloadTestFile = () => {
    const downloadUrl = `http://localhost:3003/api/test-suites/${suiteId}/download`
    const a = document.createElement('a')

    a.href = downloadUrl
    document.body.appendChild(a)

    a.click()
    document.body.removeChild(a)
  }

  return (
    <Button size="icon" variant="ghost" aria-label="Download" onClick={downloadTestFile}>
      <DownloadIcon className="w-4 h-4" />
    </Button>
  )
}

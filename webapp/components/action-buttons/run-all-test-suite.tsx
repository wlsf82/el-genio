'use client'

import { runAllTestSuites } from '@/services/run-suites'
import { Loader2, PlayIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

export const RunAllTestSuitesButton = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = React.useState(false)
  const [running, setRunning] = React.useState(false)
  const [result, setResult] = React.useState({})

  const onRunTestSuite = async () => {
    setRunning(true)

    const result = await runAllTestSuites(projectId)

    setResult(result)
    setOpen(true)
    setRunning(false)
  }

  return (
    <>
      <Button variant="outline" aria-label="Run All Test Suites" onClick={onRunTestSuite} disabled={running}>
        {running ? <Loader2 className="animate-spin" /> : <PlayIcon className="w-4 h-4" />}
        Run all suites
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Suite Result</DialogTitle>
            <DialogDescription asChild>
              <p>{JSON.stringify(result, null, 2)}</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

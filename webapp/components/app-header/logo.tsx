import { Lightbulb } from 'lucide-react'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        <div className="px-2 py-1 text-xs flex items-center">EL GENIO</div>
      </div>
    </Link>
  )
}

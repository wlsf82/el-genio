'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AppSidebarMenuItemProps {
  label: string
  href: string
}

export function AppSidebarMenuItem({ label, href }: AppSidebarMenuItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`px-4 py-2 flex rounded-md ${isActive ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
      <span className="text-sm">{label}</span>
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useIsServer } from '@/hooks/useIsServer'

type GoBackProps = React.HTMLAttributes<HTMLElement>

export const GoBack = (props: GoBackProps) => {
  const isServer = useIsServer()
  const router = useRouter()

  if (isServer) {
    // no javascript fallback
    return <Link href='./' {...props} />
  }

  return <button {...props} onClick={() => router.back()} />
}

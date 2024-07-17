'use client'

import { useEffect, useState } from 'react'

import { type TOCProps } from 'react-markdown-toc/client'

import { TOCClient } from './toc'

function useIsLinux(): boolean {
  const [isLinux, setIsLinux] = useState<boolean>(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      const userAgent = navigator.userAgent
      setIsLinux(userAgent.includes('Linux'))
    }
  }, [])

  return isLinux
}

interface LinuxAwareComponentProps {
  toc: TOCProps['toc']
}

const LinuxAwareComponent: React.FC<LinuxAwareComponentProps> = ({ toc }) => {
  const isLinux = useIsLinux()

  return (
    <aside
      className={`sticky-table sticky top-14 ml-auto h-fit w-[25ch] max-xl:hidden ${isLinux ? 'linux-special-class' : ''}`}
    >
      <h2 className='mb-4 whitespace-nowrap text-lg font-semibold tracking-wider has-[+ul:empty]:hidden'>
        TABLE OF CONTENTS
      </h2>
      <TOCClient toc={toc} />
    </aside>
  )
}

export default LinuxAwareComponent

'use client'

import Giscus from '@giscus/react'
import { useDarkToggle } from 'dark-toggle/react'

interface GiscusScriptProps {
  number: number
  repo: `${string}/${string}`
}

export function GiscusScript(props: GiscusScriptProps) {
  const { number, repo } = props
  const { isDark } = useDarkToggle()

  return (
    <div className='mt-32'>
      <Giscus
        repo={repo}
        repoId='R_kgDOMAUA8g'
        mapping='number'
        term={`${number}`}
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='top'
        lang='en'
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  )
}

import { useState, Children, cloneElement } from 'react'

import { useIsServer } from '@/hooks/useIsServer'

export type TypedChildProps = {
  children: React.ReactNode
  active?: boolean
  onRendered?: VoidFunction
}

export interface TypedProps {
  children: React.ReactElement<TypedChildProps>[]
}

export const Typed = (props: TypedProps) => {
  const { children } = props
  const isServer = useIsServer()
  const [index, setIndex] = useState(0)

  if (isServer) {
    return children
  }

  const arrayChildren = Children.toArray(children)

  const renderChildren = arrayChildren.slice(
    0,
    index + 1,
  ) as React.ReactElement<TypedChildProps>[]

  return (
    <div>
      {renderChildren.map((child, childIndex) =>
        cloneElement(child, {
          ...child.props,
          active: childIndex === index,
          onRendered() {
            setIndex(pre => pre + 1)
          },
        }),
      )}
    </div>
  )
}

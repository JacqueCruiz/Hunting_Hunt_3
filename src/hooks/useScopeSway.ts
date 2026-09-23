import { useEffect, useRef, useState } from 'react'
import { ScopeController } from '../weapons/ScopeController'

export function useScopeSway(active: boolean) {
  const controller = useRef(new ScopeController())
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!active) {
      setOffset({ x: 0, y: 0 })
      return
    }
    let frame = 0
    const tick = () => {
      setOffset(controller.current.getOffset())
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])

  return offset
}

import './Carousel.css'
import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export default function Carousel({ children }: Props) {
  return (
    <div
      className="carousel"
      style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}
    >
      {children}
    </div>
  )
}

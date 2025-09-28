

import './Chip.css'
import type { MouseEventHandler } from 'react'

type Props = {
  label: string
  active?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Chip({ label, active=false, onClick }: Props) {
  return (
    <button type="button" className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}

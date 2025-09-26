
// Повторно используемая кнопка-таб для жанров/фильтров.
// Рисуем «пилюльки» в полосе жанров на Home и Search – именно их и рендерит этот компонент.
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

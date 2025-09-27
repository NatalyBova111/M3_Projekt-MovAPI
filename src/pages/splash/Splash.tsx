import './Splash.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const nav = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => {
      nav('/intro', { replace: true })
    }, 1500)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="splash">
      {/* «телефонная» рамка фиксированной ширины, центрированная */}
      <div className="splash-frame" onClick={() => nav('/intro', { replace: true })}>
        <div className="logo">.MOV</div>
      </div>
    </div>
  )
}

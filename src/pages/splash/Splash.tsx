import './Splash.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const nav = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => {
      // КУДА переходить: на Intro или сразу на Home
      nav('/intro', { replace: true })
    }, 1500) // длительность сплэша (мс)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="splash" onClick={() => nav('/intro', { replace: true })}>
      <div className="logo">.MOV</div>
    </div>
  )
}

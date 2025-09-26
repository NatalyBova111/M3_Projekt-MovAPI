import './Intro.css'
import { useNavigate } from 'react-router-dom'

export default function Intro() {
  const nav = useNavigate()

  const start = () => {
    // запоминаем, что Intro уже видели
    localStorage.setItem('seenIntro', '1')
    // переходим на главную без возможности вернуться назад на Intro
    nav('/home', { replace: true })
  }

  return (
    <div className="intro">
      <div className="intro-frame">
        <div className="intro-hero-bg" />

        <img className="intro-card home" src="/img/1.png" alt="Home preview" />
        <img className="intro-card desc" src="/img/2.png" alt="Details preview" />

        <section className="intro-sheet">
          <h2 className="intro-title">Enjoy Your Movie<br/>Watch Everywhere</h2>
          <p className="intro-subtitle">
            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
          </p>
          <button className="intro-btn" onClick={start}>Get Started</button>
        </section>
      </div>
    </div>
  )
}

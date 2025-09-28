import './Intro.css'
import { useNavigate } from 'react-router-dom'
import intro1 from '../../assets/1.png';
import intro2 from '../../assets/2.png';


export default function Intro() {
  const nav = useNavigate()

  const start = () => {
    nav('/home', { replace: true })
  }

  return (
    <div className="intro">
      <div className="intro-frame">
        <div className="intro-hero-bg" />

<img className="intro-card home" src={intro1} alt="Home preview" />
<img className="intro-card desc" src={intro2} alt="Details preview" />

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

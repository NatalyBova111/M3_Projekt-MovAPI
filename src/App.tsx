import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/splash/Splash'
import Intro from './pages/intro/Intro'
import Home from './pages/home/Home'
import Search from './pages/search/Search'
import MovieDetails from './pages/moviedetails/MovieDetails'
import Trailer from './pages/trailer/Trailer'
import Favorites from './pages/favorites/Favorites'

export default function App() {
  return (
    <Routes>
      {/* 1) стартует Splash */}
      <Route path="/" element={<Splash />} />

      {/* 2) экран Intro после сплэша */}
      <Route path="/intro" element={<Intro />} />

      {/* 3) основное приложение */}
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/trailer/:id" element={<Trailer />} />
      <Route path="/favorites" element={<Favorites />} />

      {/* 4) всё неизвестное — на Splash */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

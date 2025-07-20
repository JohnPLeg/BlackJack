import Home from './Components/Home/Home'
import Navigation from './Components/Navigation/Navigation'
import Game from './Components/Game/Game'
import { Route, Routes } from 'react-router'

function App() {

  return (
    <>
      <Navigation/>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="Game" element={<Game/>}/>
      </Routes>
    </>
  )
}

export default App

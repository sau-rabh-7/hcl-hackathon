import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h1>Hackathon Ready MERN Setup</h1>
          <p>Frontend connected and rendering correctly.</p>
        </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

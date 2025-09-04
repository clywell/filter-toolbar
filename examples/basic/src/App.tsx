import './App.css'
import { Routes, Route } from "react-router-dom";
import FilterPage from './pages/FilterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FilterPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}


export default App

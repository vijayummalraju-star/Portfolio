import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



// นำเข้าคอมโพเนนต์สำหรับหน้า Login และ Register
import LoginPage from './pages/LoginPage';
import AdminPage from "./pages/AdminPage";
import RegisterPage from './pages/RegisterPage';
// นำเข้าคอมโพเนนต์หน้าเว็บของคุณ
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

// นำเข้าหน้าจองสนามต่างๆ
import BadmintonBookingPage from './pages/BadmintonBookingPage';
import BasketballBookingPage from './pages/BasketballBookingPage';
import TennisBookingPage from './pages/TennisBookingPage';
import VolleyballBookingPage from './pages/VolleyballBookingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* เปิดเว็บครั้งแรก → ไปหน้า Login */}
          <Route path="/" element={<LoginPage />} />

          {/* หน้าอื่นๆ */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Route สำหรับหน้าจองสนาม */}
          <Route path="/book/badminton" element={<BadmintonBookingPage />} />
          <Route path="/book/basketball" element={<BasketballBookingPage />} />
          <Route path="/book/tennis" element={<TennisBookingPage />} />
          <Route path="/book/volleyball" element={<VolleyballBookingPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// นำเข้าคอมโพเนนต์หน้าเว็บของคุณ
import HomePage from './pages/HomePage';

// **นำเข้าคอมโพเนนต์สำหรับหน้าจองใหม่**
// import BadmintonBookingPage from './pages/BadmintonBookingPage';
import BasketballBookingPage from './pages/BasketballBookingPage';
// import TennisBookingPage from './pages/TennisBookingPage';
import VolleyballBookingPage from './pages/VolleyballBookingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/home" element={<HomePage />} /> 

          {/* **เพิ่ม Route สำหรับหน้าจองคอร์ด/สนาม** */}
          {/* <Route path="/book/badminton" element={<BadmintonBookingPage />} /> */}
          <Route path="/book/basketball" element={<BasketballBookingPage />} />
          {/* <Route path="/book/tennis" element={<TennisBookingPage />} /> */}
          <Route path="/book/volleyball" element={<VolleyballBookingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
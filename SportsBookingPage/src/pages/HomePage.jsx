import React, { useState, useEffect } from 'react';
import { LogOut, ArrowRight, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ onLogout, onProfile }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="relative">
            {/* ปุ่มกลม User Icon */}
            <button
                onClick={() => setOpen(!open)}
                className="w-12 h-12 rounded-full bg-gray-100 shadow-md flex items-center justify-center hover:bg-gray-200 transition"
            >
                <User className="w-6 h-6 text-gray-700" />
            </button>

            {/* เมนูโปรไฟล์ */}
            {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-2xl p-4 z-50">
                    <div className="flex flex-col space-y-3">
                        
                        {/* ไปหน้าโปรไฟล์ */}
                        <button
                            onClick={() => {
                                onProfile();
                                setOpen(false);
                            }}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <User className="w-5 h-5 text-gray-700" />
                            <span className="text-gray-800 font-medium">ข้อมูลส่วนตัว</span>
                        </button>

                        {/* ออกจากระบบ */}
                        <button
                            onClick={() => {
                                onLogout();
                                setOpen(false);
                            }}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <LogOut className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-semibold">ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Card กีฬา (แก้เฉพาะส่วนนี้)
const SportCard = ({ title, icon: Icon, imageSrc, onClick }) => (
    <div 
        className="flex flex-col items-center justify-center p-4 bg-[#FFFACD] rounded-xl shadow-md hover:shadow-lg transition cursor-pointer space-y-3 w-full h-40"
        onClick={onClick}
    >
        {Icon ? (
            <Icon className="w-16 h-16 text-gray-800" />
        ) : (
            <img src={imageSrc} alt={title} className="w-12 h-12 object-contain" />
        )}
        <p className="font-semibold text-gray-700">{title}</p>
    </div>
);

// การ์ดประวัติการจอง
const HistoryItem = ({ sport, court, time, status }) => (
    <div className="p-4 bg-yellow-200 rounded-xl shadow-sm hover:bg-yellow-300 transition flex justify-between items-center cursor-pointer">
        <div>
            <p className="font-bold text-gray-800">{sport} - {court}</p>
            <p className="text-sm text-gray-600 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{time}</span>
            </p>
        </div>
        <div className="flex items-center space-x-2">
            <span className="bg-blue-300 text-gray-800 font-bold px-3 py-1 rounded-full text-xs">
                {status}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-600" />
        </div>
    </div>
);

const HomePage = () => {
    const navigate = useNavigate();

    const [bookingHistory, setBookingHistory] = useState([]);
    const [user, setUser] = useState(null);

    // โหลด User + โหลดประวัติแบบแยก User
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));

        // ถ้าไม่มี user ให้กลับไป login
        if (!storedUser) {
            navigate("/");
            return;
        }

        setUser(storedUser);

        const username = storedUser.username;
        const historyJson = localStorage.getItem(`bookingHistory_${username}`);

        if (historyJson) {
            try {
                const historyList = JSON.parse(historyJson);
                setBookingHistory(historyList);
            } catch (e) {
                console.error("Error loading booking history:", e);
            }
        }
    }, [navigate]);

    const primaryBackgroundColor = 'bg-[#B0C4DE]';
    const cardBackgroundColor = 'bg-[#FFFACD]';

    const goToBadmintonBooking = () => navigate('/book/badminton');
    const goToBasketballBooking = () => navigate('/book/basketball');
    const goToTennisBooking = () => navigate('/book/tennis');
    const goToVolleyballBooking = () => navigate('/book/volleyball');

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={`min-h-screen ${primaryBackgroundColor} flex flex-col items-center justify-center p-0`}>
            <div className="w-[95vw] md:w-[85vw] min-h-[95vh] rounded-3xl bg-white p-6 shadow-2xl space-y-8">

                {/* Header */}
                <header className="flex justify-between items-start mb-6 pt-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-0">
                            สวัสดี, {user?.name || "ผู้ใช้"}!
                        </h1>
                        <p className="text-base text-gray-700">สมาชิก</p>
                    </div>
                    <ProfileMenu 
                        onLogout={handleLogout}
                        onProfile={() => navigate('/profile')}
                    />
                </header>

                <hr className="border-gray-200" />

                {/* Sport Cards */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">เลือกสนามกีฬาที่ต้องการจอง</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* ใช้ icon */}
                        <SportCard title="แบดมินตัน" imageSrc="/images/shuttlecock.png" onClick={goToBadmintonBooking} />

                        {/* ใช้ icon */}
                        <SportCard title="บาสเกตบอล" imageSrc="/images/basketball.png" onClick={goToBasketballBooking} />

                        {/* ใช้รูปภาพแทน icon */}
                        <SportCard title="เทนนิส" imageSrc="/images/tennis.png" onClick={goToTennisBooking} />

                        {/* ใช้ icon */}
                        <SportCard title="วอลเล่ย์บอล" imageSrc="/images/volleyball.png" onClick={goToVolleyballBooking} />
                    </div>
                </section>

                <hr className="border-gray-200" />

                {/* History + Rules */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ประวัติการจอง */}
                    <div className={`p-6 rounded-xl shadow-xl ${cardBackgroundColor} space-y-4`}>
                        <h3 className="text-xl font-bold text-gray-700">ประวัติการจอง</h3>

                        <div className="space-y-3">
                            {bookingHistory.length > 0 ? (
                                bookingHistory.map((item, index) => (
                                    <HistoryItem
                                        key={index}
                                        sport={item.sport}
                                        court={item.court}
                                        time={item.time}
                                        status={item.status}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">ยังไม่มีประวัติการจองสนาม</p>
                            )}
                        </div>
                    </div>

                    {/* ระเบียบ */}
                    <div className={`p-6 rounded-xl shadow-xl ${cardBackgroundColor} space-y-4`}>
                        <h3 className="text-xl font-bold text-gray-700">ระเบียบการจองสนาม</h3>
                        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-4">
                            <li>เริ่มการลงจองสนามได้ตั้งแต่เวลา 12:00 น. ของแต่ละวัน เป็นต้นไป และจะล้างข้อมูลการจองทั้งหมดในเวลา 12:00 น.วันถัดไป</li>
                            <li>ลงทะเบียน 1 คน สามารถจองได้ 1 ครั้งต่อวัน</li>
                            <li>หากมีการจองซ้ำในคอร์ดเดียวกัน ระบบจะให้สิทธิ์ผู้ที่ยืนยันก่อน</li>
                            <li>พบปัญหาแจ้งทาง Line OpenChat</li>
                        </ol>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowLeft, AlertTriangle, Volleyball, X } from 'lucide-react'; 

// ================== Modal Component =====================
const BookingModal = ({ message, onClose, isSuccess = false }) => {
    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const title = isSuccess ? 'สำเร็จ' : 'แจ้งเตือน';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        {isSuccess ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${iconColor} mr-2`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <AlertTriangle className={`w-5 h-5 ${iconColor} mr-2`} />
                        )}
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-700">{message}</p>
                <button 
                    onClick={onClose} 
                    className={`w-full ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-[#77AADD] hover:bg-[#6699CC]'} text-white font-bold py-2 rounded-lg transition`}
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

// ================== Status Cell =====================
const StatusCell = ({ status }) => {
    let bgColor;
    let textColor = 'text-gray-700';

    if (status === 'ว่าง') bgColor = 'bg-[#F0F8E4]';
    if (status === 'จองแล้ว') {
        bgColor = 'bg-amber-300';
        textColor = 'text-gray-800 font-semibold';
    }

    return (
        <td className={`p-3 text-center rounded-lg ${bgColor} ${textColor} text-sm`}>
            {status}
        </td>
    );
};

// ================== MAIN PAGE =====================
const VolleyballBookingPage = () => {

    const navigate = useNavigate();

    // 🎨 UI Colors
    const primaryBackgroundColor = 'bg-[#B0C4DE]'; 
    const cardBackgroundColor = 'bg-[#FFFACD]'; 
    const buttonColor = 'bg-[#77AADD]'; 
    const tableHeaderColor = 'bg-[#EDE7F6]'; 
    
    // ================== STATES =====================
    const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // modal
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalSuccess, setIsModalSuccess] = useState(false);

    const showCustomAlert = (message, isSuccess = false) => {
        setModalMessage(message);
        setIsModalSuccess(isSuccess);
        setShowModal(true);
    };

    // ================== ตาราง =====================
    const courtHeaders = ['สนาม1'];
    const courtKeys = ['C1'];

    const initialBookingData = [
        { time: '17.00-18.00', C1: 'ว่าง' },
        { time: '18.00-19.00', C1: 'ว่าง' },
        { time: '19.00-20.00', C1: 'ว่าง' },
        { time: '20.00-21.00', C1: 'ว่าง' },
        { time: '21.00-22.00', C1: 'ว่าง' },
        { time: '22.00-23.00', C1: 'ว่าง' },
    ];

    const [bookingData, setBookingData] = useState(() => {
        // โหลดจาก sessionStorage
        const saved = sessionStorage.getItem("volleyballBookings");
        return saved ? JSON.parse(saved) : initialBookingData;
    });

    // โหลดสถานะว่าจองครบ session หรือยัง
    useEffect(() => {
        const sessionBooked = sessionStorage.getItem("volleyballSessionBooked");
        if (sessionBooked === "true") {
            setIsMaxLimitReached(true);
        }
    }, []);

    // ================== จอง =====================
    const handleBooking = (e) => {
        e.preventDefault();

        if (isMaxLimitReached) {
            showCustomAlert("คุณได้จองวอลเลย์บอลไปแล้วใน session นี้");
            return;
        }

        if (!selectedCourt || !selectedTime) {
            showCustomAlert("กรุณาเลือกสนามและเวลา");
            return;
        }

        const row = bookingData.find(r => r.time === selectedTime);
        if (row[selectedCourt] === "จองแล้ว") {
            showCustomAlert("เวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น");
            return;
        }

        // อัปเดตตาราง
        const updated = bookingData.map(r => {
            if (r.time === selectedTime) {
                return { ...r, [selectedCourt]: "จองแล้ว" };
            }
            return r;
        });

        setBookingData(updated);
        sessionStorage.setItem("volleyballBookings", JSON.stringify(updated));

        // บันทึกว่า session นี้จองแล้ว
        setIsMaxLimitReached(true);
        sessionStorage.setItem("volleyballSessionBooked", "true");

        showCustomAlert("จองสนามสำเร็จ!", true);
    };

    return (
        <div className={`min-h-screen ${primaryBackgroundColor} p-4 md:p-8`}>

            {showModal && (
                <BookingModal 
                    message={modalMessage} 
                    onClose={() => setShowModal(false)} 
                    isSuccess={isModalSuccess} 
                />
            )}

            <div className="max-w-4xl mx-auto space-y-8 rounded-3xl bg-gray-50 p-6 shadow-2xl">

                {/* Header */}
                <header className="flex flex-col items-start mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 bg-gray-50 px-5 py-3 rounded-xl shadow-md text-gray-800 hover:bg-gray-100 font-bold text-xl mb-3" 
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>กลับ</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <Volleyball className="w-8 h-8 text-[#77AADD]" />
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">วอลเลย์บอล</h1>
                            <p className="text-base text-gray-700">เลือกสนามและเวลา</p>
                        </div>
                    </div>
                </header>

                {/* Warning */}
                {isMaxLimitReached && (
                    <div className="flex items-start p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-800 rounded-xl shadow-md">
                        <AlertTriangle className="w-6 h-6 mr-3 mt-0.5 text-orange-600" />
                        <p className="font-semibold">คุณจองแบดมินตันครบ 1 ชั่วโมงแล้วในวันนี้ - แต่คุณยังสามารถจองกีฬาประเภทอื่นได้</p>
                    </div>
                )}

                {/* Form */}
                <section className={`p-6 rounded-xl shadow-xl ${cardBackgroundColor} space-y-4`}>
                    <h3 className="text-xl font-bold text-gray-700 mb-4">เลือกสนามและเวลา</h3>
                    
                    <form onSubmit={handleBooking} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* Court */}
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">สนาม</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-lg shadow-sm bg-white"
                                    value={selectedCourt}
                                    onChange={(e) => setSelectedCourt(e.target.value)}
                                    disabled={isMaxLimitReached}
                                >
                                    <option value="">เลือกสนาม</option>
                                    <option value="C1">สนาม1</option>
                                </select>
                            </div>

                            {/* Time */}
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-lg shadow-sm bg-white"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    disabled={isMaxLimitReached}
                                >
                                    <option value="">เลือกเวลา</option>
                                    {initialBookingData.map((t, i) => (
                                        <option key={i} value={t.time}>{t.time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Button */}
                        {isMaxLimitReached ? (
                            <div className="text-center mt-4 space-y-2">
                                <p className="text-xl font-bold text-green-700">จองสนามสำเร็จ!</p>
                                <div className="w-full bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-md text-lg">
                                    ไม่สามารถจองสนามได้
                                </div>
                            </div>
                        ) : (
                            <button 
                                type="submit" 
                                className={`w-full ${buttonColor} text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#6699CC] text-lg mt-4`}
                            >
                                จองสนาม
                            </button>
                        )}
                    </form>
                </section>

                {/* Table */}
                <section className={`p-6 rounded-xl shadow-xl ${cardBackgroundColor}`}>
                    <h3 className="text-xl font-bold text-gray-700 mb-4">ตารางการจอง (สนาม1)</h3>
                    
                    <div className="overflow-x-auto rounded-xl"> 
                        <table className="w-full border-separate border-spacing-1">
                            <thead>
                                <tr className={`${tableHeaderColor}`}>
                                    <th className="p-3 text-left text-base font-bold text-gray-700 rounded-tl-xl">เวลา</th>
                                    <th className="p-3 text-center text-base font-bold text-gray-700 rounded-tr-xl">สนาม1</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingData.map((row, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="p-3 font-semibold text-gray-800">{row.time}</td>
                                        <StatusCell status={row.C1} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default VolleyballBookingPage;

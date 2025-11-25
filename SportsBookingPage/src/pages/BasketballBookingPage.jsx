import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// =====================================================================
// STATUS CELL
// =====================================================================
const StatusCell = ({ status }) => {
    let bgColor;
    let textColor = 'text-gray-700';

    if (status === 'ว่าง') {
        bgColor = 'bg-[#F0F8E4]';
    } else if (status === 'จองแล้ว') {
        bgColor = 'bg-amber-300 shadow-sm';
        textColor = 'text-gray-800 font-semibold';
    }

    return (
        <td className={`p-3 text-center rounded-lg ${bgColor} ${textColor} text-sm whitespace-nowrap`}>
            {status}
        </td>
    );
};

// =====================================================================
// MODAL
// =====================================================================
const BookingModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        แจ้งเตือน
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-700">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#77AADD] text-white font-bold py-2 rounded-lg hover:bg-[#6699CC] transition"
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

// =====================================================================
// LOAD DATA
// =====================================================================
const loadBookingData = () => {
    const saved = sessionStorage.getItem("basketballBooking");
    return saved ? JSON.parse(saved) : [
        { time: '17.00-18.00', C1: 'ว่าง', C2: 'ว่าง' },
        { time: '18.00-19.00', C1: 'ว่าง', C2: 'ว่าง' },
        { time: '19.00-20.00', C1: 'ว่าง', C2: 'ว่าง' },
        { time: '20.00-21.00', C1: 'ว่าง', C2: 'ว่าง' },
        { time: '21.00-22.00', C1: 'ว่าง', C2: 'ว่าง' },
        { time: '22.00-23.00', C1: 'ว่าง', C2: 'ว่าง' },
    ];
};

// =====================================================================
// MAIN PAGE
// =====================================================================
const BasketballBookingPage = () => {
    const navigate = useNavigate();

    const primaryBackgroundColor = 'bg-[#B0C4DE]';
    const cardBackgroundColor = 'bg-[#FFFACD]';
    const buttonColor = 'bg-[#77AADD]';
    const tableHeaderColor = 'bg-[#EDE7F6]';

    const [bookingData, setBookingData] = useState(loadBookingData);
    const [isMaxLimitReached, setIsMaxLimitReached] = useState(
        sessionStorage.getItem("basketballHasBooked") === "true"
    );

    const [selectedCourt, setSelectedCourt] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const showCustomAlert = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const courtHeaders = ['สนาม 1', 'สนาม 2'];
    const courtKeys = ['C1', 'C2'];
    const timeOptions = bookingData.map((d) => d.time);

    // =====================================================================
    // HANDLE BOOKING
    // =====================================================================
    const handleBooking = (e) => {
        e.preventDefault();

        if (isMaxLimitReached) {
            showCustomAlert("คุณได้ทำการจองบาสเกตบอลแล้วในเซสชันนี้");
            return;
        }

        if (!selectedCourt || !selectedTime) {
            showCustomAlert("กรุณาเลือกสนามและเวลา");
            return;
        }

        const currentRow = bookingData.find(row => row.time === selectedTime);
        if (currentRow[selectedCourt] === "จองแล้ว") {
            showCustomAlert("เวลานี้ถูกจองแล้ว");
            return;
        }

        const newBookingData = bookingData.map(row => {
            if (row.time === selectedTime) {
                return { ...row, [selectedCourt]: "จองแล้ว" };
            }
            return row;
        });

        setBookingData(newBookingData);

        sessionStorage.setItem("basketballBooking", JSON.stringify(newBookingData));
        sessionStorage.setItem("basketballHasBooked", "true");

        setIsMaxLimitReached(true);
        showCustomAlert("จองสำเร็จแล้ว!");
    };

    return (
        <div className={`min-h-screen ${primaryBackgroundColor} p-4 md:p-8`}>
            {showModal && <BookingModal message={modalMessage} onClose={() => setShowModal(false)} />}

            <div className="max-w-6xl mx-auto space-y-8 rounded-3xl bg-gray-50 p-6 shadow-2xl">

                <header className="flex flex-col items-start mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center space-x-2 bg-gray-50 px-5 py-3 rounded-xl shadow-md text-gray-800 hover:bg-gray-100 transition duration-150 font-bold text-xl mb-3"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>กลับ</span>
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-0">บาสเกตบอล</h1>
                        <p className="text-base text-gray-700">เลือกสนามและเวลาที่ต้องการ</p>
                    </div>
                </header>

                {isMaxLimitReached && (
                    <div className="flex items-start p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-800 rounded-xl shadow-md">
                        <AlertTriangle className="w-6 h-6 mr-3 mt-0.5 text-orange-600" />
                        <p className="font-semibold text-gray-800">
                            คุณจองบาสเกตบอลครบ 1 ชั่วโมงแล้ว — แต่ยังสามารถจองกีฬาประเภทอื่นได้
                        </p>
                    </div>
                )}

                {/* Booking Form */}
                <section className={`p-6 rounded-xl shadow-xl ${cardBackgroundColor} space-y-4`}>
                    <h3 className="text-xl font-bold text-gray-700 mb-4">เลือกสนามและเวลา</h3>

                    <form onSubmit={handleBooking} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">

                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">สนาม</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-[#77AADD]"
                                    value={selectedCourt}
                                    onChange={(e) => setSelectedCourt(e.target.value)}
                                    disabled={isMaxLimitReached}
                                >
                                    <option value="">เลือกสนาม</option>
                                    {courtHeaders.map((header, index) => (
                                        <option key={index} value={courtKeys[index]}>
                                            {header}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-[#77AADD]"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    disabled={isMaxLimitReached}
                                >
                                    <option value="">เลือกเวลา</option>
                                    {timeOptions.map((time, index) => (
                                        <option key={index} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

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
                    <h3 className="text-xl font-bold text-gray-700 mb-4">ตารางการจอง</h3>

                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full border-separate border-spacing-2">
                            <thead>
                                <tr className={`${tableHeaderColor}`}>
                                    <th className="p-3 text-left font-bold text-gray-700 rounded-tl-xl">เวลา</th>

                                    {courtHeaders.map((header, index) => (
                                        <th
                                            key={index}
                                            className={`p-3 text-center font-bold text-gray-700 ${index === courtHeaders.length - 1 ? 'rounded-tr-xl' : ''}`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {bookingData.map((row, i) => (
                                    <tr key={i} className="bg-white">
                                        <td className="p-3 font-semibold text-gray-800">{row.time}</td>

                                        {courtKeys.map(key => (
                                            <StatusCell key={key} status={row[key]} />
                                        ))}
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

export default BasketballBookingPage;

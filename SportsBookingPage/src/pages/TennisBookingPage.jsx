import React, { useState } from 'react'
import { ArrowLeft, AlertTriangle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// เปลี่ยน key สำหรับเก็บ tennis
const STORAGE_KEY  = "tennisBooking"
const STORAGE_FLAG = "hasBookedTennis"

// =====================================================================
// 🧩 STATUS CELL
// =====================================================================
const StatusCell = ({ status }) => {
  let bgColor
  let textColor = 'text-gray-700'

  if (status === 'ว่าง') {
    bgColor = 'bg-[#F0F8E4]'
  } else if (status === 'จองแล้ว') {
    bgColor = 'bg-amber-300 shadow-sm'
    textColor = 'text-gray-800 font-semibold'
  }

  return (
    <td className={`p-3 text-center rounded-lg ${bgColor} ${textColor} text-sm whitespace-nowrap`}>
      {status}
    </td>
  )
}

// =====================================================================
// 🧩 BOOKING MODAL (เหมือนวอลเลย์บอล)
// =====================================================================
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

// =====================================================================
// 🧩 LOAD DATA
// =====================================================================
const loadTennisBooking = () => {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)

  const times = [
    '17.00-18.00',
    '18.00-19.00',
    '19.00-20.00',
    '20.00-21.00',
    '21.00-22.00',
    '22.00-23.00',
  ]

  return times.map(time => ({
    time,
    C1: 'ว่าง',
    C2: 'ว่าง',
    C3: 'ว่าง',
    C4: 'ว่าง',
  }))
}

// =====================================================================
// 🎾 TENNIS BOOKING PAGE
// =====================================================================
const TennisBookingPage = () => {
  const navigate = useNavigate()

  const primaryBg     = 'bg-[#B0C4DE]'
  const cardBg        = 'bg-[#FFFACD]'
  const buttonColor   = 'bg-[#77AADD]'
  const tableHdrColor = 'bg-[#EDE7F6]'

  const [bookingData, setBookingData] = useState(loadTennisBooking)
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(
    sessionStorage.getItem(STORAGE_FLAG) === 'true'
  )
  const [selectedCourt, setSelectedCourt] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // 🟩 Popup เหมือนวอลเลย์บอล
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isModalSuccess, setIsModalSuccess] = useState(false)

  const showCustomAlert = (message, isSuccess = false) => {
      setModalMessage(message);
      setIsModalSuccess(isSuccess);
      setShowModal(true);
  };

  const courtHeaders = ['สนาม 1','สนาม 2','สนาม 3','สนาม 4']
  const courtKeys    = ['C1','C2','C3','C4']
  const timeOptions  = bookingData.map(d => d.time)

  // ===================================================================
  // 📌 HANDLE BOOKING
  // ===================================================================
  const handleBooking = e => {
    e.preventDefault()

    if (isMaxLimitReached) {
      showCustomAlert('คุณได้จองเทนนิสครบ 1 ชั่วโมงแล้วในเซสชันนี้')
      return
    }
    if (!selectedCourt || !selectedTime) {
      showCustomAlert('กรุณาเลือกคอร์ดและเวลา')
      return
    }

    const row = bookingData.find(r => r.time === selectedTime)
    if (row[selectedCourt] === 'จองแล้ว') {
      showCustomAlert('เวลานี้ถูกจองแล้ว')
      return
    }

    const newData = bookingData.map(r =>
      r.time === selectedTime ? { ...r, [selectedCourt]: 'จองแล้ว' } : r
    )

    setBookingData(newData)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    sessionStorage.setItem(STORAGE_FLAG, 'true')
    setIsMaxLimitReached(true)

    showCustomAlert("จองสนามสำเร็จ!", true)
  }

  // ===================================================================
  // UI
  // ===================================================================
  return (
    <div className={`min-h-screen ${primaryBg} p-4 md:p-8`}>

      {/* Popup เหมือน Volleyball */}
      {showModal && (
        <BookingModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
          isSuccess={isModalSuccess}
        />
      )}

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
            <h1 className="text-3xl font-bold text-gray-900">เทนนิส</h1>
            <p className="text-base text-gray-700">เลือกคอร์ดและเวลา</p>
          </div>
        </header>

        {isMaxLimitReached && (
          <div className="flex items-start p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-800 rounded-xl shadow-md">
            <AlertTriangle className="w-6 h-6 mr-3 mt-0.5 text-orange-600" />
            <p className="font-semibold text-gray-800">
              คุณจองเทนนิสครบ 1 ชั่วโมงแล้วในวันนี้
            </p>
          </div>
        )}

        {/* Booking Form */}
        <section className={`p-6 rounded-xl shadow-xl ${cardBg} space-y-4`}>
          <h3 className="text-xl font-bold text-gray-700">เลือกคอร์ดและเวลา</h3>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คอร์ด</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-white shadow-sm"
                  value={selectedCourt}
                  onChange={e => setSelectedCourt(e.target.value)}
                  disabled={isMaxLimitReached}
                >
                  <option value="">เลือกคอร์ด</option>
                  {courtHeaders.map((hdr, i) => (
                    <option key={i} value={courtKeys[i]}>
                      {hdr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-white shadow-sm"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  disabled={isMaxLimitReached}
                >
                  <option value="">เลือกเวลา</option>
                  {timeOptions.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {isMaxLimitReached ? (
              <div className="text-center mt-4 space-y-2">
                <p className="text-xl font-bold text-green-700">จองสนามสำเร็จ!</p>
                <div className="w-full bg-gray-300 text-gray-700 font-bold py-3 rounded-lg shadow-md text-lg">
                  ไม่สามารถจองสนามได้
                </div>
              </div>
            ) : (
              <button 
                type="submit"
                className={`w-full ${buttonColor} text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#6699CC] text-lg mt-4`}
              >
                จองคอร์ด
              </button>
            )}
          </form>
        </section>

        {/* ตาราง */}
        <section className={`p-6 rounded-xl shadow-xl ${cardBg}`}>
          <h3 className="text-xl font-bold text-gray-700 mb-4">ตารางการจอง</h3>

          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full border-separate border-spacing-2">
              <thead>
                <tr className={tableHdrColor}>
                  <th className="p-3 text-left font-bold text-gray-700 rounded-tl-xl">เวลา</th>
                  {courtHeaders.map((h, i) => (
                    <th key={i} className="p-3 text-center font-bold text-gray-700">
                      {h}
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
  )
}

export default TennisBookingPage

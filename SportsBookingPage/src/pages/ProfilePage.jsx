import React from 'react';
import { useNavigate } from 'react-router-dom';

const primaryBg = 'bg-[#B0C4DE]';
const contentBg = 'bg-white';
const buttonColor =  'bg-[#77AADD]';
const cardColor = 'bg-[#FFFACD]';

const ProfilePage = () => {
  const navigate = useNavigate();

  // fields template สำหรับ bind API
  const fields = [
    { label: 'ชื่อ', value: '-' },
    { label: 'นามสกุล', value: '-' },
    { label: 'ชื่อผู้ใช้งาน', value: '-' },
    { label: 'อีเมล', value: '-' },
    { label: 'เบอร์โทร', value: '-' },
  ];

  return (
    <div className={`min-h-screen ${primaryBg} p-8`}>
      <div className={`max-w-md mx-auto ${contentBg} p-8 rounded-xl shadow-xl`}>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">ข้อมูลโปรไฟล์</h1>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className={`flex justify-between p-3 ${cardColor} rounded-lg shadow-sm`}
            >
              <span className="font-medium text-gray-600">{field.label}:</span>
              <span className="text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>

        <button
          className={`mt-6 w-full ${buttonColor} text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300`}
          onClick={() => navigate('/home')}
        >
         ย้อนกลับ
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

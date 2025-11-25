import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const RegistrationPage = () => {
    const navigate = useNavigate();

    const primaryBackgroundColor = 'bg-[#B0C4DE]';
    const cardBackgroundColor = 'bg-[#FFFACD]';
    const buttonColor = 'bg-[#77AADD]';

    const buttonStyle = `${buttonColor} text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#6699CC] transition duration-300 w-full text-lg`;
    const inputStyle = 'w-full px-4 py-3 border-none rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#77AADD]';
    const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';

    // state ฟอร์ม
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        // ตรวจสอบง่าย ๆ
        if (!username || !password) {
            setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            setSuccess('');
            return;
        }

        // สร้าง object user
        const userData = {
            firstName,
            lastName,
            username,
            password,
            email,
            tel,
        };

        // บันทึกลง localStorage (เก็บ user เดียว)
        localStorage.setItem('user', JSON.stringify(userData));

        setError('');
        setSuccess('ลงทะเบียนสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...');

        // ไปหน้า login
        setTimeout(() => {
            navigate('/login');
        }, 800);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${primaryBackgroundColor} py-12`}>
            <div className={`w-full max-w-lg p-8 rounded-xl shadow-2xl ${cardBackgroundColor}`}>
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">สมัครสมาชิก</h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 px-3 py-2 rounded-lg">
                        {success}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleRegister}>
                    {/* ชื่อ / นามสกุล */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className={labelStyle}>ชื่อ</label>
                            <input
                                type="text"
                                placeholder="ชื่อจริง"
                                className={inputStyle}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className={labelStyle}>นามสกุล</label>
                            <input
                                type="text"
                                placeholder="นามสกุล"
                                className={inputStyle}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ชื่อผู้ใช้ */}
                    <div>
                        <label className={labelStyle}>ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            placeholder="กรอกชื่อผู้ใช้"
                            className={inputStyle}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* รหัสผ่าน */}
                    <div>
                        <label className={labelStyle}>รหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="ตั้งรหัสผ่าน"
                            className={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* อีเมล */}
                    <div>
                        <label className={labelStyle}>อีเมล</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* เบอร์โทรศัพท์ */}
                    <div>
                        <label className={labelStyle}>เบอร์ที่สามารถติดต่อได้</label>
                        <input
                            type="tel"
                            placeholder="กรอกเบอร์มือถือ"
                            className={inputStyle}
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                        />
                    </div>

                    {/* ปุ่มลงทะเบียน */}
                    <button type="submit" className={`mt-8 ${buttonStyle}`}>
                        ลงทะเบียน
                    </button>
                </form>

                {/* ลิงก์เข้าสู่ระบบ */}
                <div className="mt-4 text-center text-sm">
                    <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
                    <Link to="/login" className="text-[#6495ED] hover:text-[#4169E1] font-medium transition duration-300">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;

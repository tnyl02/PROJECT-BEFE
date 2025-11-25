import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react'; // ใช้ Lucide icons

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const primaryBackgroundColor = 'bg-[#B0C4DE]'; // Light Steel Blue
    const cardBackgroundColor = 'bg-[#FFFACD]'; // Lemon Chiffon
    const buttonColor = 'bg-[#77AADD]'; // Light Blue
    const buttonHoverColor = 'hover:bg-[#6699CC]'; // Darker Light Blue
    const linkColor = 'text-[#6495ED]'; // Cornflower Blue

    const inputStyle = `appearance-none block w-full pl-10 pr-3 py-3 border border-transparent 
                        rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-[#77AADD] focus:border-[#77AADD] transition-colors duration-200 shadow-inner`;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // ดึงข้อมูล user จาก localStorage (ตามตรรกะเดิมของคุณ)
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            setError('ยังไม่มีข้อมูลผู้ใช้ในระบบ กรุณาสมัครสมาชิกก่อน');
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            if (
                username === parsedUser.username &&
                password === parsedUser.password
            ) {
                // เก็บสถานะการล็อกอิน
                localStorage.setItem('isUserAuthenticated', 'true');
                console.log(`Login success for user: ${username}`);
                setError('');
                navigate('/home'); // นำทางไปยังหน้าหลัก
            } else {
                setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (e) {
            setError('เกิดข้อผิดพลาดในการอ่านข้อมูลผู้ใช้');
        }
    };

    return (
        // Main Container: ใช้สีพื้นหลังที่กำหนด
        <div className={`min-h-screen ${primaryBackgroundColor} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-md w-full space-y-8">
                
                {/* Header & Icon Block (Centered) */}
                <div>
                    {/* Icon Circle */}
                    <div className={`mx-auto h-16 w-16 ${cardBackgroundColor} rounded-full flex items-center justify-center shadow-lg border border-gray-300`}>
                        <User className="h-10 w-10 text-[#77AADD]" />
                    </div>
                    
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
                        เข้าสู่ระบบ
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        สำหรับผู้ใช้บริการสนามกีฬา
                    </p>
                </div>

                {/* Form Card: ใช้สีพื้นหลังที่กำหนด */}
                <div className={`${cardBackgroundColor} rounded-xl shadow-2xl p-8`}>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                ชื่อผู้ใช้
                            </label>
                            <div className="relative">
                                {/* Lucide User Icon */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={inputStyle}
                                    placeholder="กรอกชื่อผู้ใช้"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                {/* Lucide Lock Icon */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputStyle}
                                    placeholder="กรอกรหัสผ่าน"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-3 px-4 border border-transparent 
                                    rounded-lg shadow-lg text-sm font-bold text-white ${buttonColor}
                                    ${buttonHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2
                                    focus:ring-[#77AADD] transition-colors duration-200`}
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Link to Register */}
                <div className="text-center mt-4">
                    <span className="text-gray-700 text-sm">ยังไม่มีบัญชี? </span>
                    <Link to="/register" className={`text-sm font-medium ${linkColor} hover:text-[#4169E1] transition-colors`}>
                        ลงทะเบียน
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
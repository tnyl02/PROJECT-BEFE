// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const styles = {
        pageBg: 'bg-[#B0C4DE]',
        cardBg: 'bg-[#FFFACD]',
        btn: 'bg-[#77AADD]',
        btnHover: 'hover:bg-[#6699CC]',
        link: 'text-[#6495ED]',
        input: `appearance-none block w-full pl-10 pr-3 py-3 border border-transparent 
                rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-[#77AADD] focus:border-[#77AADD] transition-colors duration-200 shadow-inner`,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // ⭐ Admin Login
        if (username === "admin" && password === "admin") {
            const adminData = { username: "admin", role: "admin", name: "Administrator" };
            localStorage.setItem("currentUser", JSON.stringify(adminData));
            navigate("/admin");
            return;
        }

        // ⭐ โหลด users ทั้งหมด
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // ⭐ หา user ที่ตรงกับ username + password
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/home");
        } else {
            setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }
    };

    return (
        <div className={`min-h-screen ${styles.pageBg} flex items-center justify-center py-12 px-4`}>
            <div className="max-w-md w-full space-y-8">

                <div className="text-center">
                    <div className={`mx-auto h-16 w-16 ${styles.cardBg} rounded-full flex items-center justify-center shadow-lg border border-gray-300`}>
                        <User className="h-10 w-10 text-[#77AADD]" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-800">เข้าสู่ระบบ</h2>
                </div>

                <div className={`${styles.cardBg} rounded-xl shadow-2xl p-8`}>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={styles.input}
                                    placeholder="กรอกชื่อผู้ใช้"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    placeholder="กรอกรหัสผ่าน"
                                />
                            </div>
                        </div>

                        <button type="submit" className={`w-full py-3 rounded-lg shadow-lg font-bold text-white ${styles.btn} ${styles.btnHover}`}>
                            เข้าสู่ระบบ
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <span className="text-gray-700 text-sm">ยังไม่มีบัญชี? </span>
                    <Link to="/register" className={`text-sm font-medium ${styles.link} hover:text-[#4169E1]`}>
                        ลงทะเบียน
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

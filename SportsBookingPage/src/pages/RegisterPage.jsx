// RegistrationPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const navigate = useNavigate();

    const styles = {
        pageBg: 'bg-[#B0C4DE]',
        cardBg: 'bg-[#FFFACD]',
        button: 'bg-[#77AADD] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#6699CC] transition w-full text-lg',
        input: 'w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#77AADD]',
        label: 'block text-sm font-medium text-gray-700 mb-1',
        errorText: 'text-red-600 text-xs mt-1 ml-1'
    };

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        tel: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อจริง";
        if (!form.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
        if (!form.username.trim()) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
        if (!form.password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";
        if (!form.email.trim()) {
            newErrors.email = "กรุณากรอกอีเมล";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // ⭐ ดึง users เดิมจาก localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ⭐ เช็คว่ามี username ซ้ำไหม
    if (users.some(u => u.username === form.username)) {
        alert("ชื่อผู้ใช้นี้ถูกใช้แล้ว กรุณาเปลี่ยนชื่อผู้ใช้");
        return;
    }

    // ⭐ เพิ่ม user ใหม่ลง array
    const newUsers = [...users, form];

    // ⭐ บันทึกกลับไป localStorage
    localStorage.setItem("users", JSON.stringify(newUsers));

    alert("สมัครสมาชิกสำเร็จ!");

    // ⭐ ส่งไปหน้า login
    navigate('/login');
};


    return (
        <div className={`min-h-screen flex items-center justify-center ${styles.pageBg} py-12`}>
            <div className={`w-full max-w-lg p-8 rounded-xl shadow-2xl ${styles.cardBg}`}>
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">สมัครสมาชิก</h2>

                <form className="space-y-4" onSubmit={handleRegister}>

                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className={styles.label}>ชื่อ</label>
                            <input type="text" className={styles.input}
                                value={form.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                            />
                            {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                        </div>

                        <div className="w-1/2">
                            <label className={styles.label}>นามสกุล</label>
                            <input type="text" className={styles.input}
                                value={form.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                            />
                            {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={styles.label}>ชื่อผู้ใช้</label>
                        <input type="text" className={styles.input}
                            value={form.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                        {errors.username && <p className={styles.errorText}>{errors.username}</p>}
                    </div>

                    <div>
                        <label className={styles.label}>รหัสผ่าน</label>
                        <input type="password" className={styles.input}
                            value={form.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                    </div>

                    <div>
                        <label className={styles.label}>อีเมล</label>
                        <input type="email" className={styles.input}
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                    </div>

                    <div>
                        <label className={styles.label}>เบอร์โทรศัพท์</label>
                        <input type="tel" className={styles.input}
                            value={form.tel}
                            onChange={(e) => handleChange('tel', e.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.button}>ลงทะเบียน</button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
                    <Link to="/login" className="text-[#6495ED] font-medium">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;

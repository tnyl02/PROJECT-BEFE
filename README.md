# 🏟️ Court Booking System

## 📖 Quick Navigation

- **👀 First Time?** → Read [INDEX.md](./INDEX.md)
- **🚀 Want to run it?** → See [OPERATIONAL_GUIDE.md](./OPERATIONAL_GUIDE.md)
- **🏗️ Understand design?** → Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- **🧪 Testing needed?** → Use [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **🔌 API integration?** → See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

## 🎯 Project Overview

A **full-stack court booking system** built with React and Go, allowing users to register, login, browse sports courts, check availability, create bookings, and manage reservations with real-time conflict detection.

### Key Features

✨ **User Authentication** - Secure login, JWT tokens, role-based access  
📅 **Booking Management** - 4 sports, 12 courts, real-time availability  
👨‍💼 **Admin Features** - Reset bookings, role verification  
🎨 **Modern UI/UX** - Responsive Tailwind design, smooth navigation  

---

## 🛠️ Technology Stack

**Frontend:** React 18 + React Router + Tailwind CSS  
**Backend:** Go 1.25 + Gin Framework + JWT  
**Auth:** bcrypt password hashing + JWT tokens (24h expiry)  
**Database:** PostgreSQL (optional, in-memory by default)  

---

## 🚀 Quick Start

```bash
# Terminal 1: Backend
cd /workspaces/PROJECT-BEFE/database
go run . &

# Terminal 2: Frontend
cd /workspaces/PROJECT-BEFE/SportsBookingPage
npm install && npm start

# Browser: http://localhost:3000
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [INDEX.md](./INDEX.md) | Complete project index |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design |
| [OPERATIONAL_GUIDE.md](./OPERATIONAL_GUIDE.md) | How to run |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Testing procedures |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | API documentation |

---

## ✅ Status

- ✅ Backend API (10 endpoints)
- ✅ Frontend UI (8+ pages)
- ✅ Authentication (JWT + bcrypt)
- ✅ Booking system (CRUD + conflict detection)
- ✅ Admin features
- ✅ Comprehensive testing (22+ cases)
- ✅ Full documentation (5 guides)

---

**Ready to use!** Start with [OPERATIONAL_GUIDE.md](./OPERATIONAL_GUIDE.md)  
Version 1.0.0 | Last Updated: Nov 25, 2024
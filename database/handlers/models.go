package handlers

import (
	"time"
)

// Models
type User struct {
	UserID       int       `json:"user_id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	UserName     string    `json:"username"`
	PasswordHash string    `json:"-"`
	Email        string    `json:"email"`
	PhoneNumber  string    `json:"phone_number"`
	StudentID    string    `json:"student_id"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

type Court struct {
	CourtID     int    `json:"court_id"`
	CourtName   string `json:"court_name"`
	SportType   string `json:"sport_type"`
	CourtNumber int    `json:"court_number"`
	Status      string `json:"status"`
}

type Booking struct {
	BookingID     int       `json:"booking_id"`
	CourtID       int       `json:"court_id"`
	UserID        int       `json:"user_id"`
	StartTime     time.Time `json:"start_time"`
	EndTime       time.Time `json:"end_time"`
	BookingStatus string    `json:"booking_status"`
	CreatedAt     time.Time `json:"created_at"`
}

// Global data storage
var (
	Users         []User
	Courts        []Court
	Bookings      []Booking
	NextUserID    = 1
	NextCourtID   = 1
	NextBookingID = 1
)

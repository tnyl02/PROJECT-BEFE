package handlers

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

// Database-backed booking operations

func CreateBookingDB(userID, courtID int, bookingDate, startTime, endTime string) (int, error) {
	// Check if court exists
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM courts WHERE CourtID = $1", courtID).Scan(&count)
	if err != nil || count == 0 {
		return 0, fmt.Errorf("court not found")
	}

	// Check for conflicts
	err = DB.QueryRow(
		`SELECT COUNT(*) FROM bookings 
		 WHERE CourtID = $1 AND 
		 ((StartTime < $3 AND EndTime > $2))`,
		courtID, startTime, endTime,
	).Scan(&count)

	if err != nil {
		return 0, fmt.Errorf("database error: %v", err)
	}
	if count > 0 {
		return 0, fmt.Errorf("court already booked for this time")
	}

	// Insert booking
	var bookingID int
	err = DB.QueryRow(
		`INSERT INTO bookings (UserID, CourtID, StartTime, EndTime) 
		 VALUES ($1, $2, $3, $4) RETURNING BookingID`,
		userID, courtID, startTime, endTime,
	).Scan(&bookingID)

	if err != nil {
		log.Printf("Error creating booking: %v", err)
		return 0, fmt.Errorf("failed to create booking")
	}

	log.Printf("✅ Booking created (ID: %d, User: %d, Court: %d)", bookingID, userID, courtID)
	return bookingID, nil
}

func GetUserBookingsDB(userID int) ([]Booking, error) {
	rows, err := DB.Query(
		`SELECT BookingID, UserID, CourtID, StartTime, EndTime 
		 FROM bookings WHERE UserID = $1 ORDER BY StartTime DESC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("database error: %v", err)
	}
	defer rows.Close()

	var bookings []Booking
	for rows.Next() {
		var b Booking
		err := rows.Scan(&b.BookingID, &b.UserID, &b.CourtID, &b.StartTime, &b.EndTime)
		if err != nil {
			log.Printf("Error scanning booking: %v", err)
			continue
		}
		bookings = append(bookings, b)
	}

	return bookings, nil
}

func DeleteBookingDB(bookingID int) error {
	result, err := DB.Exec("DELETE FROM bookings WHERE BookingID = $1", bookingID)
	if err != nil {
		log.Printf("Error deleting booking: %v", err)
		return fmt.Errorf("failed to delete booking")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("database error: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("booking not found")
	}

	log.Printf("✅ Booking deleted (ID: %d)", bookingID)
	return nil
}

func GetAvailableSlotsDB(courtID int, bookingDate string) (map[string]int, error) {
	slots := make(map[string]int)

	// Initialize all hours with max 1 court available
	for hour := 10; hour < 22; hour++ {
		timeStr := fmt.Sprintf("%02d:00", hour)
		slots[timeStr] = 1
	}

	// Get booked slots for this court on this date
	rows, err := DB.Query(
		`SELECT StartTime FROM bookings 
		 WHERE CourtID = $1`,
		courtID,
	)
	if err != nil {
		return slots, nil // Return default if error
	}
	defer rows.Close()

	for rows.Next() {
		var startTime string
		if err := rows.Scan(&startTime); err != nil {
			continue
		}
		slots[startTime] = 0
	}

	return slots, nil
}

func ResetAllBookingsDB() error {
	// Delete all bookings
	_, err := DB.Exec("DELETE FROM bookings")
	if err != nil {
		log.Printf("Error resetting bookings: %v", err)
		return fmt.Errorf("failed to reset bookings")
	}

	log.Println("✅ All bookings reset")
	return nil
}

// Helper function to seed courts if empty
func SeedCourtsDB() error {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM courts").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Println("✅ Courts already seeded")
		return nil
	}

	courts := []struct {
		name      string
		sportType string
		details   string
	}{
		{"โครงการ A - ตึก 1", "badminton", "คอร์ต 1"},
		{"โครงการ A - ตึก 2", "badminton", "คอร์ต 2"},
		{"โครงการ B - ตึก 1", "badminton", "คอร์ต 3"},
		{"สนาม 1", "basketball", "บาส 1"},
		{"สนาม 2", "basketball", "บาส 2"},
		{"สนาม 3", "basketball", "บาส 3"},
		{"คอร์ต 1", "tennis", "เทนนิส 1"},
		{"คอร์ต 2", "tennis", "เทนนิส 2"},
		{"คอร์ต 3", "tennis", "เทนนิส 3"},
		{"สนาม 1", "volleyball", "วอลเลย์บอล 1"},
		{"สนาม 2", "volleyball", "วอลเลย์บอล 2"},
		{"สนาม 3", "volleyball", "วอลเลย์บอล 3"},
	}

	for _, c := range courts {
		_, err := DB.Exec(
			"INSERT INTO courts (CourtName, SportType, CourtNumber, Status) VALUES ($1, $2, $3, $4)",
			c.name, c.sportType, 1, "Available",
		)
		if err != nil {
			log.Printf("Error seeding court: %v", err)
		}
	}

	log.Println("✅ Courts seeded successfully")
	return nil
}

// Helper function to seed admin user
func SeedAdminDB() error {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM users WHERE UserName = 'somchai_k'").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Println("✅ Admin user already exists")
		return nil
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte("012345"), bcrypt.DefaultCost)

	_, err = DB.Exec(
		`INSERT INTO users (FirstName, LastName, UserName, Email, PasswordHash, PhoneNumber, Role) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		"Somchai", "Kaewman", "somchai_k", "somchai@uni.th", string(hashed), "088-1111-1111", "Admin",
	)

	if err != nil {
		log.Printf("Error seeding admin: %v", err)
		return err
	}

	log.Println("✅ Admin user seeded successfully")
	return nil
}

package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateBookingRequest struct {
	CourtID     int    `json:"court_id" binding:"required"`
	BookingDate string `json:"booking_date" binding:"required"`
	StartTime   string `json:"start_time" binding:"required"`
	EndTime     string `json:"end_time" binding:"required"`
}

// POST /api/bookings
func HandleCreateBooking(c *gin.Context) {
	var req CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	userID := c.MustGet("userID").(int)

	// Create booking in database
	bookingID, err := CreateBookingDB(userID, req.CourtID, req.BookingDate, req.StartTime, req.EndTime)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "booking created",
		"booking_id": bookingID,
	})
}

// GET /api/bookings/history
func HandleGetBookingHistory(c *gin.Context) {
	userID := c.MustGet("userID").(int)
	
	// Get bookings from database
	bookings, err := GetUserBookingsDB(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": userID, "bookings": bookings})
}

// DELETE /api/bookings/:bookingId
func HandleDeleteBooking(c *gin.Context) {
	idStr := c.Param("bookingId")
	bid, err := ParseBookingID(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking id"})
		return
	}

	// Delete booking from database
	err = DeleteBookingDB(bid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Booking ID %d cancelled successfully", bid)})
}

// Internal functions

func ParseBookingTimes(req CreateBookingRequest) (time.Time, time.Time, error) {
	start, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid start_time format, use RFC3339")
	}
	end, err := time.Parse(time.RFC3339, req.EndTime)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid end_time format, use RFC3339")
	}
	if !end.After(start) {
		return time.Time{}, time.Time{}, fmt.Errorf("end_time must be after start_time")
	}
	return start, end, nil
}

func ParseBookingID(idStr string) (int, error) {
	var bid int
	_, err := fmt.Sscanf(idStr, "%d", &bid)
	if err != nil {
		return 0, err
	}
	return bid, nil
}

func IsCourtBooked(courtID int, start, end time.Time) bool {
	for _, b := range Bookings {
		if b.CourtID == courtID && b.BookingStatus == "Confirmed" {
			if start.Before(b.EndTime) && end.After(b.StartTime) {
				return true
			}
		}
	}
	return false
}

func CreateBookingRecord(userID, courtID int, start, end time.Time) Booking {
	booking := Booking{
		BookingID:     NextBookingID,
		CourtID:       courtID,
		UserID:        userID,
		StartTime:     start,
		EndTime:       end,
		BookingStatus: "Confirmed",
		CreatedAt:     time.Now(),
	}
	NextBookingID++
	Bookings = append(Bookings, booking)
	return booking
}

func GetUserBookings(userID int) []Booking {
	var result []Booking
	for _, b := range Bookings {
		if b.UserID == userID {
			result = append(result, b)
		}
	}
	return result
}

func FindUserBookingIndex(bookingID, userID int) (int, error) {
	for i := range Bookings {
		if Bookings[i].BookingID == bookingID {
			if Bookings[i].UserID != userID {
				return -1, fmt.Errorf("access denied")
			}
			return i, nil
		}
	}
	return -1, fmt.Errorf("booking not found")
}

func DeleteBookingAt(index int) {
	Bookings = append(Bookings[:index], Bookings[index+1:]...)
}

package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type AvailableSlot struct {
	TimeSlot  string `json:"time_slot"`
	Available int    `json:"available_courts"`
}

// GET /api/slots/available
func HandleGetAvailableSlots(c *gin.Context) {
	sportType := c.Query("sportType")
	dateStr := c.Query("date")

	if sportType == "" || dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing sportType or date query parameter"})
		return
	}

	// Validate date format
	_, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
		return
	}

	// Get courts for this sport type
	courts := GetCourtsList(sportType)
	if len(courts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "sport type not found"})
		return
	}

	// Calculate available slots
	slots := make(map[string]int)
	for hour := 10; hour < 22; hour++ {
		timeStr := fmt.Sprintf("%02d:00", hour)
		slots[timeStr] = len(courts) // All available initially
	}

	// Get booked courts for this date and sport type
	rows, err := DB.Query(`
		SELECT DISTINCT start_time FROM bookings b
		JOIN courts c ON b.court_id = c.court_id
		WHERE c.sport_type = $1 AND b.booking_date = $2
	`, sportType, dateStr)

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var startTime string
			if err := rows.Scan(&startTime); err != nil {
				continue
			}
			if slots[startTime] > 0 {
				slots[startTime]--
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"sport_type": sportType, "date": dateStr, "slots": slots})
}

// Internal functions (kept for compatibility, but not used anymore)

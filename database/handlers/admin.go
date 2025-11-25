package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminResetRequest struct {
	UserID int `json:"user_id" binding:"required"`
}

// POST /api/admin/bookings/reset
func HandleResetBookings(c *gin.Context) {
	// Reset all bookings in database
	err := ResetAllBookingsDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All court bookings have been reset successfully",
	})
}

// Internal functions

func ResetAllBookings() {
	Bookings = []Booking{}
	NextBookingID = 1
}

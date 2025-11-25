package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// GET /api/users/:id
func HandleGetUserProfile(c *gin.Context) {
	idStr := c.Param("id")
	uid, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	user, err := GetUserByID(uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, FormatUserProfileResponse(user))
}

// Internal functions

func GetUserByID(id int) (*User, error) {
	for i := range Users {
		if Users[i].UserID == id {
			return &Users[i], nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func FormatUserProfileResponse(user *User) gin.H {
	return gin.H{
		"user_id":      user.UserID,
		"first_name":   user.FirstName,
		"last_name":    user.LastName,
		"username":     user.UserName,
		"email":        user.Email,
		"phone_number": user.PhoneNumber,
		"student_id":   user.StudentID,
		"role":         user.Role,
		"created_at":   user.CreatedAt.Format("2006-01-02"),
	}
}

func UserExists(id int) bool {
	for _, u := range Users {
		if u.UserID == id {
			return true
		}
	}
	return false
}

func IsAdmin(id int) bool {
	for _, u := range Users {
		if u.UserID == id && u.Role == "Admin" {
			return true
		}
	}
	return false
}

func GetCurrentTime() time.Time {
	return time.Now()
}

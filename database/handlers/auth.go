package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name"`
	UserName    string `json:"username" binding:"required"`
	Password    string `json:"password" binding:"required,min=6"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	StudentID   string `json:"student_id"`
}

type LoginRequest struct {
	UserName string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// POST /api/auth/register
func HandleRegister(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	// Use database-backed registration
	user, err := RegisterUserDB(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "registered successfully",
		"user":    FormatUserResponse(user),
	})
}

// POST /api/auth/login
func HandleLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	// Use database-backed login
	user, err := LoginUserDB(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "login success",
		"user":    FormatLoginResponse(user),
	})
}

// POST /api/auth/logout
func HandleLogout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "logout successful",
	})
}

// Internal functions

func ValidateRegisterRequest(req RegisterRequest) error {
	for _, u := range Users {
		if u.UserName == req.UserName {
			return fmt.Errorf("username already taken")
		}
	}
	if req.Email != "" {
		for _, u := range Users {
			if u.Email == req.Email {
				return fmt.Errorf("email already registered")
			}
		}
	}
	return nil
}

func CreateNewUser(req RegisterRequest) (User, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, fmt.Errorf("cannot hash password")
	}

	user := User{
		UserID:       NextUserID,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		UserName:     req.UserName,
		PasswordHash: string(hashed),
		Email:        req.Email,
		PhoneNumber:  req.PhoneNumber,
		StudentID:    req.StudentID,
		Role:         "Member",
		CreatedAt:    GetCurrentTime(),
	}
	NextUserID++
	Users = append(Users, user)
	return user, nil
}

func AuthenticateUser(req LoginRequest) (*User, error) {
	var found *User
	for i := range Users {
		if Users[i].UserName == req.UserName {
			found = &Users[i]
			break
		}
	}
	if found == nil {
		return nil, fmt.Errorf("invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(found.PasswordHash), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid username or password")
	}

	return found, nil
}

func FormatUserResponse(user User) gin.H {
	return gin.H{
		"user_id":    user.UserID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"username":   user.UserName,
		"email":      user.Email,
		"phone":      user.PhoneNumber,
		"student_id": user.StudentID,
		"role":       user.Role,
		"created_at": user.CreatedAt,
	}
}

func FormatLoginResponse(user *User) gin.H {
	token, err := GenerateToken(user.UserID, user.Role)
	if err != nil {
		token = "DUMMY_TOKEN_FOR_USER_" + strconv.Itoa(user.UserID)
	}

	return gin.H{
		"user_id":    user.UserID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"username":   user.UserName,
		"role":       user.Role,
		"token":      token,
	}
}

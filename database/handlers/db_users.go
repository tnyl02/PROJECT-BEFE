package handlers

import (
	"database/sql"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

var DB *sql.DB

// SetDB sets the database connection for handlers
func SetDB(database *sql.DB) {
	DB = database
}

// Database-backed user operations

func RegisterUserDB(req RegisterRequest) (User, error) {
	// Check if username exists
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM users WHERE UserName = $1", req.UserName).Scan(&count)
	if err != nil {
		return User{}, fmt.Errorf("database error: %v", err)
	}
	if count > 0 {
		return User{}, fmt.Errorf("username already taken")
	}

	// Check if email exists
	if req.Email != "" {
		err := DB.QueryRow("SELECT COUNT(*) FROM users WHERE Email = $1", req.Email).Scan(&count)
		if err != nil {
			return User{}, fmt.Errorf("database error: %v", err)
		}
		if count > 0 {
			return User{}, fmt.Errorf("email already registered")
		}
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, fmt.Errorf("cannot hash password")
	}

	// Insert into database
	var userID int
	err = DB.QueryRow(
		"INSERT INTO users (FirstName, LastName, UserName, Email, PasswordHash, PhoneNumber, Role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING UserID",
		req.FirstName,
		req.LastName,
		req.UserName,
		req.Email,
		string(hashed),
		req.PhoneNumber,
		"Member",
	).Scan(&userID)

	if err != nil {
		log.Printf("Error inserting user: %v", err)
		return User{}, fmt.Errorf("failed to create user")
	}

	user := User{
		UserID:       userID,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		UserName:     req.UserName,
		PasswordHash: string(hashed),
		Email:        req.Email,
		PhoneNumber:  req.PhoneNumber,
		Role:         "Member",
	}

	log.Printf("✅ User %s registered successfully (ID: %d)", req.UserName, userID)
	return user, nil
}

func LoginUserDB(req LoginRequest) (*User, error) {
	var user User
	var passwordHash string

	err := DB.QueryRow(
		"SELECT UserID, FirstName, LastName, UserName, Email, PhoneNumber, Role, PasswordHash FROM users WHERE UserName = $1",
		req.UserName,
	).Scan(
		&user.UserID,
		&user.FirstName,
		&user.LastName,
		&user.UserName,
		&user.Email,
		&user.PhoneNumber,
		&user.Role,
		&passwordHash,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("invalid username or password")
	}
	if err != nil {
		return nil, fmt.Errorf("database error: %v", err)
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
	if err != nil {
		return nil, fmt.Errorf("invalid username or password")
	}

	user.PasswordHash = passwordHash
	log.Printf("✅ User %s logged in successfully", req.UserName)
	return &user, nil
}

func GetUserDB(userID int) (*User, error) {
	var user User
	err := DB.QueryRow(
		"SELECT UserID, FirstName, LastName, UserName, Email, PhoneNumber, Role FROM users WHERE UserID = $1",
		userID,
	).Scan(
		&user.UserID,
		&user.FirstName,
		&user.LastName,
		&user.UserName,
		&user.Email,
		&user.PhoneNumber,
		&user.Role,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("database error: %v", err)
	}

	return &user, nil
}

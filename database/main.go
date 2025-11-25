package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"main.go/handlers"
)

func main() {
	// Initialize database
	if err := InitDB(); err != nil {
		panic(fmt.Sprintf("Failed to initialize database: %v", err))
	}
	defer DB.Close()

	// Set database connection for handlers
	handlers.SetDB(DB)

	// Seed initial data
	SeedCourts()
	SeedUsers()

	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		// Auth endpoints (no auth required)
		api.POST("/auth/register", handlers.HandleRegister)
		api.POST("/auth/login", handlers.HandleLogin)

		// Auth endpoints (auth required)
		api.POST("/auth/logout", handlers.AuthMiddleware(), handlers.HandleLogout)

		// User endpoints (auth required)
		api.GET("/users/:id", handlers.AuthMiddleware(), handlers.HandleGetUserProfile)

		// Admin endpoints (auth + admin required)
		api.POST("/admin/bookings/reset", handlers.AuthMiddleware(), handlers.AdminMiddleware(), handlers.HandleResetBookings)

		// Court endpoints (public)
		api.GET("/sports", handlers.HandleGetSportTypes)
		api.GET("/courts", handlers.HandleGetCourts)
		api.GET("/courts/:sportType", handlers.HandleGetCourtsBySportTypeParam)

		// Slots endpoints (public)
		api.GET("/slots/available", handlers.HandleGetAvailableSlots)

		// Booking endpoints (auth required)
		auth := api.Group("/bookings")
		auth.Use(handlers.AuthMiddleware())
		{
			auth.POST("", handlers.HandleCreateBooking)
			auth.GET("/history", handlers.HandleGetBookingHistory)
			auth.DELETE("/:bookingId", handlers.HandleDeleteBooking)
		}
	}

	r.Run(":8080")
}

func SeedUsers() {
	// Seed users to database
	if err := handlers.SeedAdminDB(); err != nil {
		fmt.Printf("Warning: Failed to seed admin user: %v\n", err)
	}
}

func SeedCourts() {
	// Seed courts to database
	if err := handlers.SeedCourtsDB(); err != nil {
		fmt.Printf("Warning: Failed to seed courts: %v\n", err)
	}
}

package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"localhost",
		"5432",
		"courts_user",
		"courts_password",
		"courts",
	)

	var err error
	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return err
	}

	err = DB.Ping()
	if err != nil {
		return err
	}

	log.Println("✅ Database connected successfully")

	// Create tables if they don't exist
	if err := createTables(); err != nil {
		return err
	}

	return nil
}

func createTables() error {
	schema := `
	-- Create users table
	CREATE TABLE IF NOT EXISTS users (
		UserID SERIAL PRIMARY KEY,
		FirstName VARCHAR(100) NOT NULL,
		LastName VARCHAR(100),
		UserName VARCHAR(50) UNIQUE NOT NULL,
		PasswordHash VARCHAR(255) NOT NULL,
		Email VARCHAR(100) UNIQUE,
		PhoneNumber VARCHAR(15),
		StudentID VARCHAR(20) UNIQUE,
		Role VARCHAR(20) DEFAULT 'Member' CHECK (Role IN ('Member', 'Admin')),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE
	);

	-- Create courts table
	CREATE TABLE IF NOT EXISTS courts (
		CourtID SERIAL PRIMARY KEY,
		CourtName VARCHAR(100) NOT NULL,
		SportType VARCHAR(50) NOT NULL,
		CourtNumber INT NOT NULL,
		Status VARCHAR(20) DEFAULT 'Available',
		UNIQUE (SportType, CourtNumber)
	);

	-- Create bookings table
	CREATE TABLE IF NOT EXISTS bookings (
		BookingID SERIAL PRIMARY KEY,
		CourtID INT REFERENCES courts(CourtID) ON DELETE CASCADE,
		UserID INT REFERENCES users(UserID) ON DELETE CASCADE NOT NULL,
		StartTime TIMESTAMP WITH TIME ZONE NOT NULL,
		EndTime TIMESTAMP WITH TIME ZONE NOT NULL,
		BookingStatus VARCHAR(20) DEFAULT 'Confirmed',
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE
	);

	-- Create update trigger function
	CREATE OR REPLACE FUNCTION update_modified_column()
	RETURNS TRIGGER AS $$
	BEGIN
		NEW.updated_at = now();
		RETURN NEW;
	END;
	$$ language 'plpgsql';

	-- Create triggers
	DROP TRIGGER IF EXISTS update_users_modtime ON users;
	CREATE TRIGGER update_users_modtime
	BEFORE UPDATE ON users
	FOR EACH ROW
	EXECUTE FUNCTION update_modified_column();

	DROP TRIGGER IF EXISTS update_bookings_modtime ON bookings;
	CREATE TRIGGER update_bookings_modtime
	BEFORE UPDATE ON bookings
	FOR EACH ROW
	EXECUTE FUNCTION update_modified_column();

	-- Create indexes
	CREATE INDEX IF NOT EXISTS idx_bookings_court_time ON bookings(CourtID, StartTime, EndTime);
	CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(UserID);
	CREATE INDEX IF NOT EXISTS idx_courts_sport ON courts(SportType);
	`

	_, err := DB.Exec(schema)
	if err != nil {
		log.Printf("Error creating tables: %v", err)
		return err
	}

	log.Println("✅ Tables created/verified")
	return nil
}

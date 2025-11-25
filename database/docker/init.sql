CREATE TABLE users (
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

CREATE TABLE courts (
    CourtID SERIAL PRIMARY KEY,
    CourtName VARCHAR(100) NOT NULL,
    SportType VARCHAR(50) NOT NULL,
    CourtNumber INT NOT NULL,
    Status VARCHAR(20) DEFAULT 'Available',
    UNIQUE (SportType, CourtNumber)
);

CREATE TABLE bookings (
    BookingID SERIAL PRIMARY KEY,
    CourtID INT REFERENCES courts(CourtID) ON DELETE CASCADE,
    
    UserID INT REFERENCES users(UserID) ON DELETE CASCADE NOT NULL, 
    
    StartTime TIMESTAMP WITH TIME ZONE NOT NULL,
    EndTime TIMESTAMP WITH TIME ZONE NOT NULL,
    
    BookingStatus VARCHAR(20) DEFAULT 'Confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bookings_modtime
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE INDEX idx_bookings_court_time ON bookings(CourtID, StartTime, EndTime);

INSERT INTO courts (CourtName, SportType, CourtNumber) VALUES
    ('แบดมินตันคอร์ด 1', 'แบดมินตัน', 1),
    ('แบดมินตันคอร์ด 2', 'แบดมินตัน', 2),
    ('แบดมินตันคอร์ด 3', 'แบดมินตัน', 3),
    ('แบดมินตันคอร์ด 4', 'แบดมินตัน', 4),
    ('แบดมินตันคอร์ด 5', 'แบดมินตัน', 5),
    ('แบดมินตันคอร์ด 6', 'แบดมินตัน', 6),
    
    ('บาสเกตบอลคอร์ด 1', 'บาสเกตบอล', 1),
    ('บาสเกตบอลคอร์ด 2', 'บาสเกตบอล', 2),
    
    ('เทนนิสคอร์ด 1', 'เทนนิส', 1),
    ('เทนนิสคอร์ด 2', 'เทนนิส', 2),
    ('เทนนิสคอร์ด 3', 'เทนนิส', 3),
    ('เทนนิสคอร์ด 4', 'เทนนิส', 4),
    
    ('วอลเลย์บอลคอร์ด 1', 'วอลเลย์บอล', 1);

INSERT INTO users (FirstName, LastName, UserName, PasswordHash, Email, PhoneNumber, StudentID, Role) VALUES
('สมชาย', 'แก้วมณี', 'somchai_k', '012345', 'somchai.k@uni.th', '088-888-8881', '6510001', 'Admin'),
('สมหญิง', 'ใจดี', 'somying_j', '012345', 'somying.j@uni.th', '088-888-8882', '6510002', 'Member'),
('มงคล', 'รุ่งเรือง', 'mongkol_r', '012345', 'mongkol.r@uni.th', '088-888-8883', '6420001', 'Member'),
('พัชรี', 'ศรีสุข', 'patcharee_s', '012345', 'patcharee.s@uni.th', '088-888-8884', '6420002', 'Member'),
('ชัยวัฒน์', 'วัฒนา', 'chaiwat_w', '012345', 'chaiwat.w@uni.th', '088-888-8885', '6630001', 'Member');
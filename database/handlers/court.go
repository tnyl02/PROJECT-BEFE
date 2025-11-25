package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /api/sports
func HandleGetSportTypes(c *gin.Context) {
	sportTypes := GetSportTypes()
	c.JSON(http.StatusOK, gin.H{"data": sportTypes})
}

// GET /api/courts
func HandleGetCourts(c *gin.Context) {
	st := c.Query("sport_type")
	filtered := GetCourtsList(st)
	c.JSON(http.StatusOK, gin.H{"data": filtered})
}

// GET /api/courts/:sportType
func HandleGetCourtsBySportTypeParam(c *gin.Context) {
	st := c.Param("sportType")

	filtered := GetCourtsBySportType(st)

	if len(filtered) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "sport type or courts not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": filtered})
}

// Internal functions

func GetSportTypes() []string {
	var sportTypes []string

	rows, err := DB.Query("SELECT DISTINCT SportType FROM courts ORDER BY SportType")
	if err != nil {
		return sportTypes
	}
	defer rows.Close()

	for rows.Next() {
		var st string
		if err := rows.Scan(&st); err != nil {
			continue
		}
		sportTypes = append(sportTypes, st)
	}

	return sportTypes
}

func GetCourtsList(sportType string) []Court {
	var query string
	var args []interface{}

	if sportType == "" {
		query = "SELECT CourtID, CourtName, SportType, CourtNumber, Status FROM courts ORDER BY SportType, CourtName"
	} else {
		query = "SELECT CourtID, CourtName, SportType, CourtNumber, Status FROM courts WHERE SportType = $1 ORDER BY CourtName"
		args = append(args, sportType)
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		return []Court{}
	}
	defer rows.Close()

	var courts []Court
	for rows.Next() {
		var c Court
		if err := rows.Scan(&c.CourtID, &c.CourtName, &c.SportType, &c.CourtNumber, &c.Status); err != nil {
			continue
		}
		courts = append(courts, c)
	}

	return courts
}

func GetCourtsBySportType(sportType string) []Court {
	return GetCourtsList(sportType)
}

func CourtExists(id int) bool {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM courts WHERE CourtID = $1", id).Scan(&count)
	if err != nil || count == 0 {
		return false
	}
	return true
}

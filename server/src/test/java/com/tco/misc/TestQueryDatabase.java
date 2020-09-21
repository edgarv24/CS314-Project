package com.tco.misc;

import com.tco.requests.RequestConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestQueryDatabase {
    Connection conn;
    private QueryDatabase db;

    @BeforeEach
    public void createConfigurationForTestCases(){
        db = new QueryDatabase();
        conn = null;
    }

    @Test
    @DisplayName("Connection successful")
    public void testConnection() throws SQLException {
        conn = DriverManager.getConnection(db.getDbUrl(), db.getDbUser(), db.getDbPassword());
        assertEquals(conn.isValid(30), conn);
    }
}

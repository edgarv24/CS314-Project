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
        db = new QueryDatabase("denver");
        conn = null;
    }

    @Test
    @DisplayName("Connection successful")
    public void testConnection() throws SQLException {
        conn = DriverManager.getConnection(db.getDbUrl(), db.getDbUser(), db.getDbPassword());
        assertEquals(conn != null,  true);
    }

    @Test
    @DisplayName("DB_URL should be jdbc:mariadb://127.0.0.1:56247/cs314")
    public void testGetDB_URL() {
        String url = db.getDbUrl();
        assertEquals("jdbc:mariadb://127.0.0.1:56247/cs314", url);
    }

    @Test
    @DisplayName("DB_User should be cs314-db")
    public void testGetDB_User() {
        String user = db.getDbUser();
        assertEquals("cs314-db", user);
    }

    @Test
    @DisplayName("DB_Password should be eiK5liet1uej")
    public void testGetDB_Password() {
        String password = db.getDbPassword();
        assertEquals("eiK5liet1uej", password);
    }

    @Test
    @DisplayName("User input should be denver")
    public void testGetUserInputValue() {
        String input = db.getUserinputvalue();
        assertEquals("denver", input);
    }
}

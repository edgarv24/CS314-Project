package com.tco.misc;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class TestQueryDatabase {
    Connection conn;
    private QueryDatabase db;
    String isTravis = System.getenv("TRAVIS");
    private final String useTunnel = System.getenv("CS314_USE_DATABASE_TUNNEL");
    private String expectedUserName;
    private String expectedPassword;
    private String expectedURL;

    @BeforeEach
    public void createConfigurationForTestCases() throws SQLException {
        db = new QueryDatabase("Denver");
        conn = null;
    }

    @Test
    @DisplayName("Connection successful")
    public void testConnection() throws SQLException {
        conn = DriverManager.getConnection(db.getDbUrl(), db.getDbUser(), db.getDbPassword());
        assertNotNull(conn);
    }

    @Test
    @DisplayName("DB_URL will depend on environment")
    public void testGetDB_URL() {
        checkIfTravis();
        String url = db.getDbUrl();
        assertEquals(expectedURL, url);
    }

    @Test
    @DisplayName("DB_User should be cs314-db or root")
    public void testGetDB_User() {
        checkIfTravis();
        String user = db.getDbUser();
        assertEquals(expectedUserName, user);
    }

    @Test
    @DisplayName("DB_Password should be eiK5liet1uej or null if on travis")
    public void testGetDB_Password() {
        checkIfTravis();
        String password = db.getDbPassword();
        assertEquals(expectedPassword, password);
    }

    @Test
    @DisplayName("User input should be Denver")
    public void testGetUserInputValue() {
        String input = db.getUserInputValue();
        assertEquals("Denver", input);
    }

    @Test
    @DisplayName("resultsArr length should be 7")
    public void testGetResultsSize() {
        int resultsSize = db.getResultsSize();
        assertEquals(7, resultsSize);
    }

    @Test
    @DisplayName("results list length should be 7")
    public void testReturnResults() {
        List<Map<String, String>> results = db.returnResults();
        assertEquals(7, results.size());
    }

    public void checkIfTravis() {
        if (isTravis != null && isTravis.equals("true")) {
            expectedURL = "jdbc:mysql://127.0.0.1/cs314";
            expectedUserName = "root";
            expectedPassword = null;
        } else if (useTunnel != null && useTunnel.equals("true")) {
            expectedURL = "jdbc:mysql://127.0.0.1:56247/cs314";
            expectedUserName = "cs314-db";
            expectedPassword = "eiK5liet1uej";
        } else {
            expectedURL = "jdbc:mysql://faure.cs.colostate.edu/cs314";
            expectedUserName = "cs314-db";
            expectedPassword = "eiK5liet1uej";
        }
    }
}

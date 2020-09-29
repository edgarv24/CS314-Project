package com.tco.misc;

import org.junit.jupiter.api.BeforeAll;
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
  private static final String isTravis = System.getenv("TRAVIS");
  private static final String useTunnel = System.getenv("CS314_USE_DATABASE_TUNNEL");
  private static String expectedURL;
  private static String expectedUsername;
  private static String expectedPassword;

  private QueryDatabase db;
  private Connection conn;

  @BeforeAll
  public static void init() {
    if (isTravis != null && isTravis.equals("true")) {
      expectedURL = "jdbc:mysql://127.0.0.1/cs314";
      expectedUsername = "root";
      expectedPassword = null;
    } else if (useTunnel != null && useTunnel.equals("true")) {
      expectedURL = "jdbc:mysql://127.0.0.1:56247/cs314";
      expectedUsername = "cs314-db";
      expectedPassword = "eiK5liet1uej";
    } else {
      expectedURL = "jdbc:mysql://faure.cs.colostate.edu/cs314";
      expectedUsername = "cs314-db";
      expectedPassword = "eiK5liet1uej";
    }
  }

  @BeforeEach
  public void createConfigurationForTestCases() throws SQLException {
    db = new QueryDatabase("Denver", 0);
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
    QueryDatabase.configServerUsingLocation();
    String url = db.getDbUrl();
    assertEquals(expectedURL, url);
  }

  @Test
  @DisplayName("DB_User should be cs314-db or root")
  public void testGetDB_User() {
    QueryDatabase.configServerUsingLocation();
    String username = db.getDbUser();
    assertEquals(expectedUsername, username);
  }

  @Test
  @DisplayName("DB_Password should be eiK5liet1uej or null if on travis")
  public void testGetDB_Password() {
    QueryDatabase.configServerUsingLocation();
    String password = db.getDbPassword();
    assertEquals(expectedPassword, password);
  }

  @Test
  @DisplayName("Query with \"Denver\" should return 7 results")
  public void testReturnResults() {
    List<Map<String, String>> results = db.getQueryResults();
    assertEquals(30, results.size());
  }

  @Test
  @DisplayName("Airport \"Denver International Airport\" should be in \"Denver\" query")
  public void testDenverQueryForDIA() {
    assertTrue(db.getNamesList().contains("Denver International Airport"));
  }

  @Test
  @DisplayName("Query with \"Squid\" should return 0 results")
  public void testResultsSizeOfSquid() throws SQLException {
    db = new QueryDatabase("Squid", 10);
    List<Map<String, String>> results = db.getQueryResults();
    assertEquals(0, results.size());
  }

  @Test
  @DisplayName("Query with no limit should return 100 results")
  public void testQueryWithNoLimit() throws SQLException {
    db = new QueryDatabase("Airport", 0);
    List<Map<String, String>> results = db.getQueryResults();
    assertEquals(100, results.size());
  }
}

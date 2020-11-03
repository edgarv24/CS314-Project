package com.tco.misc;

import org.junit.jupiter.api.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class TestQueryDatabase {
  private static final String isTravis = System.getenv("TRAVIS");
  private static final String useTunnel = System.getenv("CS314_USE_DATABASE_TUNNEL");
  private static String expectedURL;
  private static String expectedUsername;
  private static String expectedPassword;

  private static QueryDatabase db;
  private static Connection conn;
  private static Map<String, ArrayList<String>> narrow;

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
    ArrayList<String> port = new ArrayList<>();
    port.add("airport");
    port.add("heliport");
    ArrayList<String> geo = new ArrayList<>();
    geo.add("United States");
    geo.add("Canada");
    narrow = new HashMap<>();
    narrow.put("type", port);
    narrow.put("where", geo);
    db = new QueryDatabase();
    db.configure("denver", 0, narrow);
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
  @DisplayName("Testing configure method sets properties correctly")
  public void testConfigure() {
    String expectedMatch = "denver";
    assertEquals(expectedMatch, db.getMatch());

    Integer expectedLimit = 100;
    assertEquals(expectedLimit, db.getLimit());

    Map<String, ArrayList<String>> filters = db.getFilters();
    assertEquals(2, filters.size());
    assertEquals("airport", filters.get("type").get(0));
    assertEquals("heliport", filters.get("type").get(1));
    assertEquals("United States", filters.get("where").get(0));
    assertEquals("Canada", filters.get("where").get(1));

    assertFalse(db.getQuery().isEmpty());
  }

  @Test
  @DisplayName("Testing query with no filter")
  public void testQueryNoFilter() {
    String actualQuery = db.queryWithNoFilters("denver", 0);
    String sampleQuery =
        "SELECT world.name, world.municipality, country.name, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = "
            + "country.id WHERE (country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR "
            + "world.name LIKE \"%denver%\" OR world.municipality LIKE \"%denver%\") "
            + "ORDER BY world.name;";
    assertEquals(sampleQuery, actualQuery);
  }

  @Test
  @DisplayName("Testing query with no filter and no match")
  public void testQueryNoFilterNoMatch() {
    String actualQuery = db.queryWithNoFilters(null, 10);
    String sampleQuery2 =
        "SELECT world.name, world.municipality, country.name, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = "
            + "country.id ORDER BY RAND() LIMIT 10;";
    assertEquals(sampleQuery2, actualQuery);
  }

  @Test
  @DisplayName("Testing query with filter")
  public void testQueryWithFilter() {
    String actualQuery = db.queryWithFilters("denver", 10, narrow);
    String sampleQuery3 =
        "SELECT world.name, world.municipality, country.name, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id "
            + "WHERE ((country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR world.name LIKE "
            + "\"%denver%\" OR world.municipality LIKE \"%denver%\") AND (country.name = \"United States\" OR "
            + "country.name = \"Canada\") AND (world.type LIKE \"%airport%\" OR world.type LIKE \"%heliport%\")) ORDER BY "
            + "world.name;";
    assertEquals(sampleQuery3, actualQuery);
  }

  @Test
  @DisplayName("Testing GeoFilter string is generated correctly")
  public void testConstructGeoFilter() {
    String expectedString = "(country.name = \"United States\" OR country.name = \"Canada\")";
    String actualString = db.constructGeoFilter(narrow);
    assertEquals(expectedString, actualString);
  }

  @Test
  @DisplayName("Testing PortFilter string is generated correctly")
  public void testConstructPortFilter() {
    String expectedString = "(world.type LIKE \"%airport%\" OR world.type LIKE \"%heliport%\")";
    String actualString = db.constructPortFilter(narrow);
    assertEquals(expectedString, actualString);
  }

  @Test
  @DisplayName("Test getCorrectLimit")
  public void testGetCorrectLimit() {
    assertEquals(50, db.getCorrectLimit("denver", 50));
    assertEquals(100, db.getCorrectLimit("denver", 500));
    assertEquals(100, db.getCorrectLimit("denver", null));
    assertEquals(50, db.getCorrectLimit(null, 50));
    assertEquals(100, db.getCorrectLimit(null, 500));
    assertEquals(1, db.getCorrectLimit(null, null));
  }

  @Test
  @DisplayName("Query with \"denver\" should return 29 results with added filters")
  public void testReturnResults() throws SQLException {
    db.executeQuery();
    List<Map<String, String>> results = db.getQueryResults();
    assertEquals(29, results.size());
  }
}

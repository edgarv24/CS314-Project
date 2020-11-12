package com.tco.misc;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestQueryDatabase {
  private static QueryDatabase db;
  private static Map<String, ArrayList<String>> narrow;
  private static Map<String, ArrayList<String>> portsOnly;
  private static Map<String, ArrayList<String>> geosOnly;

  @BeforeAll
  public static void init() {
    ArrayList<String> port = new ArrayList<>();
    port.add("airport");
    port.add("heliport");
    ArrayList<String> geo = new ArrayList<>();
    geo.add("United States");
    geo.add("Canada");
    narrow = new HashMap<>();
    portsOnly = new HashMap<>();
    geosOnly = new HashMap<>();
    narrow.put("type", port);
    narrow.put("where", geo);
    portsOnly.put("type", port);
    geosOnly.put("where", geo);
    db = new QueryDatabase();
    db.configure("denver", 0, narrow);
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
  }

  @Test
  @DisplayName("Testing query with no filter")
  public void testQueryNoFilter() {
    String actualQuery = db.configureQueryString("denver", 0, null);
    String expectedQuery =
        "SELECT world.name, world.municipality, country.name, country.id, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = "
            + "country.id WHERE ((country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR "
            + "world.name LIKE \"%denver%\" OR world.municipality LIKE \"%denver%\")) "
            + "ORDER BY world.name;";
    assertEquals(expectedQuery, actualQuery);
  }

  @Test
  @DisplayName("Testing query with no filter and no match")
  public void testQueryNoFilterNoMatch() {
    String actualQuery = db.configureQueryString(null, 10, null);
    String expectedQuery =
        "SELECT world.name, world.municipality, country.name, country.id, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = "
            + "country.id ORDER BY RAND() LIMIT 10;";
    assertEquals(expectedQuery, actualQuery);
  }

  @Test
  @DisplayName("Testing query with filter")
  public void testQueryWithFilter() {
    String actualQuery = db.configureQueryString("denver", 10, narrow);
    String expectedQuery =
        "SELECT world.name, world.municipality, country.name, country.id, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id "
            + "WHERE ((country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR world.name LIKE "
            + "\"%denver%\" OR world.municipality LIKE \"%denver%\") AND (country.name = \"United States\" OR "
            + "country.name = \"Canada\") AND (world.type LIKE \"%airport%\" OR world.type LIKE \"%heliport%\")) ORDER BY "
            + "world.name;";
    assertEquals(expectedQuery, actualQuery);
  }

  @Test
  @DisplayName("Query with only airport filters")
  public void testQueryOnlyAirportFilters() {
    String actualQuery = db.configureQueryString("denver", 10, portsOnly);
    String expectedQuery =
        "SELECT world.name, world.municipality, country.name, country.id, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id "
            + "WHERE ((country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR world.name LIKE "
            + "\"%denver%\" OR world.municipality LIKE \"%denver%\") AND (world.type LIKE \"%airport%\" OR world.type LIKE \"%heliport%\")) ORDER BY "
            + "world.name;";
    assertEquals(expectedQuery, actualQuery);
  }

  @Test
  @DisplayName("Query with only geo filters")
  public void testQueryOnlyGeoFilters() {
    String actualQuery = db.configureQueryString("denver", 10, geosOnly);
    String expectedQuery =
        "SELECT world.name, world.municipality, country.name, country.id, region.name, "
            + "world.altitude, world.latitude, world.longitude, world.id, world.type FROM world INNER JOIN "
            + "region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id "
            + "WHERE ((country.name LIKE \"%denver%\" OR region.name LIKE \"%denver%\" OR world.name LIKE "
            + "\"%denver%\" OR world.municipality LIKE \"%denver%\") AND (country.name = \"United States\" OR "
            + "country.name = \"Canada\")) ORDER BY "
            + "world.name;";
    assertEquals(expectedQuery, actualQuery);
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
}

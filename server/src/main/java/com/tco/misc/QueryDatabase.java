package com.tco.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryDatabase {

  private final transient Logger log = LoggerFactory.getLogger(QueryDatabase.class);

  private static String DB_URL;
  private static String DB_USER;
  private static String DB_PASSWORD;

  private final String COLUMNS =
      "world.name, world.municipality, country.name, region.name, world.altitude, world.latitude, world.longitude, world.id, world.type";
  private final String TABLES =
      "world INNER JOIN region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id";
  private final String WHERECLAUSE1 = "country.name LIKE \"%";
  private final String WHERECLAUSE2 = "region.name LIKE \"%";
  private final String WHERECLAUSE3 = "world.name LIKE \"%";
  private final String WHERECLAUSE4 = "world.municipality LIKE \"%";
  private final String QUERY;

  private Integer resultsFound;
  private List<Map<String, String>> queryResults;

  public QueryDatabase(String placeName, Integer limit) throws SQLException {
    configServerUsingLocation();
    limit = getCorrectLimit(placeName, limit);
    QUERY = getCorrectQuery(placeName, limit);
    ResultSet resultSet = makeQuery();
    convertResultsToListOfMaps(resultSet);
    resultsFound = (placeName == null) ? limit : queryResults.size();
    trimResultsToLimit(limit);
  }

  public static void configServerUsingLocation() {
    if (onTravis()) {
      DB_URL = "jdbc:mysql://127.0.0.1/cs314";
      DB_USER = "root";
      DB_PASSWORD = null;
    } else if (usingTunnel()) {
      DB_URL = "jdbc:mysql://127.0.0.1:56247/cs314";
      DB_USER = "cs314-db";
      DB_PASSWORD = "eiK5liet1uej";
    } else {
      DB_URL = "jdbc:mysql://faure.cs.colostate.edu/cs314";
      DB_USER = "cs314-db";
      DB_PASSWORD = "eiK5liet1uej";
    }
  }

  public Integer getCorrectLimit(String placeName, Integer limit) {
    if (placeName != null) return (limit != null && limit <= 100 && limit > 0) ? limit : 100;
    else if (limit != null) return (limit <= 100 && limit > 0) ? limit : 100;
    else return 1;
  }

  public String getCorrectQuery(String placeName, Integer limit) {
    if (placeName != null) {
      return "SELECT "
          + COLUMNS
          + " FROM "
          + TABLES
          + " WHERE ("
          + WHERECLAUSE1
          + placeName
          + "%\" OR "
          + WHERECLAUSE2
          + placeName
          + "%\" OR "
          + WHERECLAUSE3
          + placeName
          + "%\" OR "
          + WHERECLAUSE4
          + placeName
          + "%\") ORDER BY world.name;";
    } else {
      return "SELECT " + COLUMNS + " FROM " + TABLES + " ORDER BY RAND() LIMIT " + limit + ";";
    }
  }

  private ResultSet makeQuery() throws SQLException {
    Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    Statement query = conn.createStatement();
    return query.executeQuery(QUERY);
  }

  private void convertResultsToListOfMaps(ResultSet resultSet) throws SQLException {
    queryResults = new ArrayList<>();

    resultSet.beforeFirst();
    while (resultSet.next()) {
      log.trace(String.format("Adding result %s", resultSet.getString("name")));

      Map<String, String> map = new HashMap<>();
      map.put("name", resultSet.getString("name"));
      map.put("municipality", resultSet.getString("municipality"));
      map.put("altitude", resultSet.getString("altitude"));
      map.put("latitude", resultSet.getString("latitude"));
      map.put("longitude", resultSet.getString("longitude"));
      map.put("type", resultSet.getString("type"));
      map.put("id", resultSet.getString("id"));
      map.put("region", resultSet.getString("region.name"));
      map.put("country", resultSet.getString("country.name"));
      map.put("url", String.format("https://aopa.org/destinations/airports/%s/details", resultSet.getString("id")));
      queryResults.add(map);
    }
  }

  public List<Map<String, String>> getQueryResults() {
    return queryResults;
  }

  public ArrayList<String> getNamesList() {
    ArrayList<String> names = new ArrayList<>();
    for (Map<String, String> result : queryResults) names.add(result.getOrDefault("name", ""));
    return names;
  }

  public void trimResultsToLimit(Integer limit) {
    if (resultsFound > limit) this.queryResults = queryResults.subList(0, limit);
  }

  public String getDbUrl() {
    return DB_URL;
  }

  public String getDbUser() {
    return DB_USER;
  }

  public String getDbPassword() {
    return DB_PASSWORD;
  }

  public Integer getTotalResultsFound() {
    return resultsFound;
  }

  public static boolean onTravis() {
    String var = System.getenv("TRAVIS");
    return var != null && var.equals("true");
  }

  public static boolean usingTunnel() {
    String var = System.getenv("CS314_USE_DATABASE_TUNNEL");
    return var != null && var.equals("true");
  }
}

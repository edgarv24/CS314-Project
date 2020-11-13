package com.tco.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.*;

public class QueryDatabase {

  private final transient Logger log = LoggerFactory.getLogger(QueryDatabase.class);

  private static String DB_URL;
  private static String DB_USER;
  private static String DB_PASSWORD;

  private final String COLUMNS =
      "world.name, world.municipality, country.name, country.id, region.name, world.altitude, world.latitude, world.longitude, world.id, world.type";
  private final String TABLES =
      "world INNER JOIN region ON world.iso_region = region.id INNER JOIN country ON world.iso_country = country.id";
  private final String WHERECLAUSE1 = "country.name LIKE \"%";
  private final String WHERECLAUSE2 = "region.name LIKE \"%";
  private final String WHERECLAUSE3 = "world.name LIKE \"%";
  private final String WHERECLAUSE4 = "world.municipality LIKE \"%";
  private String QUERY;
  private String match;
  private Integer limit;

  private Integer resultsFound;
  private List<Map<String, String>> queryResults;
  private Map<String, ArrayList<String>> filters;
  private static ArrayList<String> allCountries = new ArrayList<>();

  public void configure(
      String userMatch, Integer userLimit, Map<String, ArrayList<String>> narrow) {
    configServerUsingLocation();
    filters = narrow;
    match = userMatch;
    limit = getCorrectLimit(match, userLimit);
    QUERY = configureQueryString(match, limit, filters);
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

  public static boolean onTravis() {
    String var = System.getenv("TRAVIS");
    return var != null && var.equals("true");
  }

  public static boolean usingTunnel() {
    String var = System.getenv("CS314_USE_DATABASE_TUNNEL");
    return var != null && var.equals("true");
  }

  public Integer getCorrectLimit(String match, Integer userLimit) {
    boolean matchSpecified = match != null;
    boolean limitSpecified = userLimit != null;

    if(limitSpecified) {
      if (userLimit > 100 || userLimit <= 0)
        return 100;
      return userLimit;
    }
    else if(matchSpecified){
      return 100;
    }
    return 1;
  }

  public String configureQueryString(
      String match, Integer limit, Map<String, ArrayList<String>> filters) {
    String query = "";
    String portFilter = null;
    String geoFilter = null;
    if (filters != null) {
      if (filters.containsKey("type")) portFilter = constructPortFilter(filters);
      if (filters.containsKey("where")) geoFilter = constructGeoFilter(filters);
    }
    if (match != null) {
      query +=
          "SELECT "
              + COLUMNS
              + " FROM "
              + TABLES
              + " WHERE (("
              + WHERECLAUSE1
              + match
              + "%\" OR "
              + WHERECLAUSE2
              + match
              + "%\" OR "
              + WHERECLAUSE3
              + match
              + "%\" OR "
              + WHERECLAUSE4
              + match
              + "%\")";
      if (geoFilter != null) query += " AND " + geoFilter;
      if (portFilter != null) query += " AND " + portFilter;
      query += ") ORDER BY world.name;";
    } else {
      return "SELECT " + COLUMNS + " FROM " + TABLES + " ORDER BY RAND() LIMIT " + limit + ";";
    }
    return query;
  }

  public String constructPortFilter(Map<String, ArrayList<String>> filters) {
    ArrayList<String> ports = filters.get("type");
    String portFilter = "(world.type LIKE \"%" + ports.get(0) + "%\"";
    if (ports.size() > 1) portFilter += " OR world.type LIKE \"%" + ports.get(1) + "%\"";
    if (ports.size() > 2) portFilter += " OR world.type LIKE \"%" + ports.get(2) + "%\"";
    portFilter += ")";
    return portFilter;
  }

  public String constructGeoFilter(Map<String, ArrayList<String>> filters) {
    ArrayList<String> geos = filters.get("where");
    StringBuilder geoFilter = new StringBuilder("(country.name = \"" + geos.get(0) + "\"");
    for (int i = 1; i < geos.size(); i++) {
      geoFilter.append(" OR country.name = \"").append(geos.get(i)).append("\"");
    }
    geoFilter.append(")");
    return geoFilter.toString();
  }

  public void executeQuery() throws SQLException {
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        Statement query = conn.createStatement();
        ResultSet results = query.executeQuery(QUERY)) {
      convertResultsToListOfMaps(results);
      resultsFound = (match == null) ? limit : queryResults.size();
      trimResultsToLimit(limit);
    }
  }

  public static ArrayList<String> getCountryList() throws SQLException {
    configServerUsingLocation();
    if (allCountries.isEmpty()) {
      try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
          Statement query = conn.createStatement();
          ResultSet countryResultSet = query.executeQuery("SELECT country.name FROM country")) {
        while (countryResultSet.next()) {
          String countryName = countryResultSet.getString("country.name");
          allCountries.add(countryName);
        }
      }
    }
    return allCountries;
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
      map.put("id", resultSet.getString("world.id"));
      map.put("region", resultSet.getString("region.name"));
      map.put("country", resultSet.getString("country.name"));
      map.put("country_id", resultSet.getString("country.id"));
      map.put(
          "url",
          String.format(
              "https://aopa.org/destinations/airports/%s/details", resultSet.getString("id")));
      queryResults.add(map);
    }
  }

  public List<Map<String, String>> getQueryResults() {
    return queryResults;
  }

  public void trimResultsToLimit(Integer limit) {
    if (resultsFound > limit) this.queryResults = queryResults.subList(0, limit);
  }

  public Integer getTotalResultsFound() {
    return resultsFound;
  }

  public String getMatch() {
    return match;
  }

  public Integer getLimit() {
    return limit;
  }

  public Map<String, ArrayList<String>> getFilters() {
    return filters;
  }
}

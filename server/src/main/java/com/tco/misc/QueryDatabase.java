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

    private final static String COLUMN = "name";
    private final String QUERY;
    private List<Map<String, String>> queryResults;

    public QueryDatabase(String placeName) throws SQLException {
        configServerUsingLocation();

        QUERY = "SELECT " + COLUMN + " FROM world WHERE " + COLUMN + " LIKE \"%" + placeName + "%\"";
        ResultSet resultSet = makeQuery();
        convertResultsToListOfMaps(resultSet);
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

    private ResultSet makeQuery() throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        Statement query = conn.createStatement();
        return query.executeQuery(QUERY);
    }

    private void convertResultsToListOfMaps(ResultSet resultSet) throws SQLException {
        queryResults = new ArrayList<>();

        resultSet.beforeFirst();
        while (resultSet.next()) {
            String nextResult = resultSet.getString("name");
            log.trace(String.format("Adding result %s", nextResult));

            Map<String, String> map = new HashMap<>();
            map.put("name", nextResult);
            queryResults.add(map);
        }
    }

    public List<Map<String, String>> getQueryResults() { return queryResults; }

    public ArrayList<String> getNamesList() {
        ArrayList<String> names = new ArrayList<>();
        for (Map<String, String> result : queryResults)
            names.add(result.getOrDefault("name", ""));
        return names;
    }

    public String getDbUrl() { return DB_URL; }
    public String getDbUser() { return DB_USER; }
    public String getDbPassword() { return DB_PASSWORD; }

    public static boolean onTravis() {
        String var = System.getenv("TRAVIS");
        return var != null && var.equals("true");
    }

    public static boolean usingTunnel() {
        String var = System.getenv("CS314_USE_DATABASE_TUNNEL");
        return var != null && var.equals("true");
    }
}

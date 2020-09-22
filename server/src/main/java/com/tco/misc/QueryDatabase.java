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

    String isTravis = System.getenv("TRAVIS");
    private final String useTunnel = System.getenv("CS314_USE_DATABASE_TUNNEL");
    private String DB_URL = null;
    private static String DB_USER = null;
    private static String DB_PASSWORD = null;

    private static String userInputValue = null;
    private final static String COLUMN = "name";
    private static String QUERY;

    private final ArrayList<String> resultsArr;

    QueryDatabase(String userInput) throws SQLException {
        userInputValue = userInput;
        QUERY = "SELECT " + COLUMN + " FROM world WHERE " + COLUMN + " LIKE \"%" + userInputValue + "%\"";
        resultsArr = new ArrayList<String>();
        checkIfTravis();
        ResultSet results = makeQuery();
        addResultsToArray(results);
    }

    public void checkIfTravis() {
        if (isTravis != null && isTravis.equals("true")) {
            DB_URL = "jdbc:mysql://127.0.0.1/cs314";
            DB_USER = "root";
            DB_PASSWORD = null;
        } else if (useTunnel != null && useTunnel.equals("true")) {
            DB_URL = "jdbc:mysql://127.0.0.1:56247/cs314";
            DB_USER = "cs314-db";
            DB_PASSWORD = "eiK5liet1uej";
        } else {
            DB_URL = "jdbc:mysql://faure.cs.colostate.edu/cs314";
            DB_USER = "cs314-db";
            DB_PASSWORD = "eiK5liet1uej";
        }
    }

    public ResultSet makeQuery() throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        Statement query = conn.createStatement();
        return query.executeQuery(QUERY);
    }

    public void addResultsToArray(ResultSet results) throws SQLException {
        results.beforeFirst();
        while (results.next()) {
            log.trace("Adding result");
            resultsArr.add(results.getString("name"));
        }
    }

    public List<Map<String, String>> returnResults() {
        List<Map<String, String>> results = new ArrayList<>();
        for (String place : resultsArr) {
            Map map = new HashMap();
            map.put("name", place);
            results.add(map);
        }
        return results;
    }

    public String getDbUrl() { return this.DB_URL; }
    public String getDbUser() { return DB_USER; }
    public String getDbPassword() { return DB_PASSWORD; }
    public String getUserInputValue() { return userInputValue; }
    public int getResultsSize() { return resultsArr.size(); }

}

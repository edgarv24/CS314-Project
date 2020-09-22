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

    private final static String DB_URL = "jdbc:mariadb://127.0.0.1:56247/cs314";
    private final static String DB_USER = "cs314-db";
    private final static String DB_PASSWORD = "eiK5liet1uej";

    private static String Userinputvalue = null;
    private final static String COLUMN = "name";
    private static String QUERY;

    private ArrayList<String> resultsArr = new ArrayList<String>();

    QueryDatabase(String userInput) throws SQLException {
        this.Userinputvalue = userInput;
        this.QUERY = "SELECT " + COLUMN + " FROM world WHERE " + COLUMN + " LIKE \"%" + Userinputvalue + "%\"";
        ResultSet results = makeQuery();
        addResultsToArray(results);
    }

    public ResultSet makeQuery() throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        Statement query = conn.createStatement();
        ResultSet results = query.executeQuery(QUERY);
        return results;
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

    public String getDbUrl() {
        return this.DB_URL;
    }
    public String getDbUser() {
        return this.DB_USER;
    }
    public String getDbPassword() {
        return this.DB_PASSWORD;
    }
    public String getUserinputvalue() {return this.Userinputvalue;}

    public int getResultsSize() {return this.resultsArr.size();}

}

package com.tco.misc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class QueryDatabase {

    private final static String DB_URL = "jdbc:mariadb://127.0.0.1:56247/cs314";

    private final static String DB_USER = "cs314-db";
    private final static String DB_PASSWORD = "eiK5liet1uej";
    private static String Userinputvalue = null;

    private static ArrayList<String> resultsArr = new ArrayList<String>();

    QueryDatabase(String userInput) {
        this.Userinputvalue = userInput;
    }

    private final static String COLUMN = "name, municipality";
    private final static String QUERY = "SELECT DISTINCT name, municipality FROM world WHERE name LIKE \"" + Userinputvalue + "\" OR municipality LIKE \"" + Userinputvalue + "\" ORDER BY name, municipality;";


    public static void main(String[] args) {
        try (

                // connect to the database and query
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                Statement query = conn.createStatement();
                ResultSet results = query.executeQuery(QUERY)
        ) {
            // iterate through query results and print out the column values
            int count = 0;
            while (results.next()) {
                resultsArr.add(results.getString(COLUMN));
                System.out.printf("%6d %s\n", ++count, results.getString(COLUMN));
            }
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
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

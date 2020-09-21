package com.tco.misc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;

public class QueryDatabase {

    private final static String DB_URL = "jdbc:mariadb://127.0.0.1:56247/cs314";

    private final static String DB_USER = "cs314-db";
    private final static String DB_PASSWORD = "eiK5liet1uej";

    private final static String COLUMN = "id";
    private final static String QUERY = "SELECT DISTINCT "+ COLUMN +" FROM world ORDER BY "+ COLUMN +" ASC;";

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

}

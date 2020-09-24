package com.tco.requests;

import com.tco.misc.QueryDatabase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestFind {

  private RequestFind requestFind;
  private QueryDatabase db;

  @BeforeEach
  public void createConfigurationForTestCases() throws SQLException{
    requestFind = new RequestFind();
    requestFind.buildResponse();
    db = new QueryDatabase("Denver");
  }

  @Test
  @DisplayName("Request type is \"find\"")
  public void testType() {
    String type = requestFind.getRequestType();
    assertEquals("find", type);
  }

  @Test
  @DisplayName("Version number is equal to 2")
  public void testVersion() {
    int version = requestFind.getRequestVersion();
    assertEquals(2, version);
  }

  @Test
  @DisplayName("returnResults is equal to 7")
  public void testReturnResults() {
    List<Map<String, String>> results = db.returnResults();
    assertEquals(7, results.size());
  }

  @Test
  @DisplayName("Exception is equal to null")
  public void testPlaces() {
    List<Map<String, String>> place = requestFind.getPlaces();
    assertEquals(7, place.size());
  }
}
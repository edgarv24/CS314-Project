package com.tco.requests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestFind {

  private RequestFind requestFind;

  @BeforeEach
  public void createConfigurationForTestCases() throws SQLException {
    requestFind = new RequestFind("Denver", 0);
    requestFind.buildResponse();
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
    List<Map<String, String>> results = requestFind.getPlaces();
    assertEquals(7, results.size());
  }
}

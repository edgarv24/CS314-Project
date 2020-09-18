package com.tco.requests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestFind {

  private RequestFind requestFind;

  @BeforeEach
  public void createConfigurationForTestCases(){
    requestFind = new RequestFind();
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
}
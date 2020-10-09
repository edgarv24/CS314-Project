package com.tco.requests;

import com.tco.requests.RequestConfig;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestConfig {

  private RequestConfig conf;

  @BeforeEach
  public void createConfigurationForTestCases() {
    conf = new RequestConfig();
    conf.buildResponse();
  }

  @Test
  @DisplayName("Request type is \"config\"")
  public void testType() {
    String type = conf.getRequestType();
    assertEquals("config", type);
  }

  @Test
  @DisplayName("Version number is equal to 3")
  public void testVersion() {
    int version = conf.getRequestVersion();
    assertEquals(3, version);
  }

  @Test
  @DisplayName("Team name is t14 The Fourteeners")
  public void testServerName() {
    String name = conf.getServerName();
    assertEquals("t14 The Fourteeners", name);
  }

  @Test
  @DisplayName("3 supportedRequests")
  public void testSupportedRequests() {
    int size = conf.getSupportedRequests().size();
    assertEquals(4, size);
  }
}

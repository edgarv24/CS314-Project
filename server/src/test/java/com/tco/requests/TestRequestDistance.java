package com.tco.requests;

import com.tco.misc.BadRequestException;
import com.tco.requests.RequestDistance;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

public class TestRequestDistance {

  private RequestDistance dist;

  @BeforeEach
  public void createDistanceForTestCases() throws BadRequestException {
    dist = new RequestDistance(6371.0, "90.0", "0.0", "-90.0", "0.0");
    dist.buildResponse();
  }

  @Test
  @DisplayName("Request type is \"distance\"")
  public void testType() {
    String type = dist.getRequestType();
    assertEquals("distance", type);
  }

  @Test
  @DisplayName("Version number is equal to 4")
  public void testVersion() {
    int version = dist.getRequestVersion();
    assertEquals(4, version);
  }

  @Test
  @DisplayName("EarthRadius is equal to 6371.00")
  public void testGetEarthRadius() {
    double radius = dist.getEarthRadius();
    assertEquals(6371.0, radius);
  }

  @Test
  @DisplayName("Latitude 1 is equal to 90.0")
  public void testGetLatitude1() {
    String lat1 = dist.getLatitude1();
    assertEquals("90.0", lat1);
  }

  @Test
  @DisplayName("Latitude 2 is equal to -90.0")
  public void testGetLatitude2() {
    String lat2 = dist.getLatitude2();
    assertEquals("-90.0", lat2);
  }

  @Test
  @DisplayName("Longitude 1 is equal to 0.0")
  public void testGetLongitude1() {
    String log1 = dist.getLongitude1();
    assertEquals("0.0", log1);
  }

  @Test
  @DisplayName("Longitude 2 is equal to 0.0")
  public void testGetLongitude2() {
    String log2 = dist.getLongitude2();
    assertEquals("0.0", log2);
  }

  @Test
  @DisplayName("Distance is equal to 20015")
  public void testGetDistance() {
    Long distance = dist.getDistance();
    assertEquals(20015, distance);
  }

  @Test
  @DisplayName("BadRequestException thrown after invalid request")
  public void testDistanceNullWhenInvalid() {
    dist = new RequestDistance(6371.0, "100f", "0f", "0f", "0f");
    assertThrows(BadRequestException.class, () -> dist.buildResponse());
  }
}

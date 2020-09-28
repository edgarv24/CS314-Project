package com.tco.misc;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestCalculateDistance {
  private CalculateDistance calcDist = CalculateDistance.usingRadius(6371.0);
  private static final double DELTA = 0.001;

  @BeforeEach
  public void createConfigurationForTestCases() {}

  @Test
  @DisplayName("Distance between LSC and Moby is correct")
  public void testShortDistance() {
    double[] locLSC = {40.574913, -105.084732};
    double[] locMoby = {40.575735, -105.093213};
    long dist = calcDist.distBetween(locLSC, locMoby);
    assertEquals(1, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Fort Collins, CO and Rapid City, SD is correct")
  public void testMediumDistance() {
    double[] locFC = {40.5853, -105.0844};
    double[] locRC = {44.0805, -103.2310};
    long dist = calcDist.distBetween(locFC, locRC);
    assertEquals(417, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Brazil and France is correct")
  public void testLongDistance() {
    double[] locBrazil = {-14.2350, -51.9253};
    double[] locFrance = {42.2276, 2.2137};
    long dist = calcDist.distBetween(locBrazil, locFrance);
    assertEquals(8363, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Rosario, Argentina and Xinghua, China is correct")
  public void testVeryLongDistance() {
    double[] locRA = {-32.9587, -60.6930};
    double[] locXC = {32.9105, 119.8525};
    long dist = calcDist.distBetween(locRA, locXC);
    assertEquals(19964, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between North Pole and South Pole is correct")
  public void testPolesDistance() {
    double[] locNP = {90.0, 0.0};
    double[] locSP = {-90.0, 0.0};
    long dist = calcDist.distBetween(locNP, locSP);
    assertEquals(20015, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between West and East is correct")
  public void testWestEastDistance() {
    double[] locWest = {0.0, 120.0};
    double[] locEast = {0.0, -120.0};
    long dist = calcDist.distBetween(locWest, locEast);
    assertEquals(13343, dist, DELTA);
  }

  @Test
  @DisplayName("Distance is equal to 0")
  public void testSameLatAndLong() {
    double[] locA = {50.0, -30.0};
    double[] locB = {50.0, -30.0};
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(0, dist);
  }

  @Test
  @DisplayName("Invalid longitude")
  public void testInvalidLongitude() {
    double[] locA = {0.0, 181.0};
    double[] locB = {0.0, 0.0};
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(-1, dist, DELTA);
  }

  @Test
  @DisplayName("Invalid latitude")
  public void testInvalidLatitude() {
    double[] locA = {0.0, 0.0};
    double[] locB = {-91.0, 0.0};
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(-1, dist, DELTA);
  }

  @Test
  @DisplayName("Far places with Earth radius in millimeters")
  public void testFarPlacesEarthRadiusMillimeters() {
    double[] locA = {40.416775, -3.703790};
    double[] locB = {-41.276825, 174.777969};
    calcDist = CalculateDistance.usingRadius(6371008771.4);
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(19855573534L, dist);
  }

  @Test
  @DisplayName("Close places Earth radius in nanometers")
  public void testClosePlacesEarthRadiusNanometers() {
    double[] locA = {40.5734, -105.0865};
    double[] locB = {40.5734, -105.08650000000001};
    calcDist = CalculateDistance.usingRadius(6378159999999974.0);
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(1, dist);
  }

  @Test
  @DisplayName("Close places Earth radius in feet")
  public void testClosePlacesEarthRadiusFeet() {
    double[] locA = {40.395504, -105.081169};
    double[] locB = {40.398668, -105.077956};
    calcDist = CalculateDistance.usingRadius(20902460);
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(1459, dist);
  }

  @Test
  @DisplayName("Boundary longitude values should be equal")
  public void testEqualBoundaryLongitudeValues() {
    double[] locA = {20, -180};
    double[] locB = {20, 180};
    long dist = calcDist.distBetween(locA, locB);
    assertEquals(0, dist);
  }
}

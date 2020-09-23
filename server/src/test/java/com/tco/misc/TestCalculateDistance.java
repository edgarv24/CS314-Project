package com.tco.misc;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.util.HashMap;

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
    double dist = calcDist.distBetween(locLSC, locMoby);
    assertEquals(0.72209877, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Fort Collins, CO and Rapid City, SD is correct")
  public void testMediumDistance() {
    double[] locFC = {40.5853, -105.0844};
    double[] locRC = {44.0805, -103.2310};
    double dist = calcDist.distBetween(locFC, locRC);
    assertEquals(417.4112125, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Brazil and France is correct")
  public void testLongDistance() {
    double[] locBrazil = {-14.2350, -51.9253};
    double[] locFrance = {42.2276, 2.2137};
    double dist = calcDist.distBetween(locBrazil, locFrance);
    assertEquals(8363.4364175, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between Rosario, Argentina and Xinghua, China is correct")
  public void testVeryLongDistance() {
    double[] locRA = {-32.9587, -60.6930};
    double[] locXC = {32.9105, 119.8525};
    double dist = calcDist.distBetween(locRA, locXC);
    assertEquals(19963.8967326, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between North Pole and South Pole is correct")
  public void testPolesDistance() {
    double[] locNP = {90.0, 0.0};
    double[] locSP = {-90.0, 0.0};
    double dist = calcDist.distBetween(locNP, locSP);
    assertEquals(20015.086796, dist, DELTA);
  }

  @Test
  @DisplayName("Distance between West and East is correct")
  public void testWestEastDistance() {
    double[] locWest = {0.0, 120.0};
    double[] locEast = {0.0, -120.0};
    double dist = calcDist.distBetween(locWest, locEast);
    assertEquals(13343.391197, dist, DELTA);
  }
}

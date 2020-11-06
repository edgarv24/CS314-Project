package com.tco.misc;

import org.junit.jupiter.api.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TestOptimizer {
  Optimizer opt;
  List<Map<String, String>> places;

  @BeforeAll
  public void init() {
    opt = new Optimizer();
    places = new ArrayList<>();
    Map<String, String> placesEntry1 = new HashMap<>();
    placesEntry1.put("name", "Denver");
    placesEntry1.put("latitude", "39.7");
    placesEntry1.put("longitude", "-105.0");

    Map<String, String> placesEntry2 = new HashMap<>();
    placesEntry2.put("name", "Boulder");
    placesEntry2.put("latitude", "40.0");
    placesEntry2.put("longitude", "-105.4");

    Map<String, String> placesEntry3 = new HashMap<>();
    placesEntry3.put("name", "Fort Collins");
    placesEntry3.put("latitude", "40.6");
    placesEntry3.put("longitude", "-105.1");

    Map<String, String> placesEntry4 = new HashMap<>();
    placesEntry4.put("name", "Colorado Springs");
    placesEntry4.put("latitude", "38.8");
    placesEntry4.put("longitude", "-104.8");

    places.add(placesEntry1);
    places.add(placesEntry4);
    places.add(placesEntry3);
    places.add(placesEntry2);
  }

  @Test
  @DisplayName("It should hold the places object")
  public void testPlaces() {
    assertNotNull(opt.getPlaces());
  }

  @Test
  @DisplayName("Initialize places to number of places in tour")
  public void testPlacesSize() {
    opt.setPlaces(places);
    assertEquals(4, opt.getPlaces().size());
  }

  @Test
  @DisplayName("It should have an integer array to hold the tour")
  public void testTourArray() {
    assertNotNull(opt.getTour());
  }

  @Test
  @DisplayName("Initialize the tour array to the number of places in tour")
  public void testTourArraySize() {
    opt.setTour(places);
    assertEquals(4, opt.getTour().length);
  }

  @Test
  @DisplayName("Tour array must hold indexes of places (0,1,2,3...N)")
  public void testTourArrayIndices() {
    opt.setTour(places);
    for (int i = 0; i < places.size(); i++) assertEquals(i, opt.getTour()[i]);
  }

  @Test
  @DisplayName("It should have a boolean array for unvisited cities")
  public void testVisitedCities() {
    assertNotNull(opt.getVisitedCities());
  }

  @Test
  @DisplayName("Initialize Visited Cities array to number of places in tour")
  public void testVisitedCitiesSize() {
    opt.setVisitedCities(places);
    assertEquals(4, opt.getVisitedCities().length);
  }

  @Test
  @DisplayName("It should have a 2D int matrix for distances")
  public void testDistancesMatrix() {
    opt.buildDistancesMatrix(places);
    assertNotNull(opt.getDistancesMatrix());
    for (int i = 0; i < places.size(); i++) assertEquals(4, opt.getDistancesMatrix()[i].length);
  }

  @Test
  @DisplayName("Testing that distances are computed correctly")
  public void testDistancesMatrixValues() {
    CalculateDistance cd = CalculateDistance.usingRadius(3959.0);
    opt.buildDistancesMatrix(places);
    for (int i = 0; i < places.size(); i++)
      for (int j = 0; j < places.size(); j++)
        assertEquals(cd.distBetween(places.get(i), places.get(j)), opt.getDistancesMatrix()[i][j]);
  }

  @Test
  @DisplayName("Testing configure method sets all properties at once")
  public void testConfigure() {
    opt.configure(places);
    assertEquals(4, opt.getPlaces().size());
    assertEquals(4, opt.getTour().length);
    assertEquals(4, opt.getVisitedCities().length);
    for (int i = 0; i < places.size(); i++) assertEquals(4, opt.getDistancesMatrix()[i].length);
    CalculateDistance cd = CalculateDistance.usingRadius(3959.0);
    for (int i = 0; i < places.size(); i++)
      for (int j = 0; j < places.size(); j++)
        assertEquals(cd.distBetween(places.get(i), places.get(j)), opt.getDistancesMatrix()[i][j]);
  }

  @Test
  @DisplayName("Testing Nearest Neighbor method")
  public void testNearestNeighbor() {
    opt.configure(places);
    opt.findNearestNeighborTour();
    int[] actualTour = opt.getTour();
    int[] expectedTour = {0, 1, 2, 3};
    assertTrue(Arrays.equals(actualTour, expectedTour));
  }

  @Test
  @DisplayName("Testing buildNearestNeighbor should match hand-solved solutions")
  public void testBuildNearestNeighbor() {
    opt.configure(places);
    int[] expectedArray1 = {0, 3, 2, 1};
    assertTrue(Arrays.equals(expectedArray1, opt.buildNearestNeighborTour(0)));
    int[] expectedArray2 = {1, 0, 3, 2};
    assertTrue(Arrays.equals(expectedArray2, opt.buildNearestNeighborTour(1)));
    int[] expectedArray3 = {2, 3, 0, 1};
    assertTrue(Arrays.equals(expectedArray3, opt.buildNearestNeighborTour(2)));
    int[] expectedArray4 = {3, 0, 2, 1};
    assertTrue(Arrays.equals(expectedArray4, opt.buildNearestNeighborTour(3)));
  }

  @Test
  @DisplayName("Test visitedContainsFalse works correctly")
  public void testVisitedContainsFalse() {
    boolean[] allTrue = {true, true, true};
    assertFalse(opt.visitedContainsFalse(allTrue));
    boolean[] lastFalse = {true, true, true, true, false};
    assertTrue(opt.visitedContainsFalse(lastFalse));
    lastFalse[4] = true;
    assertFalse(opt.visitedContainsFalse(lastFalse));
  }

  @Test
  @DisplayName("Test totalDistance returns correct distances")
  public void testTotalDistance() {
    opt.configure(places);
    int[] tour1 = {0, 1, 2, 3};
    int expectedDistance = 262;
    assertEquals(expectedDistance, opt.totalDistance(tour1));
    int[] tour2 = {0, 3, 2, 1};
    assertEquals(expectedDistance, opt.totalDistance(tour2));
    int[] tour3 = {1, 0, 3, 2};
    assertEquals(expectedDistance, opt.totalDistance(tour3));
    int[] tour4 = {2, 3, 0, 1};
    assertEquals(expectedDistance, opt.totalDistance(tour4));
    int[] tour5 = {3, 0, 2, 1};
    expectedDistance = 306;
    assertEquals(expectedDistance, opt.totalDistance(tour5));
  }
}

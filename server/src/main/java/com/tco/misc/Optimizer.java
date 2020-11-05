package com.tco.misc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Optimizer {
  private final double EARTH_RADIUS = 3959.0;
  private List<Map<String, String>> places;
  private int[] tour;
  private boolean[] visitedCities;
  private int[][] distancesMatrix;
  CalculateDistance cd;

  public void setPlaces(List<Map<String, String>> places) {
    this.places = new ArrayList<>();
    this.places = places;
  }

  public void setTour(List<Map<String, String>> places) {
    tour = new int[places.size()];
    for (int i = 0; i < places.size(); i++) tour[i] = i;
  }

  public void setVisitedCities(List<Map<String, String>> places) {
    visitedCities = new boolean[places.size()];
    for (int i = 0; i < places.size(); i++) visitedCities[i] = false;
  }

  public void buildDistancesMatrix(List<Map<String, String>> places) {
    int rows = places.size();
    int cols = places.size();
    distancesMatrix = new int[rows][cols];
    cd = CalculateDistance.usingRadius(EARTH_RADIUS);
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (i == j) distancesMatrix[i][j] = 0;
        else distancesMatrix[i][j] = (int) cd.distBetween(places.get(i), places.get(j));
      }
    }
  }

  public List<Map<String, String>> getPlaces() {
    return places;
  }

  public int[] getTour() {
    return tour;
  }

  public boolean[] getVisitedCities() {
    return visitedCities;
  }

  public int[][] getDistancesMatrix() {
    return distancesMatrix;
  }
}

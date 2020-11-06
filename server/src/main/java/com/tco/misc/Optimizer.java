package com.tco.misc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Optimizer {
  private List<Map<String, String>> places;
  private int[] tour;
  private boolean[] visitedCities;
  private int[][] distancesMatrix;
  CalculateDistance cd;

  public void configure(List<Map<String, String>> places) {
    setPlaces(places);
    setTour(places);
    setVisitedCities(places);
    buildDistancesMatrix(places);
  }

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
  }

  public void buildDistancesMatrix(List<Map<String, String>> places) {
    int rows = places.size();
    int cols = places.size();
    distancesMatrix = new int[rows][cols];
    cd = CalculateDistance.usingRadius(3959.0);
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (i == j) distancesMatrix[i][j] = 0;
        else distancesMatrix[i][j] = (int) cd.distBetween(places.get(i), places.get(j));
      }
    }
  }

  public void findNearestNeighborTour() {
    int[] minTour = tour.clone();
    int[] current;
    for (int start : tour) {
      current = buildNearestNeighborTour(start);
      if (totalDistance(current) < totalDistance(minTour)) minTour = current;
    }
    tour = minTour;
  }

  public int[] buildNearestNeighborTour(int start) {
    int[] tempTour = new int[tour.length];
    boolean[] visited = new boolean[visitedCities.length];
    int currentIndex = 0;
    tempTour[currentIndex] = start;
    visited[start] = true;
    int next = start;
    while (visitedContainsFalse(visited)) {
      next = nearestNeighbor(visited, next);
      tempTour[++currentIndex] = next;
      visited[next] = true;
    }
    return tempTour;
  }

  public boolean visitedContainsFalse(boolean[] visited) {
    for (boolean bool : visited) {
      if (!bool) return true;
    }
    return false;
  }

  public int nearestNeighbor(boolean[] visited, int current) {
    int minDistance = Integer.MAX_VALUE;
    int tempDistance;
    int nearestNeighbor = 0;
    for (int i = 0; i < visited.length; i++) {
      if (!visited[i]) {
        tempDistance = distancesMatrix[current][i];
        if (tempDistance < minDistance) {
          minDistance = tempDistance;
          nearestNeighbor = i;
        }
      }
    }
    return nearestNeighbor;
  }

  public int totalDistance(int[] currentTour) {
    int totalDistance = 0;
    int size = currentTour.length;
    for (int i = 0; i < size; i++)
      totalDistance += distancesMatrix[currentTour[i % size]][currentTour[(i + 1) % size]];
    return totalDistance;
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

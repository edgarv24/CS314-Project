package com.tco.misc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Optimizer {
  private List<Map<String, String>> places;
  private int[] tour;
  private boolean[] visitedCities;

  Optimizer() {
    places = new ArrayList<>();
  }

  public void setPlaces(List<Map<String, String>> places) {
    this.places = places;
  }

  public void setTour(List<Map<String, String>> places) {
    tour = new int[places.size()];
    for (int i = 0; i < places.size(); i++) tour[i] = i;
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

  public void setVisitedCities(List<Map<String, String>> places) {
    visitedCities = new boolean[places.size()];
    for (int i = 0; i < places.size(); i++) visitedCities[i] = false;
  }
}

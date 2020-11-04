package com.tco.misc;

import java.util.List;
import java.util.Map;

public class Optimizer {
  private int[] tour;

  public void setTour(List<Map<String, String>> places) {
    tour = new int[places.size()];
    for (int i = 0; i < places.size(); i++) tour[i] = i;
  }

  public int[] getTour() {
    return tour;
  }
}

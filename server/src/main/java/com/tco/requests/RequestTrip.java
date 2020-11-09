package com.tco.requests;

import com.tco.misc.CalculateDistance;
import com.tco.misc.Optimizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RequestTrip extends RequestHeader {
  private Map<String, String> options;
  private List<Map<String, String>> places;
  private List<Long> distances;

  private final transient Logger log = LoggerFactory.getLogger(RequestTrip.class);

  public RequestTrip() {
    this.requestType = "trip";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
  }

  public RequestTrip(Map<String, String> options, List<Map<String, String>> places) {
    this();
    this.options = options;
    this.places = places;
  }

  @Override
  public void buildResponse() {
    if (options.get("response").equals("1.0") || options.get("response").equals("1")) {
      Optimizer opt = new Optimizer();
      opt.configure(places);
      opt.findNearestNeighborTour();
      opt.performTwoOpt();
      places = opt.getOptimizedPlaces();
    }
    buildDistanceList(options, places);
    log.trace("buildResponse -> {}", this);
  }

  public void buildDistanceList(Map<String, String> options, List<Map<String, String>> places) {
    distances = new ArrayList<>();
    double radius = Double.parseDouble(options.get("earthRadius"));
    CalculateDistance cd = CalculateDistance.usingRadius(radius);
    for (int i = 0; i < places.size(); i++) {
      if (i != places.size() - 1)
        distances.add(cd.distBetween(places.get(i), places.get(i + 1)));
      else
        distances.add(cd.distBetween(places.get(i), places.get(0)));
    }
  }

  public Map<String, String> getOptions() {
    return this.options;
  }

  public List<Map<String, String>> getPlaces() {
    return this.places;
  }

  public List<Long> getDistances() {
    return this.distances;
  }
}

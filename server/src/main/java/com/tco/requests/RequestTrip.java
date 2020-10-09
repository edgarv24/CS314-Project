package com.tco.requests;

import com.tco.misc.BadRequestException;
import com.tco.misc.CalculateDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RequestTrip extends RequestHeader {
  private Map<String, String> options;
  private List<Map<String, String>> places;
  private List<Long> distances;
  private CalculateDistance cd;

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
  public void buildResponse() throws BadRequestException {
    buildDistanceList(options, places);
    log.trace("buildResponse -> {}", this);
  }

  public void buildDistanceList(Map<String, String> options, List<Map<String, String>> places) {
    distances = new ArrayList<>();
    Double radius = Double.parseDouble(options.get("earthRadius"));
    cd = CalculateDistance.usingRadius(radius);
    for (int i = 0; i < places.size(); i++) {
      double lat1 = Double.parseDouble(places.get(i).get("latitude"));
      double long1 = Double.parseDouble(places.get(i).get("longitude"));
      double lat2;
      double long2;
      if (i != places.size() - 1) {
        lat2 = Double.parseDouble(places.get(i + 1).get("latitude"));
        long2 = Double.parseDouble(places.get(i + 1).get("longitude"));
      } else {
        lat2 = Double.parseDouble(places.get(0).get("latitude"));
        long2 = Double.parseDouble(places.get(0).get("longitude"));
      }
      distances.add((long) cd.distBetween(lat1, long1, lat2, long2));
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

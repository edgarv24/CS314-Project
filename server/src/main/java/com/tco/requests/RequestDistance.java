package com.tco.requests;

import java.util.*;

import com.tco.misc.CalculateDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RequestDistance extends RequestHeader {

  private Integer distance;
  private Float earthRadius;
  private Map<String, String> place1, place2;

  private final transient Logger log = LoggerFactory.getLogger(RequestDistance.class);

  public RequestDistance() {
    this.requestType = "distance";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
  }

  public RequestDistance(Float earthRadius, String lat1, String long1, String lat2, String long2) {
    this();
    this.distance = 0;
    this.earthRadius = earthRadius;
    this.place1 = new HashMap<>();
    this.place1.put("latitude", lat1);
    this.place1.put("longitude", long1);
    this.place2 = new HashMap<>();
    this.place2.put("latitude", lat2);
    this.place2.put("longitude", long2);
  }

  @Override
  public void buildResponse() {
    CalculateDistance cd = CalculateDistance.usingRadius(earthRadius);
    this.distance = cd.distBetween(place1, place2);
    if (this.distance == -1){
      this.distance = null;
    }
    log.trace("buildResponse -> {}", this);
  }

  public Integer getDistance() {
    return distance;
  }

  public String getLatitude1() {
    return place1.getOrDefault("latitude", null);
  }

  public String getLongitude1() {
    return place1.getOrDefault("longitude", null);
  }

  public String getLatitude2() {
    return place2.getOrDefault("latitude", null);
  }

  public String getLongitude2() {
    return place2.getOrDefault("longitude", null);
  }

  public Float getEarthRadius() {
    return earthRadius;
  }
}

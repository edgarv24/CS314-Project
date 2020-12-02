package com.tco.misc;

import java.util.Map;

import static java.lang.Math.*;

public class CalculateDistance {
  private double earthRadius;

  CalculateDistance() {}

  public static CalculateDistance usingRadius(double earthRadius) {
    CalculateDistance cd = new CalculateDistance();
    cd.earthRadius = earthRadius;
    return cd;
  }

  public long distBetween(Map<String, String> latLong1, Map<String, String> latLong2) {
    double lat1 = Double.parseDouble(latLong1.get("latitude"));
    double long1 = Double.parseDouble(latLong1.get("longitude"));
    double lat2 = Double.parseDouble(latLong2.get("latitude"));
    double long2 = Double.parseDouble(latLong2.get("longitude"));

    return Math.round(distBetween(lat1, long1, lat2, long2));
  }

  public long distBetween(double[] latLong1, double[] latLong2) {
    return Math.round(distBetween(latLong1[0], latLong1[1], latLong2[0], latLong2[1]));
  }

  public double distBetween(double lat1, double long1, double lat2, double long2) {
    lat1 = normalizeLatitude(lat1);
    long1 = normalizeLongitude(long1);
    lat2 = normalizeLatitude(lat2);
    long2 = normalizeLongitude(long2);

    if (!validCoordinates(lat1, long1, lat2, long2)) return -1;

    double rLat1 = toRadians(lat1);
    double rLat2 = toRadians(lat2);
    double rLongDiff = toRadians(abs(long1 - long2));

    double centralAngleRadians = calculateCentralAngle(rLat1, rLat2, rLongDiff);

    return centralAngleRadians * earthRadius;
  }

  private double calculateCentralAngle(double rLat1, double rLat2, double rLongDiff) {
    double numerator = pow(cos(rLat2) * sin(rLongDiff), 2);
    numerator += pow(cos(rLat1) * sin(rLat2) - sin(rLat1) * cos(rLat2) * cos(rLongDiff), 2);
    numerator = sqrt(numerator);

    double denominator = sin(rLat1) * sin(rLat2) + cos(rLat1) * cos(rLat2) * cos(rLongDiff);

    return atan2(numerator, denominator);
  }

  private double normalizeLatitude(double lat) {
    while (lat < -90)
      lat += 180;
    while (lat > 90)
      lat -= 180;
    return lat;
  }

  private double normalizeLongitude(double lng) {
    while (lng < -180)
      lng += 360;
    while (lng > 180)
      lng -= 360;
    return lng;
  }

  private boolean validCoordinates(double lat1, double long1, double lat2, double long2) {
    return validLatitude(lat1)
        && validLongitude(long1)
        && validLatitude(lat2)
        && validLongitude(long2);
  }

  private boolean validLatitude(double latitude) {
    return latitude >= -90 && latitude <= 90;
  }

  private boolean validLongitude(double longitude) {
    return longitude >= -180 && longitude <= 180;
  }
}

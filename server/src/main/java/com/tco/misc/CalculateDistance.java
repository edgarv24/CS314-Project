package com.tco.misc;

import org.apache.commons.beanutils.locale.converters.DoubleLocaleConverter;
import org.mariadb.jdbc.internal.com.send.parameters.DoubleParameter;

import java.util.Map;

import static java.lang.Math.*;

public class CalculateDistance {
  private double earthRadiusKm;

  public CalculateDistance() {}

  public static CalculateDistance usingRadius(double earthRadiusKm) {
    CalculateDistance cd = new CalculateDistance();
    cd.earthRadiusKm = earthRadiusKm;
    return cd;
  }

  public double distBetween(double[] latLong1, double[] latLong2) {
    return distBetween(latLong1[0], latLong1[1], latLong2[0], latLong2[1]);
  }

  public int distBetween(Map<String, String> latLong1, Map<String, String> latLong2) {
    double lat1 = Double.parseDouble(latLong1.get("latitude"));
    double long1 = Double.parseDouble(latLong1.get("longitude"));
    double lat2 = Double.parseDouble(latLong2.get("latitude"));
    double long2 = Double.parseDouble(latLong2.get("longitude"));

    return (int)Math.round(distBetween(lat1, long1, lat2, long2));
  }
  public double distBetween(double lat1, double long1, double lat2, double long2) {
    if (!validCoordinates(lat1, long1, lat2, long2)) return -1;

    double rLat1 = toRadians(lat1);
    double rLat2 = toRadians(lat2);
    double rLongDiff = toRadians(abs(long1 - long2));

    double centralAngleRadians = calculateCentralAngle(rLat1, rLat2, rLongDiff);

    return centralAngleRadians * earthRadiusKm;
  }

  private double calculateCentralAngle(double rLat1, double rLat2, double rLongDiff) {
    double numerator = pow(cos(rLat2) * sin(rLongDiff), 2);
    numerator += pow(cos(rLat1) * sin(rLat2) - sin(rLat1) * cos(rLat2) * cos(rLongDiff), 2);
    numerator = sqrt(numerator);

    double denominator = sin(rLat1) * sin(rLat2) + cos(rLat1) * cos(rLat2) * cos(rLongDiff);

    return atan2(numerator, denominator);
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

package com.tco.requests;

import com.tco.requests.RequestDistance;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestDistance {

    private RequestDistance dist;

    @BeforeEach
    public void createDistanceForTestCases(){
        dist = new RequestDistance((float) 6371.00, "90.0", "0.0", "-90.0", "0.0");
        dist.buildResponse();
    }

    @Test
    @DisplayName("Request type is \"distance\"")
    public void testType() {
        String type = dist.getRequestType();
        assertEquals("distance", type);
    }

    @Test
    @DisplayName("Version number is equal to 2")
    public void testVersion() {
        int version = dist.getRequestVersion();
        assertEquals(2, version);
    }

    @Test
    @DisplayName("EarthRadius is equal to 6371.00")
    public void testGetEarthRadius() {
        float er = dist.getEarthRadius();
        assertEquals(6371.00, er);
    }

    @Test
    @DisplayName("Latitude 1 is equal to 90.0")
    public void testGetLatitude1() {
        String lat1 = dist.getLatitude1();
        assertEquals("90.0", lat1);
    }
    @Test
    @DisplayName("Latitude 2 is equal to -90.0")
    public void testGetLatitude2() {
        String lat2 = dist.getLatitude2();
        assertEquals("-90.0", lat2);
    }

    @Test
    @DisplayName("Longitude 1 is equal to 0.0")
    public void testGetLongitude1() {
        String log1 = dist.getLongitude1();
        assertEquals("0.0", log1);
    }

    @Test
    @DisplayName("Longitude 2 is equal to 0.0")
    public void testGetLongitude2() {
        String log2 = dist.getLongitude2();
        assertEquals("0.0", log2);
    }

    @Test
    @DisplayName("Distance is equal to 20015")
    public void testGetDistance(){
        int distance = dist.getDistance();
        assertEquals(20015, distance);
    }

    @Test@DisplayName("Distance is equal to 0")
    public void testSameLatAndLong(){
        if(dist.getLatitude1() == dist.getLatitude2() && dist.getLongitude1() == dist.getLongitude2()){
            int distance = dist.getDistance();
            assertEquals(0, distance);
        }
    }
}
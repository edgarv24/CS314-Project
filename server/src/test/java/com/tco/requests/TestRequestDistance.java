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
        dist = new RequestDistance();
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
    @DisplayName("Team name is t14 The Fourteeners")
    public void testServerName() {
        String name = dist.getServerName();
        assertEquals("t14 The Fourteeners", name);
    }

    @Test
    @DisplayName("Earth radius is 6371.0")
    public void testEarthRadius() {
        double radius = dist.getEarthRadius();
        assertEquals(6371.0, radius);
    }
}
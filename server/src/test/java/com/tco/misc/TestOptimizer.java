package com.tco.misc;

import org.junit.jupiter.api.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TestOptimizer {
    Optimizer opt;
    List<Map<String, String>> places;

    @BeforeAll
    public void init() {
         opt = new Optimizer();
         places = new ArrayList<>();
        Map<String, String> placesEntry1 = new HashMap<>();
        placesEntry1.put("name", "Denver");
        placesEntry1.put("latitude", "39.7");
        placesEntry1.put("longitude", "-105.0");

        Map<String, String> placesEntry2 = new HashMap<>();
        placesEntry2.put("name", "Boulder");
        placesEntry2.put("latitude", "40.0");
        placesEntry2.put("longitude", "-105.4");

        Map<String, String> placesEntry3 = new HashMap<>();
        placesEntry3.put("name", "Fort Collins");
        placesEntry3.put("latitude", "40.6");
        placesEntry3.put("longitude", "-105.1");

        Map<String, String> placesEntry4 = new HashMap<>();
        placesEntry3.put("name", "Colorado Springs");
        placesEntry3.put("latitude", "38.8");
        placesEntry3.put("longitude", "-104.8");

        places.add(placesEntry1);
        places.add(placesEntry2);
        places.add(placesEntry3);
        places.add(placesEntry4);
    }

    @Test
    @DisplayName("It should hold the places object")
    public void testPlaces() {
        assertNotNull(opt.getPlaces());

    }

    @Test
    @DisplayName("Initialize places to number of places in tour")
    public void testPlacesSize() {
        opt.setPlaces(places);
        assertEquals(4, opt.getPlaces().size());
    }

    @Test
    @DisplayName("It should have an integer array to hold the tour")
    public void testTourArray() {
        assertNotNull(opt.getTour());
    }

    @Test
    @DisplayName("Initialize the tour array to the number of places in tour")
    public void testTourArraySize() {
        opt.setTour(places);
        assertEquals(4, opt.getTour().length);
    }

    @Test
    @DisplayName("Tour array must hold indexes of places (0,1,2,3...N)")
    public void testTourArrayIndices() {
        opt.setTour(places);
        for(int i = 0; i < places.size(); i++)
            assertEquals(i, opt.getTour()[i]);
    }

    @Test
    @DisplayName("It should have a boolean array for unvisited cities")
    public void testVisitedCities() {
        assertNotNull(opt.getVisitedCities());
    }

    @Test
    @DisplayName("Initialize Visited Cities array to number of places in tour")
    public void testVisitedCitiesSize() {
        opt.setVisitedCities(places);
        assertEquals(4, opt.getVisitedCities().length);
    }


}

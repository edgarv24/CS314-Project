package com.tco.misc;

import com.tco.misc.JSONValidator;
import com.tco.requests.RequestConfig;

import java.lang.reflect.Type;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class TestJSONValidator {

    private void test(String request, Type type, boolean valid) {
        try {
            JSONValidator.validate(request, type);
            assertTrue(valid);
        } catch ( Exception e ) {
            assertFalse(valid);
        }
    }

    @Test
    @DisplayName("Config request should fail schema validation")
    public void testRequestConfigFail() {
        test("{}", RequestConfig.class, false);
    }

    @Test
    @DisplayName("Config request should pass schema validation")
    public void testRequestConfigPass() {
        test("{\"requestType\":\"config\",\"requestVersion\":1}", RequestConfig.class, true);
    }

    @Test
    @DisplayName("There should be no schema for the JSONValidator class")
    public void testMissingSchema() {
        test("", JSONValidator.class, false);
    }
}

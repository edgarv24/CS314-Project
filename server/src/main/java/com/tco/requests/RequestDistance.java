package com.tco.requests;

import com.tco.misc.BadRequestException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RequestDistance extends RequestHeader {

    private Integer distance;
    private Map<String, String> place1, place2;
    private Float earthRadius;

    private final transient Logger log = LoggerFactory.getLogger(RequestDistance.class);

    public RequestDistance() {
        this.requestType = "distance";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    @Override
    public void buildResponse() {
        this.distance = 0;
        log.trace("buildResponse -> {}", this);
    }

    public Integer getDistance() {
        return distance;
    }
}
package com.tco.requests;

import com.tco.misc.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RequestDistance extends RequestHeader {

    private String serverName;
    private final double EARTH_RADIUS = 6371.0;

    private final transient Logger log = LoggerFactory.getLogger(RequestDistance.class);

    public RequestDistance() {
        this.requestType = "distance";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    @Override
    public void buildResponse() {
        this.serverName = "t14 The Fourteeners";
        log.trace("buildResponse -> {}", this);
    }

    public String getServerName() {
        return serverName;
    }

    public double getEarthRadius() { return EARTH_RADIUS; }
}
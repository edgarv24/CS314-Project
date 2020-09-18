package com.tco.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class RequestFind extends RequestHeader {

  private String match;
  private Integer limit;
  private Integer found;
  private List<Map<String, String>> places;
  private final transient Logger log = LoggerFactory.getLogger(RequestFind.class);

  public RequestFind() {
    this.requestType = "find";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
  }

  public RequestFind(String match, Integer limit) {
    this();
    this.match = match;
    this.limit = limit;
    this.found = null;
    this.places = null;
  }

  @Override
  public void buildResponse() {
    log.trace("buildResponse -> {}", this);
  }

  public String getMatch() { return match; }
  public Integer getLimit() { return limit; }
  public Integer getFound() { return found; }
  public List<Map<String, String>> getPlaces() { return places; }
}
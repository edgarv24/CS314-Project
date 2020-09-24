package com.tco.requests;

import com.tco.misc.QueryDatabase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RequestFind extends RequestHeader {

  private String match;
  private Integer limit;
  private Integer found;
  private List<Map<String, String>> places;
  private final transient Logger log = LoggerFactory.getLogger(RequestFind.class);
  private QueryDatabase db;

  public RequestFind() {
    this.requestType = "find";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    this.found = 0;
    this.places = db.returnResults();
  }

  public RequestFind(String match, Integer limit) {
    this();
    this.match = match;
    this.limit = limit;
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
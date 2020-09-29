package com.tco.requests;

import com.tco.misc.BadRequestException;
import com.tco.misc.QueryDatabase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class RequestFind extends RequestHeader {

  private String match;
  private Integer limit;
  private Integer found;
  private List<Map<String, String>> places;
  private final transient Logger log = LoggerFactory.getLogger(RequestFind.class);
  // private QueryDatabase db;

  public RequestFind() {
    this.requestType = "find";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    this.found = null;
    this.places = null;
  }

  public RequestFind(String match, Integer limit) {
    this();
    this.match = match;
    this.limit = limit;
    try {
      QueryDatabase db = new QueryDatabase(match, limit);
    } catch (SQLException e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void buildResponse() throws BadRequestException {
    try {
      QueryDatabase db = new QueryDatabase(match, limit);
      this.places = db.getQueryResults();
      this.found = places.size();
    } catch (SQLException e) {
      throw new BadRequestException();
    }
    log.trace("buildResponse -> {}", this);
  }

  public String getMatch() {
    return match;
  }

  public Integer getLimit() {
    return limit;
  }

  public Integer getFound() {
    return found;
  }

  public List<Map<String, String>> getPlaces() {
    return places;
  }
}

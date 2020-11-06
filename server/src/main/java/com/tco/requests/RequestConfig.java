package com.tco.requests;

import com.tco.misc.BadRequestException;
import com.tco.misc.QueryDatabase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.management.Query;
import java.sql.SQLException;
import java.util.*;

public class RequestConfig extends RequestHeader {

  private String serverName;
  private final ArrayList<String> supportedRequests = new ArrayList<>();
  private Map<String,List<String>> filters = new HashMap<>();
  private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);

  public RequestConfig() {
    this.requestType = "config";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
  }

  @Override
  public void buildResponse() throws BadRequestException{
      this.serverName = "t14 The Fourteeners";
      this.supportedRequests.add("config");
      this.supportedRequests.add("distance");
      this.supportedRequests.add("find");
      this.supportedRequests.add("trip");
      log.trace("buildResponse -> {}", this);
      filters.put("type", Arrays.asList("airport", "balloonport", "heliport"));
      try {
        filters.put("where", QueryDatabase.getCountryList());
      }
      catch (SQLException e) {
        throw new BadRequestException();
      }
  }

  public String getServerName() {
    return serverName;
  }

  public ArrayList<String> getSupportedRequests() {
    return supportedRequests;
  }

  public Map<String,List<String>> getFilters() {return filters;}
}

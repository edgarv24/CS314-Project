package com.tco.requests;

import com.tco.misc.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RequestConfig extends RequestHeader {

  private String serverName;
  private final ArrayList<String> supportedRequests = new ArrayList<>();
  private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);

  public RequestConfig() {
    this.requestType = "config";
    this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
  }

  @Override
  public void buildResponse() {
    this.serverName = "t14 The Fourteeners";
    this.supportedRequests.add("config");
    this.supportedRequests.add("distance");
    this.supportedRequests.add("find");
    log.trace("buildResponse -> {}", this);
  }

  public String getServerName() {
    return serverName;
  }
  public ArrayList<String> getSupportedRequests(){return supportedRequests;}
}

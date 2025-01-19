package org.adamkattan.model.callgraph;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CallGraphCall(
        @JsonProperty("source") String source,
        @JsonProperty("target") String target,
        @JsonProperty("isInterserviceLink") boolean isInterserviceCall,
        @JsonProperty("httpMethod") String httpMethod
) {
}

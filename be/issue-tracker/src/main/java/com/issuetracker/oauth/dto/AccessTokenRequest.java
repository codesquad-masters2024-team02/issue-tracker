package com.issuetracker.oauth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@ToString
@Getter
public class AccessTokenRequest {
    private final String client_id;
    private final String client_secret;
    private final String code;
    private final String redirect_uri;
}

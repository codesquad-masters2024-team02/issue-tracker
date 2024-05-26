package com.issuetracker.oauth.service;

import com.issuetracker.oauth.dto.AccessTokenRequest;
import com.issuetracker.oauth.dto.GithubProfile;
import com.issuetracker.oauth.dto.OAuthInfo;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
@RequiredArgsConstructor
public class GithubLoginService {
    private final WebClient webClient;

    @Value("${oauth.github.client.id}")
    private String clientId;
    @Value("${oauth.github.client.secret}")
    private String clientSecret;
    @Value("${oauth.github.redirect.uri}")
    private String redirectUri;

    /**
     * Access token을 요청한다.
     */
    public String getAccessToken(String code) {
        OAuthInfo oAuthInfo = webClient.post()
                .uri("https://github.com/login/oauth/access_token")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(getAccessTokenRequest(code))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(OAuthInfo.class)
                .block(); // 비동기 결과를 동기적으로 대기

        return Objects.requireNonNull(oAuthInfo).getAccessToken();
    }

    /**
     * 사용자 정보를 요청한다.
     */
    public GithubProfile getUserInfo(String accessToken) {
        return webClient.get()
                .uri("https://api.github.com/user")
                .header("Authorization", "token " + accessToken)
                .retrieve()
                .bodyToMono(GithubProfile.class)
                .doOnSuccess(profile -> log.info("Github 로그인한 사용자 정보 가져오기 성공 - {}", profile))
                .doOnError(error -> log.error("Github 로그인한 사용자 정보 가져오기 실패 - {}", error.getMessage()))
                .block();
    }

    private AccessTokenRequest getAccessTokenRequest(String code) {
        return AccessTokenRequest.builder()
                .client_id(clientId)
                .client_secret(clientSecret)
                .code(code)
                .redirect_uri(redirectUri)
                .build();
    }
}

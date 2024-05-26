package com.issuetracker.oauth.controller;

import com.issuetracker.oauth.dto.GithubProfile;
import com.issuetracker.oauth.service.GithubLoginService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/oauth/github")
@RequiredArgsConstructor
public class GithubLoginController {
    private final GithubLoginService githubLoginService;

    @GetMapping("/callback")
    public ResponseEntity<GithubProfile> login(HttpServletResponse response, @RequestParam String code) {
        String accessToken = githubLoginService.getAccessToken(code);
        GithubProfile profile = githubLoginService.getUserInfo(accessToken);

        return ResponseEntity.ok().body(profile);
    }
}

package com.issuetracker.oauth.controller;

import com.issuetracker.file.dto.UploadedFileDto;
import com.issuetracker.file.service.FileService;
import com.issuetracker.file.util.ImgUrlConverter;
import com.issuetracker.member.dto.LoginResponse;
import com.issuetracker.member.service.LoginService;
import com.issuetracker.member.service.MemberService;
import com.issuetracker.member.util.MemberMapper;
import com.issuetracker.oauth.dto.GithubProfile;
import com.issuetracker.oauth.service.GithubLoginService;
import java.io.IOException;
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
    private final MemberService memberService;
    private final LoginService loginService;
    private final FileService fileService;

    @GetMapping("/callback")
    public ResponseEntity<LoginResponse> login(@RequestParam String code) throws IOException {
        String accessToken = githubLoginService.getAccessToken(code);
        GithubProfile profile = githubLoginService.getUserInfo(accessToken);

        // 처음 사용자가 깃허브 로그인을 하는 것이라면 회원가입 로직을 수행한다.
        if (memberService.isNewUser(profile.getId())) {
            UploadedFileDto file = fileService.uploadFile(ImgUrlConverter.toMultipartFile(profile.getImgUrl()));
            memberService.create(MemberMapper.toMember(profile, file.getId()));
        }
        LoginResponse loginResponse = loginService.githubLogin(profile);
        return ResponseEntity.ok().body(loginResponse);
    }
}

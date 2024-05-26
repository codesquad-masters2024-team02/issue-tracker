package com.issuetracker.member.service;

import com.issuetracker.file.service.FileService;
import com.issuetracker.global.exception.UnauthorizedException;
import com.issuetracker.member.dto.LoginResponse;
import com.issuetracker.member.dto.LoginTryDto;
import com.issuetracker.member.dto.SimpleMemberDto;
import com.issuetracker.member.dto.TokenResponse;
import com.issuetracker.member.entity.Member;
import com.issuetracker.member.exception.LoginFailException;
import com.issuetracker.member.repository.MemberRepository;
import com.issuetracker.member.util.JwtUtil;
import com.issuetracker.member.util.MemberMapper;
import com.issuetracker.member.util.TokenStoreManager;
import com.issuetracker.oauth.dto.GithubProfile;
import io.jsonwebtoken.Claims;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginService {
    private final MemberRepository memberRepository;
    private final FileService fileService;
    private final JwtUtil jwtUtil;
    private final TokenStoreManager tokenStoreManager;

    /**
     * 사용자가 입력한 id, password와 대조하여 일치하면 유저정보와 토큰을 반환하고 아니면 예외를 발생시킵니다. 리프레시 토큰을 redis에 저장합니다.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginTryDto loginTryDto) {
        String idValue = loginTryDto.getId();
        String passwordValue = loginTryDto.getPassword();

        Member targetMember = findTargetMember(idValue);
        validatePassword(targetMember, passwordValue);

        SimpleMemberDto memberProfile = getMemberProfile(targetMember);
        TokenResponse tokenResponse = generateToken(idValue);

        log.info("멤버가 로그인하였습니다. {}", idValue);
        return new LoginResponse(memberProfile, tokenResponse);
    }

    /**
     * 리프레시 토큰의 유효성 검증 및 저장소에 존재하는지 확인 후 액세스 토큰을 재발급한다. db에 접근하지 않으므로 transactional은 사용하지 않는다.
     */
    public TokenResponse refreshAccessToken(String authorization) {
        String refreshToken = jwtUtil.extractJwtToken(authorization);
        if (refreshToken == null) {
            throw new UnauthorizedException();
        }
        String memberId = extractMemberId(refreshToken);
        String storeRefreshToken = tokenStoreManager.getRefreshToken(memberId);
        validateTokenEquals(refreshToken, storeRefreshToken);

        String accessToken = jwtUtil.createAccessToken(memberId);

        return new TokenResponse(accessToken, refreshToken);
    }

    /**
     * 사용자의 리프레시 토큰을 저장소에서 제거한다.
     */
    public void logout(String authorization) {
        String refreshToken = jwtUtil.extractJwtToken(authorization);
        if (refreshToken == null) {
            throw new UnauthorizedException();
        }
        String memberId = extractMemberId(refreshToken);
        String storeRefreshToken = tokenStoreManager.getRefreshToken(memberId);

        if (storeRefreshToken != null) { // 리프레시 토큰이 이미 만료되어 저장소에서 제거되었을 경우 해당 로직을 실행하지 않는다.
            validateTokenEquals(refreshToken, storeRefreshToken);
            tokenStoreManager.deleteRefreshToken(memberId);
        }

        log.info("멤버가 로그아웃 하였습니다. {}", memberId);
    }

    /**
     * 사용자의 유저정보와 토큰을 반환하고 리프레시 토큰을 redis에 저장합니다.
     */
    public LoginResponse githubLogin(GithubProfile profile) {
        String idValue = profile.getId();
        Member targetMember = findTargetMember(idValue);

        SimpleMemberDto memberProfile = getMemberProfile(targetMember);
        TokenResponse tokenResponse = generateToken(idValue);

        log.info("멤버가 로그인하였습니다. {}", idValue);
        return new LoginResponse(memberProfile, tokenResponse);
    }

    private Member findTargetMember(String idValue) {
        Optional<Member> optionalMember = memberRepository.findById(idValue);
        if (optionalMember.isEmpty()) {
            throw new LoginFailException();
        }
        return optionalMember.get();
    }

    private void validatePassword(Member targetMember, String passwordValue) {
        if (!targetMember.hasSamePassword(passwordValue)) {
            throw new LoginFailException();
        }
    }

    private String getImgUrl(Member targetMember) {
        if (targetMember.getFileId() == null) {
            return null;
        }
        return fileService.getImgUrlById(targetMember.getFileId());
    }

    private String extractMemberId(String refreshToken) {
        Claims claims = jwtUtil.validateRefreshToken(refreshToken);
        return jwtUtil.extractMemberId(claims);
    }

    private void validateTokenEquals(String refreshToken, String storeRefreshToken) {
        if (!refreshToken.equals(storeRefreshToken)) {
            throw new UnauthorizedException();
        }
    }

    private SimpleMemberDto getMemberProfile(Member targetMember) {
        String imgUrl = getImgUrl(targetMember);
        return MemberMapper.toSimpleMemberDto(targetMember, imgUrl);
    }

    private TokenResponse generateToken(String userId) {
        String accessToken = jwtUtil.createAccessToken(userId);
        String refreshToken = jwtUtil.createRefreshToken(userId);

        tokenStoreManager.saveRefreshToken(userId, refreshToken, JwtUtil.REFRESH_EXPIRATION_TIME);
        return new TokenResponse(accessToken, refreshToken);
    }
}

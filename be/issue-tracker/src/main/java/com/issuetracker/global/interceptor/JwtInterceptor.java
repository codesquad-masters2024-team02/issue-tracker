package com.issuetracker.global.interceptor;

import com.issuetracker.global.exception.UnauthorizedException;
import com.issuetracker.member.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Slf4j
public class JwtInterceptor implements HandlerInterceptor {
    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String authorization = request.getHeader("Authorization");
        String accessToken = jwtUtil.extractJwtToken(authorization);
        String bearer = request.getHeader("Bearer");

        log.info("bearer - {}", bearer);
        log.info("authorization - {}", authorization);
        log.info("accessToken - {}", accessToken);

        if (accessToken == null) {
            throw new UnauthorizedException();
        }
        Claims claims = jwtUtil.validateAccessToken(accessToken);
        request.setAttribute("memberId", jwtUtil.extractMemberId(claims));
        return true;
    }
}

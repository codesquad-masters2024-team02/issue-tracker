package com.issuetracker;

import com.issuetracker.global.interceptor.JwtInterceptor;
import com.issuetracker.member.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@Profile("default") // 테스트시 인터셉터 적용 문제로 프로필 적용
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("https://issue-tracker.site", "http://*:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedOriginPatterns("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor(jwtUtil()))
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/login", "/api/logout", "/api/refresh", "/api/oauth/github/callback",
                        "/api/members"); //로그아웃 및 리프레시는 액세스 토큰이 아닌 리프레시 토큰을 헤더에 담으므로 제외
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}

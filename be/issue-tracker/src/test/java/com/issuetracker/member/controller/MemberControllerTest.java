package com.issuetracker.member.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.issuetracker.member.dto.MemberCreateDto;
import com.issuetracker.member.entity.Member;
import com.issuetracker.member.service.MemberService;
import java.net.URI;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MemberController.class)
class MemberControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemberService memberService;


    @Test
    void createMember() throws Exception {
        MemberCreateDto memberCreateDto = new MemberCreateDto("sangchu", "123", "상추", "sangchu@gmail.com");
        Member member = new Member("sangchu", "123", "상추", "sangchu@gmail.com", null);
        // Mock 서비스 레이어
        when(memberService.create(ArgumentMatchers.any(Member.class))).thenReturn(member);

        // MockMvc 요청 및 응답 검증
        String requestBody = objectMapper.writeValueAsString(memberCreateDto);
        String expectedLocation = String.format("/api/members/%s", member.getId());

        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", expectedLocation))
                .andExpect(jsonPath("$.id").value(member.getId()))
                .andExpect(jsonPath("$.email").value(member.getEmail()))
                .andExpect(jsonPath("$.password").value(member.getPassword()))
                .andExpect(jsonPath("$.nickname").value(member.getNickname()));

        URI locationUri = URI.create(expectedLocation);
        assertThat(locationUri.toString()).isEqualTo(expectedLocation);
    }
}

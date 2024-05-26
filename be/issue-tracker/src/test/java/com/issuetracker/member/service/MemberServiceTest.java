package com.issuetracker.member.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.issuetracker.member.dto.MemberCreateDto;
import com.issuetracker.member.entity.Member;
import com.issuetracker.member.repository.MemberRepository;
import com.issuetracker.member.util.MemberMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("멤버 생성에 성공하면 생성된 멤버 객체를 반환한다.")
    void createMember() {
        // given
        MemberCreateDto memberCreateDto = new MemberCreateDto("sangchu", "123", "상추", "sangchu@gmail.com");
        Member expectedMember = new Member("sangchu", "123", "상추", "sangchu@gmail.com", null);

        when(memberRepository.existsById(anyString())).thenReturn(false);
        when(memberRepository.insert(any(Member.class))).thenReturn(expectedMember);

        // when
        Member actualMember = memberService.create(MemberMapper.toMember(memberCreateDto));

        // then
        assertThat(actualMember).isNotNull()
                .extracting(Member::getId, Member::getPassword, Member::getNickname, Member::getEmail)
                .containsExactly(expectedMember.getId(), expectedMember.getPassword(), expectedMember.getNickname(),
                        expectedMember.getEmail());
    }
}

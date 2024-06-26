package com.issuetracker.member.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.issuetracker.member.entity.Member;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class MemberRepositoryTest {
    @Autowired
    MemberRepository memberRepository;

    @BeforeEach
    void setUp() {
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("새로운 멤버를 저장할 수 있다.")
    void insert() {

        Member member = new Member("sangchu", "123", "상추", "sangchu@gmail.com", null);
        memberRepository.insert(member);
        Member find = memberRepository.findById("sangchu").get();

        assertThat(find).isEqualTo(member);
    }

    @Test
    @DisplayName("기존의 멤버를 업데이트 할 수 있다.")
    void update() {
        Member member = new Member("sangchu", "123", "상추", "sangchu@gmail.com", null);
        memberRepository.insert(member);

        Member updated = new Member("sangchu", "123", "배추", "baechu@gmail.com", null);
        memberRepository.save(updated);

        Member find = memberRepository.findById("sangchu").get();

        assertThat(find).isEqualTo(updated);
    }
}
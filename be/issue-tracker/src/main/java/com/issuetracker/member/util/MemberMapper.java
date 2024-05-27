package com.issuetracker.member.util;

import com.issuetracker.member.dto.MemberCreateDto;
import com.issuetracker.member.dto.SimpleMemberDto;
import com.issuetracker.member.entity.Member;
import com.issuetracker.oauth.dto.GithubProfile;
import java.util.UUID;

public class MemberMapper {

    public static Member toMember(MemberCreateDto memberCreateDto) {
        return new Member(memberCreateDto.getId(), memberCreateDto.getPassword(),
                memberCreateDto.getNickname(), memberCreateDto.getEmail(), null);
    }

    public static Member toMember(GithubProfile profile, Long fileId) {
        String uuidPw = UUID.randomUUID().toString().substring(0, 12); // 깃허브로 가입한 사용자는 비밀번호를 UUID로 설정
        return new Member(profile.getId(), uuidPw, profile.getNickname(), profile.getEmail(), fileId);
    }

    public static SimpleMemberDto toSimpleMemberDto(Member member, String imgUrl) {
        return new SimpleMemberDto(member.getId(), imgUrl);
    }

    public static SimpleMemberDto toDeactivatedMember() {
        return new SimpleMemberDto(null, null);
    }
}

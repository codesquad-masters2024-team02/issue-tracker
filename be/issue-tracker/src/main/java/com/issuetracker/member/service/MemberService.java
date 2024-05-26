package com.issuetracker.member.service;

import com.issuetracker.file.dto.UploadedFileDto;
import com.issuetracker.file.service.FileService;
import com.issuetracker.member.dto.SimpleMemberDto;
import com.issuetracker.member.entity.Member;
import com.issuetracker.member.exception.MemberNotFoundException;
import com.issuetracker.member.repository.MemberRepository;
import com.issuetracker.member.util.MemberMapper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    private final MemberRepository memberRepository;
    private final FileService fileService;

    /**
     * 멤버의 아이디가 중복이 아니라면 새로운 멤버를 생성한다.
     */
    @Transactional
    public Member create(Member member) {
        Member created = memberRepository.insert(member);

        log.info("새로운 유저가 생성되었습니다. {}", created);
        return created;
    }

    /**
     * 회원가입 되어있는 모든 멤버의 간략한 정보를 반환한다.
     */
    @Transactional(readOnly = true)
    public List<SimpleMemberDto> getMembers() {
        List<Member> members = (List<Member>) memberRepository.findAll();
        List<SimpleMemberDto> simpleMembers = toSimpleMemberDtos(members);
        return Collections.unmodifiableList(simpleMembers);
    }

    /**
     * 탈퇴한 사용자인 경우 기본 정보를 반환한다. 존재하는 사용자인 경우 id와 일치하는 멤버를 찾아 간략한 정보를 반환한다.
     */
    @Transactional(readOnly = true)
    public SimpleMemberDto getSimpleMemberById(String id) {
        if (isUserDeactivated(id)) {
            return MemberMapper.toDeactivatedMember();
        }

        Member member = getMemberOrThrow(id);
        String imgUrl = getImgUrl(member);
        return MemberMapper.toSimpleMemberDto(member, imgUrl);
    }

    /**
     * 회원가입되어 있는 사용자인지 확인한다.
     */
    @Transactional(readOnly = true)
    public boolean isNewUser(String id) {
        try {
            getMemberOrThrow(id);
        } catch (MemberNotFoundException e) {
            return true;
        }
        return false;
    }

    private boolean isUserDeactivated(String id) {
        return !StringUtils.hasText(id);
    }

    private Member getMemberOrThrow(String id) {
        return memberRepository.findById(id).orElseThrow(MemberNotFoundException::new);
    }

    private List<SimpleMemberDto> toSimpleMemberDtos(List<Member> members) {
        List<SimpleMemberDto> simpleMemberDtos = new ArrayList<>();
        for (Member member : members) {
            String imgUrl = getImgUrl(member);
            simpleMemberDtos.add(MemberMapper.toSimpleMemberDto(member, imgUrl));
        }
        return simpleMemberDtos;
    }

    private String getImgUrl(Member member) {
        if (member.getFileId() == null) {
            return null;
        }
        UploadedFileDto uploadedFileDto = fileService.showFile(member.getFileId());
        return uploadedFileDto.getUrl();
    }
}

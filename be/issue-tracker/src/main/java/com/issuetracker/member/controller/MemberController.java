package com.issuetracker.member.controller;

import com.issuetracker.member.dto.MemberCreateDto;
import com.issuetracker.member.dto.SimpleMemberDto;
import com.issuetracker.member.entity.Member;
import com.issuetracker.member.service.MemberService;
import com.issuetracker.member.util.MemberMapper;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
@Slf4j
public class MemberController {
    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<SimpleMemberDto>> getMembers() {
        return ResponseEntity.ok(memberService.getMembers());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@Valid @RequestBody MemberCreateDto memberCreateDto) {
        Member member = memberService.create(MemberMapper.toMember(memberCreateDto));
        URI location = URI.create(String.format("/api/members/%s", member.getId()));
        return ResponseEntity.created(location).body(member);
    }
}

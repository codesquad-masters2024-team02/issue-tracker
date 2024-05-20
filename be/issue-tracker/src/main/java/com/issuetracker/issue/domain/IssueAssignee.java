package com.issuetracker.issue.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;

@RequiredArgsConstructor
@Getter
public class IssueAssignee {
    @Id
    private final Long issueId;
    private final String memberId;
}

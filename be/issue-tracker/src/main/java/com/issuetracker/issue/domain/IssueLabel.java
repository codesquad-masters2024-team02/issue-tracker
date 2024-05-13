package com.issuetracker.issue.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;

@RequiredArgsConstructor
@Getter
public class IssueLabel {
    @Id
    private final Long issueId;
    private final Long labelId;
}

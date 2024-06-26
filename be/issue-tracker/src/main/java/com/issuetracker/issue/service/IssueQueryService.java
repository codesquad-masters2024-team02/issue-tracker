package com.issuetracker.issue.service;

import com.issuetracker.issue.dto.IssueCountDto;
import com.issuetracker.issue.entity.Issue;
import com.issuetracker.issue.exception.IssueNotFoundException;
import com.issuetracker.issue.repository.IssueAssigneeRepository;
import com.issuetracker.issue.repository.IssueLabelRepository;
import com.issuetracker.issue.repository.IssueRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueQueryService {
    private final IssueRepository issueRepository;
    private final IssueAssigneeRepository issueAssigneeRepository;
    private final IssueLabelRepository issueLabelRepository;

    /**
     * 열린 이슈의 개수와 닫힌 이슈의 개수를 구한다.
     */
    @Transactional(readOnly = true)
    public IssueCountDto countIssues() {
        long openedIssueCount = issueRepository.countAllByIsClosed(false);
        long closedIssueCount = issueRepository.countAllByIsClosed(true);

        return new IssueCountDto(openedIssueCount, closedIssueCount);
    }

    /**
     * 특정 이슈에 있는 라벨들의 아이디 리스트를 반환한다.
     */
    @Transactional(readOnly = true)
    public List<Long> findLabelIdsByIssueId(Long issueId) {
        return issueLabelRepository.findAllByIssueId(issueId);
    }

    /**
     * 특정 이슈를 담당하는 담당자들의 아이디 리스트를 반환한다.
     */
    @Transactional(readOnly = true)
    public List<String> findAssigneeIdsByIssueId(Long issueId) {
        return issueAssigneeRepository.findAssigneeIdsByIssueId(issueId);
    }

    /**
     * id와 일치하는 이슈가 존재한다면 반환하고 존재하지 않는다면 예외를 발생시킨다.
     */
    @Transactional(readOnly = true)
    public Issue getIssueOrThrow(Long id) {
        return issueRepository.findById(id).orElseThrow(IssueNotFoundException::new);
    }

    /**
     * 매개변수로 받는 마일스톤 id 및 상태와 일치하는 이슈를 찾아 카운팅한다.
     */
    @Transactional(readOnly = true)
    public Long countIssuesByMilestoneIdAndStatus(Long milestoneId, boolean isClosed) {
        return issueRepository.countByMilestoneIdAndIsClosed(milestoneId, isClosed);
    }

    /**
     * 코멘트의 작성자가 이슈의 작성자와 같은지 확인한다.
     */
    @Transactional(readOnly = true)
    public boolean hasSameWriter(Long issueId, String memberId) {
        String writer = issueRepository.findWriterById(issueId);
        if (StringUtils.hasText(writer)) {  // 이슈의 작성자가 탈퇴한 사용자가 아닌 경우만 비교한다.
            return writer.equals(memberId);
        }
        return false;
    }

    /**
     * 특정 이슈에 있는 작성자 아이디를 반환한다.
     */
    @Transactional(readOnly = true)
    public String findAuthorIdByIssueId(Long filterId) {
        return issueRepository.findWriterById(filterId);
    }
}

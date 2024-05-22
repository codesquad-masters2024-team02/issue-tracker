package com.issuetracker.issue.repository;

import com.issuetracker.global.repository.WithInsert;
import com.issuetracker.issue.entity.IssueAssignee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

public interface IssueAssigneeRepository extends CrudRepository<IssueAssignee, Long>, WithInsert<IssueAssignee> {
    Optional<IssueAssignee> findByIssueIdAndMemberId(Long issueId, String memberId);

    @Query("SELECT member_id FROM issue_assignee WHERE issue_id = :issueId")
    List<String> findAssigneeIdsByIssueId(Long issueId);

    @Modifying
    @Query("DELETE FROM issue_assignee WHERE issue_id = :issueId AND member_id = :memberId")
    void deleteById(Long issueId, String memberId);

    @Modifying
    @Query("DELETE FROM issue_assignee WHERE issue_id = :issueId")
    void deleteByIssueId(Long issueId);
}

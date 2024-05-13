package com.issuetracker.issue.repository;

import com.issuetracker.issue.domain.Issue;
import org.springframework.data.repository.CrudRepository;

public interface IssueRepository extends CrudRepository<Issue, Long> {
}
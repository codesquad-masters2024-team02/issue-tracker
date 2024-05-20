package com.issuetracker.issue.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.issuetracker.issue.domain.IssueLabel;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class IssueLabelRepositoryTest {
    @Autowired
    IssueLabelRepository issueLabelRepository;

    @BeforeEach
    void setUp() {
        issueLabelRepository.deleteAll();
    }

    @Test
    void crud() {
        issueLabelRepository.insert(new IssueLabel(1L, 4L));
        issueLabelRepository.insert(new IssueLabel(1L, 7L));

        IssueLabel find = issueLabelRepository.findByIssueIdAndLabelId(1L, 4L).get();

        assertThat(find.getIssueId()).isEqualTo(1L);
        assertThat(find.getLabelId()).isEqualTo(4L);

        List<Long> allByIssueId = issueLabelRepository.findAllByIssueId(1L);

        assertThat(allByIssueId.size()).isEqualTo(2);
        assertThat(allByIssueId.get(0)).isEqualTo(4L);
        assertThat(allByIssueId.get(1)).isEqualTo(7L);

        issueLabelRepository.deleteById(1L, 4L);
        assertThat(issueLabelRepository.count()).isEqualTo(1);
    }
}
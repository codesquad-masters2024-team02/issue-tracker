package com.issuetracker.label.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.issuetracker.label.entity.Label;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class LabelRepositoryTest {
    @Autowired
    LabelRepository labelRepository;

    @BeforeEach
    void setUp() {
        labelRepository.deleteAll();
    }

    @DisplayName("라벨이 데이터베이스에 저장된다.")
    @Test
    void insert() {
        // Given
        Label label = new Label(null, "버그", null, "#000000", "#ff0000");

        // When
        Label savedLabel = labelRepository.save(label);

        // Then
        assertThat(savedLabel.getName()).isEqualTo(label.getName());
        assertThat(savedLabel.getDescription()).isEqualTo(label.getDescription());
        assertThat(savedLabel.getTextColor()).isEqualTo(label.getTextColor());
        assertThat(savedLabel.getBgColor()).isEqualTo(label.getBgColor());

        // 정말로 DB에 삽입되었는지 검증한다.
        Optional<Label> findLabelOptional = labelRepository.findById(savedLabel.getId());
        assertThat(findLabelOptional.isPresent()).isTrue();

        Label findLabel = findLabelOptional.get();
        assertThat(findLabel.getName()).isEqualTo(label.getName());
        assertThat(findLabel.getDescription()).isEqualTo(label.getDescription());
        assertThat(findLabel.getTextColor()).isEqualTo(label.getTextColor());
        assertThat(findLabel.getBgColor()).isEqualTo(label.getBgColor());
    }
}
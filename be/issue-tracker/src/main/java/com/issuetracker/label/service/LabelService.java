package com.issuetracker.label.service;

import com.issuetracker.label.domain.Label;
import com.issuetracker.label.dto.LabelDto;
import com.issuetracker.label.exception.InvalidBgColorException;
import com.issuetracker.label.exception.LabelNotFoundException;
import com.issuetracker.label.repository.LabelRepository;
import com.issuetracker.label.utils.BackgroundColorValidator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabelService {
    private final LabelRepository labelRepository;

    /**
     * 레이블의 전체 리스트를 반환한다.
     */
    @Transactional(readOnly = true)
    public List<Label> getLabels() {
        return (List<Label>) labelRepository.findAll();
    }

    /**
     * 레이블의 배경 색깔을 검증한 후 유효하면 새로운 레이블을 생성하여 DB에 저장 후 반환. 유효하지 않으면 InvalidBgColorException을 발생시킨다.
     */
    @Transactional
    public Label createLabel(LabelDto labelDto) {
        validateBgColor(labelDto);

        Label label = toLabel(labelDto);
        Label savedLabel = labelRepository.save(label);
        log.info("새로운 라벨이 생성되었습니다. - {}", savedLabel);
        return savedLabel;
    }

    /**
     * 레이블의 배경 색깔을 검증한 후 유효하면 수정된 레이블을 DB에 저장 후 반환. 유효하지 않으면 IncorrectUpdateSemanticsDataAccessException을 발생시킨다.
     */
    @Transactional
    public Label modifyLabel(LabelDto labelDto, Long id) {
        validateBgColor(labelDto);

        Label label = toLabel(labelDto);
        label.setId(id);

        Label modifiedlabel = labelRepository.save(label);
        log.info("{} 라벨이 수정되었습니다. - {}", id, modifiedlabel);
        return modifiedlabel;
    }

    /**
     * 레이블이 존재하면 레이블을 삭제한 후 삭제된 id를 반환한다. 레이블이 존재하지 않으면 LabelNotFoundException을 발생시킨다.
     */
    @Transactional
    public Long deleteLabel(Long id) {
        validateLabelExists(id);

        labelRepository.deleteById(id);
        log.info("{} 라벨이 삭제되었습니다.", id);
        return id;
    }

    /**
     * 레이블의 총 개수를 반환한다.
     */
    @Transactional(readOnly = true)
    public long countLabels() {
        List<Label> labels = (List<Label>) labelRepository.findAll();
        return labels.size();
    }

    private void validateLabelExists(Long id) {
        if (!labelRepository.existsById(id)) {
            throw new LabelNotFoundException();
        }
    }

    private void validateBgColor(LabelDto labelDto) {
        String bgColor = labelDto.getBgColor();
        // 배경 색상 코드 유효성을 검증
        if (!BackgroundColorValidator.isHex(bgColor)) {
            throw new InvalidBgColorException();
        }
    }

    private Label toLabel(LabelDto labelDto) {
        return new Label(labelDto.getName(), labelDto.getDescription(), labelDto.getBgColor());
    }
}
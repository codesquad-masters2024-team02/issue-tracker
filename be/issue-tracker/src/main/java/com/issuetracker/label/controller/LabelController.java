package com.issuetracker.label.controller;

import com.issuetracker.label.domain.Label;
import com.issuetracker.label.dto.LabelDto;
import com.issuetracker.label.service.LabelService;
import com.issuetracker.label.utils.HexColorGenerator;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
public class LabelController {
    private final LabelService labelService;

    @PostMapping
    public ResponseEntity<Label> createLabels(@Valid @RequestBody LabelDto labelDto) {
        Label label = labelService.createLabel(labelDto);
        URI location = URI.create(String.format("/api/labels/%s", label.getId()));
        return ResponseEntity.created(location).body(label);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Label> modifyLabel(@Valid @RequestBody LabelDto labelDto, @PathVariable Long id) {
        Label label = labelService.modifyLabel(labelDto, id);
        return ResponseEntity.ok().body(label);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Label> deleteLabel(@PathVariable Long id) {
        labelService.deleteLabel(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bgcolor/refresh")
    public ResponseEntity<String> refreshLabelBackgroundColor() {
        String randomHexColor = HexColorGenerator.generateRandomHexColor();
        return ResponseEntity.ok().body(randomHexColor);
    }
}
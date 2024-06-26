package com.issuetracker.milestone.controller;

import com.issuetracker.milestone.dto.MilestoneCountDto;
import com.issuetracker.milestone.dto.MilestoneCreateDto;
import com.issuetracker.milestone.dto.MilestoneDetailDto;
import com.issuetracker.milestone.dto.MilestoneListDto;
import com.issuetracker.milestone.entity.Milestone;
import com.issuetracker.milestone.service.MilestoneService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {
    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping
    public ResponseEntity<Milestone> createMilestone(@Valid @RequestBody MilestoneCreateDto milestoneCreateDto) {
        Milestone milestone = milestoneService.createMilestone(milestoneCreateDto);

        URI location = URI.create(String.format("/api/milestones/%s", milestone.getId()));
        return ResponseEntity.created(location).body(milestone);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Milestone> updateMilestone(@Valid @RequestBody MilestoneCreateDto milestoneCreateDto,
                                                     @PathVariable Long id) {
        Milestone milestone = milestoneService.modifyMilestone(milestoneCreateDto, id);

        URI location = URI.create(String.format("/api/milestones/%s", milestone.getId()));
        return ResponseEntity.created(location).body(milestone);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMilestone(@PathVariable Long id) {
        milestoneService.deleteMilestone(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<MilestoneCountDto> countMilestones() {
        MilestoneCountDto milestoneCountDto = milestoneService.countMilestones();
        return ResponseEntity.ok().body(milestoneCountDto);
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Void> closeMilestone(@PathVariable Long id) {
        milestoneService.close(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/open")
    public ResponseEntity<Void> openMilestone(@PathVariable Long id) {
        milestoneService.open(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<MilestoneListDto> showMilestoneList(
            @RequestParam(defaultValue = "false") boolean isClosed) {
        MilestoneListDto milestoneListDto = milestoneService.showMilestoneList(isClosed);
        return ResponseEntity.ok(milestoneListDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MilestoneDetailDto> showMilestone(@PathVariable Long id) {
        MilestoneDetailDto milestoneDetailDto = milestoneService.showMilestoneDetail(id);
        return ResponseEntity.ok(milestoneDetailDto);
    }
}

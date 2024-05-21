package com.issuetracker.label.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

@Getter
@ToString
@RequiredArgsConstructor
public class Label {
    @Id
    private final Long id;
    private final String name;
    private final String description;
    @Column("text_color")
    private final String textColor;
    @Column("background_color")
    private final String bgColor;
}
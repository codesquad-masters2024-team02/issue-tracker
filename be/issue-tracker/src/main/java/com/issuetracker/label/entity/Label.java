package com.issuetracker.label.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@ToString
@RequiredArgsConstructor
@Table
public class Label {
    @Id
    private final Long id;
    private final String name;
    private final String description;
    private final String textColor;
    @Column("background_color")
    private final String bgColor;
}
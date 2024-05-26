package com.issuetracker.oauth.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@ToString
public class GithubProfile {
    private String id;
    private String nickname;
    private String email;
    private String imgUrl;

    // 역직렬화할 때 사용
    @JsonSetter("login")
    public void setId(String id) {
        this.id = id;
    }

    // 직렬화할 때 사용
    @JsonGetter("id")
    public String getId() {
        return id;
    }

    @JsonSetter("name")
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    @JsonGetter("nickname")
    public String getNickname() {
        return nickname;
    }

    @JsonGetter("email")
    public String getEmail() {
        return email;
    }

    @JsonGetter("email")
    public void setEmail(String email) {
        this.email = email;
    }

    @JsonSetter("avatar_url")
    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    @JsonGetter("imgUrl")
    public String getImgUrl() {
        return imgUrl;
    }
}

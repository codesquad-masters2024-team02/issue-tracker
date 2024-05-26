package com.issuetracker.oauth.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@ToString
public class GithubProfile {
    private String login;
    private String nickname;
    private String email;
    private String avatarUrl;

    // 역직렬화할 때 사용
    @JsonSetter("login")
    public void setLogin(String login) {
        this.login = login;
    }

    // 직렬화할 때 사용
    @JsonGetter("id")
    public String getLogin() {
        return login;
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
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    @JsonGetter("imgUrl")
    public String getAvatarUrl() {
        return avatarUrl;
    }
}

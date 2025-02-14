package com.example.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id; // MongoDB unique _id
    private String githubId; // GitHub's unique user ID
    private String login; // GitHub username handle
    private String name; // e.g. "John Doe"
    private String email; // public email from GitHub
    private String avatarUrl; // profile picture

    public User() {}
    public User(String githubId, String login, String name, String email, String avatarUrl) {
        this.githubId = githubId;
        this.login = login;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;

    }
    // Getters and setters
    public String getId() {
        return id;
    }

    public String getGithubId() {
        return githubId;
    }

    public void setGithubId(String githubId) {
        this.githubId = githubId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

}

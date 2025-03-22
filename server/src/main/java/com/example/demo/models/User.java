package com.example.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
public class User {

    @Id
    private String id; // MongoDB unique _id
    private String githubId; // GitHub's unique user ID
    private String login; // GitHub username handle
    private String name; // e.g. "John Doe"
    private String email; // public email from GitHub
    private String avatarUrl; // profile picture
    private String leetcodeUsername;
    private String leetcodeAvatarUrl;
    private int snapshotEasyCount;
    private int snapshotMediumCount;
    private int snapshotHardCount;
    private Date snapShotDate;
    private boolean userFlagged;

    public User() {}

    public User(String id, String githubId, String login, String name, String email, String avatarUrl, String leetcodeUsername, String leetcodeAvatarUrl, int snapshotEasyCount, int snapshotMediumCount, int snapshotHardCount, Date snapShotDate, boolean userFlagged) {
        this.id = id;
        this.githubId = githubId;
        this.login = login;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.leetcodeUsername = leetcodeUsername;
        this.leetcodeAvatarUrl = leetcodeAvatarUrl;
        this.snapshotEasyCount = snapshotEasyCount;
        this.snapshotMediumCount = snapshotMediumCount;
        this.snapshotHardCount = snapshotHardCount;
        this.snapShotDate = snapShotDate;
        this.userFlagged = userFlagged;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLeetcodeUsername() {
        return leetcodeUsername;
    }

    public void setLeetcodeUsername(String leetcodeUsername) {
        this.leetcodeUsername = leetcodeUsername;
    }

    public String getLeetcodeAvatarUrl() {
        return leetcodeAvatarUrl;
    }

    public void setLeetcodeAvatarUrl(String leetcodeAvatarUrl) {
        this.leetcodeAvatarUrl = leetcodeAvatarUrl;
    }

    public int getSnapshotEasyCount() {
        return snapshotEasyCount;
    }

    public void setSnapshotEasyCount(int snapshotEasyCount) {
        this.snapshotEasyCount = snapshotEasyCount;
    }

    public int getSnapshotMediumCount() {
        return snapshotMediumCount;
    }

    public void setSnapshotMediumCount(int snapshotMediumCount) {
        this.snapshotMediumCount = snapshotMediumCount;
    }

    public int getSnapshotHardCount() {
        return snapshotHardCount;
    }

    public void setSnapshotHardCount(int snapshotHardCount) {
        this.snapshotHardCount = snapshotHardCount;
    }

    public Date getSnapShotDate() {
        return snapShotDate;
    }

    public void setSnapShotDate(Date snapShotDate) {
        this.snapShotDate = snapShotDate;
    }

    public boolean isUserFlagged() {
        return userFlagged;
    }

    public void setUserFlagged(boolean userFlagged) {
        this.userFlagged = userFlagged;
    }
}

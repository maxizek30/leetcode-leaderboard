package com.example.demo.dto;

import com.example.demo.models.User;

import java.util.Date;

public class UserDTO {
    private String id;
    private String githubId;
    private String login;
    private String name;
    private String email;
    private String avatarUrl;
    private String leetcodeUsername;
    private String leetcodeAvatarUrl;
    private int snapshotEasyCount;
    private int snapshotMediumCount;
    private int snapshotHardCount;
    private Date snapShotDate;
    private boolean userFlagged;

    public UserDTO() {}

    public UserDTO(User user) {
        if (user != null) {
            this.id = user.getId();
            this.githubId = user.getGithubId();
            this.login = user.getLogin();
            this.name = user.getName();
            this.email = user.getEmail();
            this.avatarUrl = user.getAvatarUrl();
            this.leetcodeUsername = user.getLeetcodeUsername();
            this.leetcodeAvatarUrl = user.getLeetcodeAvatarUrl();
            this.snapshotEasyCount = user.getSnapshotEasyCount();
            this.snapshotMediumCount = user.getSnapshotMediumCount();
            this.snapshotHardCount = user.getSnapshotHardCount();
            this.snapShotDate = user.getSnapShotDate();
            this.userFlagged = user.isUserFlagged();
        }
    }
    // Static factory method for easy conversion
    public static UserDTO fromUser(User user) {
        return new UserDTO(user);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGithubId() { return githubId; }
    public void setGithubId(String githubId) { this.githubId = githubId; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getLeetcodeUsername() { return leetcodeUsername; }
    public void setLeetcodeUsername(String leetcodeUsername) { this.leetcodeUsername = leetcodeUsername; }

    public String getLeetcodeAvatarUrl() { return leetcodeAvatarUrl; }
    public void setLeetcodeAvatarUrl(String leetcodeAvatarUrl) { this.leetcodeAvatarUrl = leetcodeAvatarUrl; }

    public int getSnapshotEasyCount() { return snapshotEasyCount; }
    public void setSnapshotEasyCount(int snapshotEasyCount) { this.snapshotEasyCount = snapshotEasyCount; }

    public int getSnapshotMediumCount() { return snapshotMediumCount; }
    public void setSnapshotMediumCount(int snapshotMediumCount) { this.snapshotMediumCount = snapshotMediumCount; }

    public int getSnapshotHardCount() { return snapshotHardCount; }
    public void setSnapshotHardCount(int snapshotHardCount) { this.snapshotHardCount = snapshotHardCount; }

    public Date getSnapShotDate() { return snapShotDate; }
    public void setSnapShotDate(Date snapShotDate) { this.snapShotDate = snapShotDate; }

    public boolean isUserFlagged() { return userFlagged; }
    public void setUserFlagged(boolean userFlagged) { this.userFlagged = userFlagged; }

}

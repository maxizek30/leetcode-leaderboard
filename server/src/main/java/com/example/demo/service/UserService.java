package com.example.demo.service;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Value("${github.client-id}")
    private String clientId;

    @Value("${github.client-secret}")
    private String clientSecret;

    @Value("${leetcode.url}")
    private String leetcodeUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns GitHub profile attributes if the user is authenticated.
     */
    public Map<String, Object> getGithubProfile(OAuth2User principal) {
        return principal != null ? principal.getAttributes() : null;
    }

    /**
     * Fetches the user from DB by GitHub ID.
     */
    public User getCurrentUser(OAuth2User principal) {
        System.out.println("🔍 getCurrentUser called in UserService");

        if (principal == null) {
            System.out.println("❌ Principal is null in getCurrentUser");
            return null;
        }

        try {
            Object idObj = principal.getAttributes().get("id");
            System.out.println("🔍 GitHub ID from principal: " + idObj);

            String githubId = String.valueOf(idObj);
            System.out.println("🔍 Looking for user with GitHub ID: " + githubId);

            Optional<User> userOpt = userRepository.findByGithubId(githubId);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("✅ Found user in DB: " + user.getLogin());
                return user;
            } else {
                System.out.println("❌ No user found in DB with GitHub ID: " + githubId);

                // Check what users exist
                List<User> allUsers = userRepository.findAll();
                System.out.println("🔍 Total users in database: " + allUsers.size());
                for (User u : allUsers) {
                    System.out.println("🔍 Existing user - Login: " + u.getLogin() + ", GitHub ID: " + u.getGithubId());
                }

                return null;
            }

        } catch (Exception e) {
            System.out.println("💥 Error in getCurrentUser: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Fetch all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    /**
     * delete user account from database
     */
    public boolean deleteUser(OAuth2User principal) {


        if (principal == null) return false;

        String githubId = String.valueOf(principal.getAttributes().get("id"));
        Optional<User> userOpt = userRepository.findByGithubId(githubId);

        if(userOpt.isPresent()) {
            User user = userOpt.get();

            String token = user.getAccessToken();
            if(token != null && !token.isEmpty()) {
                revokeGithubToken(token);
            } else {
                System.out.println("Token is null");
            }

            userRepository.delete(user);
            return true;
        }
        return false;
    }
    /**
     * reset all user stats
     */
    public void resetAllUserStats() {
        Date currentDate = new Date();
        //for each user
        List<User> users = userRepository.findAll();
        for (User user : users) {
            //fetch their current stats
            Map<String, Object> newUserInfo = fetchUserStats(user.getLeetcodeUsername());

            //if we cannot fetch a user stat then
            if (newUserInfo.isEmpty()) {
                // we keep the stats the same as it was in the current db and flag the user
                user.setUserFlagged(true);
                user.setSnapShotDate(currentDate);

            } else {
                //update the user
                user.setUserFlagged(false);
                user.setSnapShotDate(currentDate);
                user.setSnapshotEasyCount((int) newUserInfo.get("easySolved"));
                user.setSnapshotMediumCount((int) newUserInfo.get("mediumSolved"));
                user.setSnapshotHardCount((int) newUserInfo.get("hardSolved"));
            }
        }
        userRepository.saveAll(users);
    }
    /**
     * fetch user stat, fetch a user stat for an individual
     */
    public Map<String, Object> fetchUserStats(String leetcodeUsername) {
        String url = leetcodeUrl + leetcodeUsername + "/solved";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        if(response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            return Collections.emptyMap();
        }
    }

    /**
     * Example of simple public service method.
     */
    public String helloPublic() {
        return "Hello from a public endpoint!";
    }
    private void revokeGithubToken(String token) {

        if (clientId == null || clientSecret == null) {
            throw new IllegalStateException("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set.");
        }

        String url = "https://api.github.com/applications/" + clientId + "/grant";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(clientId, clientSecret);

        Map<String, String> body = Map.of("access_token", token);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
            System.out.println("✅ GitHub authorization revoked.");
        } catch (Exception e) {
            System.out.println("⚠️ Failed to revoke GitHub token: " + e.getMessage());
        }

    }

}

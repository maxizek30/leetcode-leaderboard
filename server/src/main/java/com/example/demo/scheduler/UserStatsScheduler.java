package com.example.demo.scheduler;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class UserStatsScheduler {

    private final UserService userService;

    @Autowired
    public UserStatsScheduler(UserService userService) {
        this.userService = userService;
    }

    /**
     * Reset all user stats every Sunday at 6:00 PM (weekly reset)
     * Cron expression: "0 0 18 * * SUN"
     * - 0: seconds (0)
     * - 0: minutes (0)
     * - 18: hours (6 PM in 24-hour format)
     * - *: any day of month
     * - *: any month
     * - SUN: Sunday (0 = Sunday, 1 = Monday, etc.)
     */
    @Scheduled(cron = "0 0 18 * * SUN")
    public void resetAllUserStatsWeekly() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("🕕 [" + timestamp + "] Starting weekly user stats reset (Sunday 6 PM)...");

            userService.resetAllUserStats();

            System.out.println("✅ [" + timestamp + "] Weekly user stats reset completed successfully!");

        } catch (Exception e) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("💥 [" + timestamp + "] Error during weekly stats reset: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Alternative: Reset every Monday at 12:00 AM (start of week)
     */
    /*
    @Scheduled(cron = "0 0 0 * * MON")
    public void resetAllUserStatsWeeklyMonday() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("🕕 [" + timestamp + "] Starting weekly user stats reset (Monday 12 AM)...");

            userService.resetAllUserStats();

            System.out.println("✅ [" + timestamp + "] Weekly user stats reset completed successfully!");

        } catch (Exception e) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("💥 [" + timestamp + "] Error during weekly stats reset: " + e.getMessage());
            e.printStackTrace();
        }
    }
    */

    /**
     * For testing: Reset every 2 minutes
     */
    /*
    @Scheduled(fixedRate = 120000) // Every 2 minutes
    public void resetAllUserStatsForTesting() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("🧪 [" + timestamp + "] TEST: Running user stats reset...");

            userService.resetAllUserStats();

            System.out.println("✅ [" + timestamp + "] TEST: User stats reset completed!");

        } catch (Exception e) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("💥 [" + timestamp + "] TEST: Error during stats reset: " + e.getMessage());
            e.printStackTrace();
        }
    }
    */
}
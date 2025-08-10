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
     * Automatically reset all user stats every day at 6:00 PM
     * Cron expression: "0 0 18 * * *"
     * - 0: seconds (0)
     * - 0: minutes (0)
     * - 18: hours (6 PM in 24-hour format)
     * - *: any day of month
     * - *: any month
     * - *: any day of week
     */
    @Scheduled(cron = "0 0 18 * * *")
    public void resetAllUserStatsDaily() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("🕕 [" + timestamp + "] Starting daily user stats reset...");

            userService.resetAllUserStats();

            System.out.println("✅ [" + timestamp + "] Daily user stats reset completed successfully!");

        } catch (Exception e) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("💥 [" + timestamp + "] Error during daily stats reset: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Optional: Run stats reset every minute for testing purposes
     * Uncomment this method if you want to test the scheduling functionality
     * Remember to comment it out before production!
     */
    /*
    @Scheduled(fixedRate = 60000) // Every 60 seconds
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
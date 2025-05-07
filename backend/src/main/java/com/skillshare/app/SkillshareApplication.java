package com.skillshare.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.skillshare")
@EnableMongoRepositories(basePackages = "com.skillshare.repository")
public class SkillshareApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillshareApplication.class, args);
    }

}
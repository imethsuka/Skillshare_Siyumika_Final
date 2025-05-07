package com.agriapp.agri_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.agriapp")
@EnableMongoRepositories(basePackages = "com.agriapp.repository")
public class AgriAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriAppApplication.class, args);
    }

}

package com.sba301.metro_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
public class MetroSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MetroSystemApplication.class, args);
	}

}

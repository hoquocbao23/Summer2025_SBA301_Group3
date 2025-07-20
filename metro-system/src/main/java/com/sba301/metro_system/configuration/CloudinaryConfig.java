package com.sba301.metro_system.configuration;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUD_NAME}")
    private String cloudName;

    @Value("${API_KEY_CLOUDINARY}")
    private String apiKey;

    @Value("${API_SECRET}")
    private String apiSecret;

    @Bean
    public Cloudinary getCloudinary(){
        Map config = new HashMap();
        config.put("cloud_name", this.cloudName);
        config.put("api_key", this.apiKey);
        config.put("api_secret", this.apiSecret);
        config.put("secure", true);
        return new Cloudinary(config);
    }
}

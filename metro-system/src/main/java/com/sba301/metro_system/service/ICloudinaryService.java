package com.sba301.metro_system.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ICloudinaryService {
    public Map upload(MultipartFile file,String folder);
    public void delete(String id);

    Map update(MultipartFile file,String publicIdExist);
}

package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.service.ICloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/upload")
public class UploadController {
    @Autowired
    ICloudinaryService cloudinaryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map> uploadImage(@RequestParam("image") MultipartFile file, String folder){
        Map data = this.cloudinaryService.upload(file,folder);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @DeleteMapping()
    public ResponseEntity<?> Delete(String id) {
        cloudinaryService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map> update(@RequestParam("image") MultipartFile fileString,String publicIdExist){
        Map data= cloudinaryService.update(fileString,publicIdExist);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

}

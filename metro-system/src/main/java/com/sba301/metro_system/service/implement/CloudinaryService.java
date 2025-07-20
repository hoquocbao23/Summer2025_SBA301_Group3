package com.sba301.metro_system.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sba301.metro_system.service.ICloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService implements ICloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public Map upload(MultipartFile file,String folder) {
        try {
            Map params = Map.of(
                    "folder", folder,
                    "overwrite", true,
                    "invalidate", true
            );

            Map data = this.cloudinary.uploader().upload(file.getBytes(), params);
            return data;
        } catch (IOException io) {
            throw new RuntimeException("Image upload failed: " + io.getMessage());
        }
    }

    @Override
    public void delete(String id) {
        try {
            // Replace "your_public_id" with the actual public ID of the image
            cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
            // Or, to invalidate CDN cache:
            // cloudinary.uploader().destroy("your_public_id", ObjectUtils.asMap("invalidate", true));

            System.out.println("Image deleted successfully.");
        } catch (Exception e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }

    @Override
    public Map update(MultipartFile file,String publicIdExist) {
        try {
            Map params = Map.of(
                    "public_id", publicIdExist,
                    "overwrite", true,
                    "invalidate", true
            );

            Map data = this.cloudinary.uploader().upload(file.getBytes(), params);
            return data;
        } catch (IOException io) {
            throw new RuntimeException("Image upload failed: " + io.getMessage());
        }
    }


}

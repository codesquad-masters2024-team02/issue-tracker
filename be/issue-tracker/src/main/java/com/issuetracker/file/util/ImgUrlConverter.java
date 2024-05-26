package com.issuetracker.file.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import javax.imageio.ImageIO;
import org.springframework.web.multipart.MultipartFile;

public class ImgUrlConverter {
    public static MultipartFile toMultipartFile(String imgUrl) throws MalformedURLException {
        URL url = new URL(imgUrl);
        try (InputStream inputStream = url.openStream(); ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            BufferedImage urlImage = ImageIO.read(inputStream);
            ImageIO.write(urlImage, "jpg", bos);
            byte[] byteArray = bos.toByteArray();
            return new CustomMultipartFile(byteArray, imgUrl);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

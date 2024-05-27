package com.issuetracker.file.util;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

/**
 * byte 배열을 MultipartFile 객체로 변환하기 위한 클래스
 */
public class CustomMultipartFile implements MultipartFile {
    private final Tika tika = new Tika();

    private byte[] input;
    private String filename;

    public CustomMultipartFile(byte[] input, String filename) {
        this.input = input;
        this.filename = filename;
    }

    @Override
    public String getName() {
        return filename;
    }

    @Override
    public String getOriginalFilename() {
        return filename;
    }

    @Override
    public String getContentType() {
        try {
            return tika.detect(getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isEmpty() {
        return input == null || input.length == 0;
    }

    @Override
    public long getSize() {
        return input.length;
    }

    @Override
    public byte[] getBytes() {
        return input;
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(input);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(input);
        }
    }
}

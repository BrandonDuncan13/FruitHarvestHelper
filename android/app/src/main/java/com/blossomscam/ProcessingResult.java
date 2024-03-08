package com.blossomscam;

import android.util.Base64;
import java.io.ByteArrayOutputStream;

// class to store multiple values that will be returned with JNI
public class ProcessingResult {
    public int count;
    public byte[] processedImage;

    // constructor for the return object
    public ProcessingResult(int count, byte[] processedImage) {
        this.count = count;
        this.processedImage = processedImage;
    }

    public String getProcessedImageBase64() {
        return Base64.encodeToString(processedImage, Base64.DEFAULT);
    }
}

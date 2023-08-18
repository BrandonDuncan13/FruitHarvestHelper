package com.blossomscam;

import androidx.annotation.NonNull;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.util.Map;
import java.util.HashMap;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    static {
        System.loadLibrary("processAndroid");
    }

    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    public Bitmap getImageFromCache(String imgPath) {
        File cacheDir = reactContext.getCacheDir();
        File imagesDir = new File(cacheDir, "images");
        File imageFile = new File(imagesDir, imgPath);
        Bitmap originalImage = null;

        if (imageFile.exists()) {
            // The image file exists in the cache directory
            // You can now access the image using the file object
            originalImage = BitmapFactory.decodeFile(imageFile.getAbsolutePath());
            Log.d("ImageProcessingModule", "Image loaded from cache successfully!");
        } else {
            // The image file does not exist in the cache directory
            // Handle the case where the image is not found
            Log.d("ImageProcessingModule", "Failed to find the image in the cache...");
        }

        return originalImage;
    }

    @ReactMethod
    public void processImage(String imgPath, Promise promise) {
        try {
            // retrieve the image to process
            Bitmap orgImage = getImageFromCache(imgPath);

            // send image over to C++ and process the image with OpenCV
            Integer eventId = detectBlossoms(orgImage);
            promise.resolve(eventId);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    private native int detectBlossoms(Bitmap orgImage);
}

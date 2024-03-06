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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Map;
import java.util.HashMap;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    static {
        // Load native libraries
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

    public byte[] getImageFromCache(String imgPath) {
        File cacheDir = reactContext.getCacheDir();
        File imagesDir = new File(cacheDir, "images");
        File imageFile = new File(imagesDir, imgPath);
        byte[] imageBytes = null;

        if (imageFile.exists()) {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
            Bitmap bitmap = BitmapFactory.decodeFile(imageFile.getAbsolutePath(), options);
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
            imageBytes = stream.toByteArray();
            Log.d("ImageProcessingModule", "Image loaded from cache successfully!");
        } else {
            Log.d("ImageProcessingModule", "Failed to find the image in the cache...");
        }

        return imageBytes;
    }

    @ReactMethod
    public void processImage(String imgPath, Promise promise) {
        try {
            // retrieve the image to process
            byte[] orgImage = getImageFromCache(imgPath);

            // send image over to C++ and process the image with OpenCV
            int numBlossoms = detectBlossoms(orgImage);
            promise.resolve(numBlossoms);
        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    public static native int detectBlossoms(byte[] imageBytes);
}

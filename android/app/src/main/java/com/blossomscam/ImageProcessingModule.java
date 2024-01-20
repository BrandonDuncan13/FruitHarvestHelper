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

import org.opencv.android.OpenCVLoader;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;

import java.io.File;
import java.util.Map;
import java.util.HashMap;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    static {
        if (!OpenCVLoader.initDebug()) {
            Log.d("Error", "Unable to load OpenCV");
        } else {
            System.loadLibrary("processAndroid");
            System.loadLibrary("opencv_java3");
        }
    }

    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    public Mat getImageFromCache(String imgPath) {
        File cacheDir = reactContext.getCacheDir();
        File imagesDir = new File(cacheDir, "images");
        File imageFile = new File(imagesDir, imgPath);
        // Read the image file into a Mat object
        Mat imageMat = null;

        if (imageFile.exists()) {
            // The image file exists in the cache directory
            // You can now access the image using the file object
            // Read the image file into a Mat object
            imageMat = Imgcodecs.imread(imageFile.getAbsolutePath());
            Log.d("ImageProcessingModule", "Image loaded from cache successfully!");
        } else {
            // The image file does not exist in the cache directory
            // Handle the case where the image is not found
            Log.d("ImageProcessingModule", "Failed to find the image in the cache...");
        }

        return imageMat;
    }

    @ReactMethod
    public void processImage(String imgPath, Promise promise) {
        try {
            // retrieve the image to process
            Mat orgImage = getImageFromCache(imgPath);

            // send image over to C++ and process the image with OpenCV
            float myFloat = 3.14f;
            int numBlossoms = detectBlossoms(orgImage, myFloat);
            promise.resolve(numBlossoms);
        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    public static int detectBlossoms(Mat mat, float threshold) {

        return detectBlossoms(mat.getNativeObjAddr(), threshold);
    }

    public static native int detectBlossoms(long matAddr, float threshold);
}

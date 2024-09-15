package com.roboticsvision.fruitharvesthelper;

import androidx.annotation.NonNull;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import com.facebook.react.bridge.WritableNativeMap;
import org.json.JSONObject;
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
import java.io.FileOutputStream;
import java.io.IOException;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    // Keep track of number of images processed
    private static int processedImageCounter = -1;

    static {
        // Load native libraries
        System.loadLibrary("processAndroid");
    }

    // Provide the app's context to the class
    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    // Signature for C++ image processing function that detects apple clusters
    public static native Object[] detect(byte[] orgImage);

    @ReactMethod
    public void handleImageProcessing(String imgPath, Promise promise) { // Get image from cache, process it, and return
                                                                         // data to JavaScript (UI)
        try {
            // Retrieve the image to process
            byte[] orgImage = getImageFromCache(imgPath);

            // Send image over to C++ and process the image with OpenCV
            // Java -> C++ -> Java
            Object[] result = detect(orgImage);

            // Save the processed image to the cache & output for debugging
            saveAndLogProcessedImage(result);

            // Send apples detected to front end
            int numApples = ((Integer) result[1]).intValue();
            promise.resolve(numApples);

        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    public byte[] getImageFromCache(String imgPath) { // Find image in cache directory and store it for use
        // Retrieve the cache directory
        File cacheDir = reactContext.getCacheDir();
        File imagesDir = new File(cacheDir, "images");
        File imageFile = new File(imagesDir, imgPath);
        byte[] imageBytes = null;

        // Store the cached original image as a byte array to modify
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

    public void saveAndLogProcessedImage(Object[] result) throws IOException { // Saves image to cache
        // Get the processed image and number of apples
        byte[] processedImage = (byte[]) result[0];
        int numApples = ((Integer) result[1]).intValue();

        // Log the image and apples detected for debugging
        Log.d("ImageProcessingModule", "Processed Image Length: " + processedImage.length);
        Log.d("ImageProcessingModule", "Number of Detected Apples: " + numApples);

        // Indicate an image was processed for naming conventions
        processedImageCounter++;

        // Save the processed image to the cache
        String cacheDirPath = reactContext.getCacheDir().getAbsolutePath();
        String processedImagePath = new File(cacheDirPath, "images/processedImage" + processedImageCounter + ".jpg")
                .getAbsolutePath();
        Log.d("ImageProcessingModule", "Saving processed image to: " + processedImagePath);

        // Create a FileOutputStream with a File object
        File processedImageFile = new File(processedImagePath);
        Log.d("ImageProcessingModule", "File object created for: " + processedImageFile.getAbsolutePath());

        try {
            // Create a FileOutputStream with the File object
            FileOutputStream fos = new FileOutputStream(processedImageFile);
            Log.d("ImageProcessingModule", "FileOutputStream created for: " + processedImageFile.getAbsolutePath());

            // Write the byte array to the FileOutputStream
            fos.write(processedImage);
            Log.d("ImageProcessingModule", "Processed image written to FileOutputStream");

            // Close the FileOutputStream
            fos.close();
            Log.d("ImageProcessingModule", "FileOutputStream closed");
        } catch (IOException e) {
            Log.e("ImageProcessingModule", "Error saving processed image", e);
        }
    }
}

package com.blossomscam;

import com.blossomscam.ImageResult;

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
    private static int processedImageCounter = -1; // static counter for processed image names

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

    // function signature for C++ defined function
    public static native Object[] detectBlossoms(byte[] orgImage);

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
            // Java -> C++ -> Java
            Object[] result = detectBlossoms(orgImage);

            // get the returned results
            byte[] processedImage = (byte[]) result[0];
            int numBlossoms = ((Integer) result[1]).intValue();

            // Log the results
            Log.d("ImageProcessingModule", "Processed Image Length: " + processedImage.length);
            Log.d("ImageProcessingModule", "Number of Detected Blossoms: " + numBlossoms);

            // Increment the counter
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

            promise.resolve(numBlossoms);
        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }
}

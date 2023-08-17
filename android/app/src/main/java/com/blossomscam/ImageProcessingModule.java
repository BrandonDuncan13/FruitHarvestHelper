package com.blossomscam;

import androidx.annotation.NonNull;

import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    static {
        System.loadLibrary("processAndroid");
    }

    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    @ReactMethod
    public void testFunction(Promise promise) {
        try {
            Integer eventId = getInt();
            promise.resolve(eventId);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    private native int getInt();
}

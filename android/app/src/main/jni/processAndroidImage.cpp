//
// Created by Brandon T. Duncan on 8/2/23.
//

#include <jni.h>
#include <string>
#include <iostream>

extern "C" JNIEXPORT jint JNICALL
Java_com_blossomscam_ImageProcessingModule_detectBlossoms(JNIEnv *env, jobject thiz, jobject bitmap)
{
    //jclass bitmapClass = env->GetObjectClass(bitmap);
    //jmethodID testFunctionMethod = env->GetMethodID(bitmapClass, "testFunction", "(Ljava/lang/String;Lcom/facebook/react/bridge/Promise;)V");
    //jintArray imgPixels = (jintArray)env->CallObjectMethod(bitmap, testFunctionMethod, NULL);
    //jint* pixelData = env->GetIntArrayElements(imgPixels, NULL);
    //jint pixelCount = env->GetArrayLength(imgPixels);

    return 696969;
}

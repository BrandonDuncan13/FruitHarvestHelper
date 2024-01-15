#include <jni.h>
#include <stdio.h>
#include <iostream>

extern "C" JNIEXPORT jint JNICALL Java_com_blossomscam_ImageProcessingModule_detectBlossoms(
    JNIEnv *env, jobject obj, jlong param1, jfloat param2)
{
    // Access the values of param1 and param2 and perform the desired operations
    jlong myLong = param1;
    jfloat myFloat = param2;

    // Perform other operations using the parameters

    return 420;
}

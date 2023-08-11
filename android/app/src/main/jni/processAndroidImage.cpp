//
// Created by Brandon T. Duncan on 8/2/23.
//

#include <jni.h>
#include <string>
#include <iostream>

extern "C" JNIEXPORT jint JNICALL
Java_com_blossomscam_MainActivity_getInt(JNIEnv *env, jobject thiz)
{
    return 10;
}

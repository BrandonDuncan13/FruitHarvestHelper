LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

OPENCV_INSTALL_MODULES:=on
OPENCV_LIB_TYPE:=STATIC
include $(LOCAL_PATH)/../../../../opencv/native/jni/OpenCV.mk

LOCAL_MODULE := processAndroid
LOCAL_SRC_FILES := processAndroid.cpp
LOCAL_C_INCLUDES := $(LOCAL_PATH)/include
LOCAL_LDLIBS := -llog -lz -lGLESv2 -lEGL -lm -lc -ldl -lstdc++

include $(BUILD_SHARED_LIBRARY)

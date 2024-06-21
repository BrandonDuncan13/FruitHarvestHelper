LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

OPENCV_INSTALL_MODULES:=on
OPENCV_LIB_TYPE:=STATIC
include $(LOCAL_PATH)/../../../../opencv/native/jni/OpenCV.mk

LOCAL_MODULE := processAndroid
LOCAL_SRC_FILES := processAndroid.cpp
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../../../../opencv/sdk/native/jni/include
LOCAL_LDLIBS := -llog -lz -lGLESv2 -lEGL -lm -lc -ldl -lstdc++

include $(BUILD_SHARED_LIBRARY)

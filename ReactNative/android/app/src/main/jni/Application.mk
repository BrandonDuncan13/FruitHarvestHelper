# ./android/app/src/main/jni/Application.mk
APP_STL := c++_static
APP_CPPFLAGS := -frtti -fexceptions
APP_ABI := all
APP_MODULES := processAndroid
APP_PLATFORM := android-34
APP_CFLAGS += -fvisibility=hidden

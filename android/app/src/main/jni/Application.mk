# ./android/app/src/main/jni/Application.mk
APP_STL := c++_static
APP_CPPFLAGS := -frtti -fexceptions
APP_ABI := all
APP_MODULES := helloworld processAndroid
APP_PLATFORM := android-31
APP_CFLAGS += -fvisibility=hidden -ffunction-sections -fdata-sections

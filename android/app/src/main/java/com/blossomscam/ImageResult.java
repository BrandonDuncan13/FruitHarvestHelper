package com.blossomscam;

// Receives the results of C++ algorithm
public class ImageResult {

    // member vars
    byte[] imageBytes;
    int numBlossoms;

    // constructor
    public ImageResult(byte[] imageBytes, int numBlossoms) {
        this.imageBytes = imageBytes;
        this.numBlossoms = numBlossoms;
    }

    // getters
    public byte[] getImageBytes() {
        return imageBytes;
    }

    public int getNumBlossoms() {
        return numBlossoms;
    }
}

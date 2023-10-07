package com.scoreboard.lib;

public interface PageChangeListener {
    void onPagePrevious();
    void onPageNext();

    void onPageTouch(boolean start);
}

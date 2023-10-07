package com.scoreboard.new_manager;

import android.content.Context;
import android.graphics.PixelFormat;
import android.os.Handler;
import android.util.Log;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.scoreboard.R;
import com.scoreboard.lib.PageChangeListener;
import com.scoreboard.my_component.SquarePageCurlView;

import java.util.ArrayList;


public class CustomView extends LinearLayout{

    private Context context;
    private String bgColor = "#00FF00";
    private String teamName = "-";
    private boolean teamNameVisibility = false;
    private double pageNo = 0;
    private ArrayList<Double> data = new ArrayList<>();
    private SquarePageCurlView squarePageCurlView;

    public CustomView(Context context, String bgColor, String teamName, boolean teamNameVisibility ) {
        super(context);
        this.context = context;
        this.bgColor = bgColor;
        this.teamName = teamName;
        this.teamNameVisibility = teamNameVisibility;
        System.out.println("::bgColor:init:CustomView "+bgColor);

    }

    public void init() {
        System.out.println(":::init:::data.indexOf(0.0):"+data.indexOf(pageNo));
        inflate(this.context, R.layout.multiplecamerastreamlayout, this);
        squarePageCurlView = findViewById(R.id.squarePageCurlView);
        squarePageCurlView.setOtherProperty( context,bgColor,data.indexOf(pageNo), this.data, teamName, teamNameVisibility);

//        squarePageCurlView.setZOrderOnTop(true);
//        squarePageCurlView.getHolder().setFormat(PixelFormat.TRANSLUCENT);


        squarePageCurlView.setListener(new PageChangeListener() {
            @Override
            public void onPagePrevious() {

//                new Handler().postDelayed(new Runnable() {
//                    @Override
//                    public void run() {
                        Log.e("CurlActivity", "onPagePrevious: " + squarePageCurlView.getCurrentIndex());
                        callNativeEvent(squarePageCurlView.getCurrentIndex());
//                    }
//                },10);

            }

            @Override
            public void onPageNext() {

//                new Handler().postDelayed(new Runnable() {
//                    @Override
//                    public void run() {
                        Log.e("CurlActivity", "onPageNext: " + squarePageCurlView.getCurrentIndex());
                        callNativeEvent(squarePageCurlView.getCurrentIndex());
//                    }
//                },10);
            }

            @Override
            public void onPageTouch(boolean start) {
                callNativeEventScroll(start);
            }
        });
    }

    public void setBgColor(String bgColor) {
        this.bgColor = bgColor;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public void setTeamNameVisibility(boolean teamNameVisibility) {
        this.teamNameVisibility = teamNameVisibility;
    }



    public void setData(ArrayList<Double> data) {
        for (Double datum : data) {
            System.out.println("::datum::::;"+datum);
        }
        this.data = data;
        init();
    }

    public void setPage(int pageIndex){
        this.pageNo =data.get(pageIndex);
        System.out.println(":::setPage::::"+pageIndex);
        squarePageCurlView.setCurrentIndex(pageIndex);
//        squarePageCurlView.setCurrentIndexWithAnimation();
    }

    public void updateBG(String bgColor){
        pageNo=data.get(squarePageCurlView.getCurrentIndex());
        this.bgColor = bgColor;
        System.out.println(":::bgColor::::"+bgColor);
        init();
    }

    public void updateTeamName(String teamName){
        pageNo=data.get(squarePageCurlView.getCurrentIndex());
        this.teamName = teamName;
        System.out.println(":::teamName::::"+teamName);
        init();
    }

    public void updateTeamNameVisibility(boolean teamNameVisibility){
        pageNo=data.get(squarePageCurlView.getCurrentIndex());
        this.teamNameVisibility = teamNameVisibility;
        System.out.println(":::teamNameVisibility::::"+teamNameVisibility);
        init();
    }

    //PART 3: Added Receive Event.
    public void callNativeEvent(double pageIndex) {
        WritableMap event = Arguments.createMap();
        event.putString("from", "click");
        event.putDouble("page", pageIndex); //Emmitting an event to Javascript

        //Create a listener where that emits/send the text to JS when action is taken.
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "nativeClick",    //name has to be same as getExportedCustomDirectEventTypeConstants in MyCustomReactViewManager
                event);
    }

    //PART 3: Added Receive Event.
    public void callNativeEventScroll(boolean isStartTouch) {
        WritableMap event = Arguments.createMap();
        event.putString("from", "scroll");
        event.putBoolean("isTouch", isStartTouch); //Emmitting an event to Javascript

        //Create a listener where that emits/send the text to JS when action is taken.
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "nativeClick",    //name has to be same as getExportedCustomDirectEventTypeConstants in MyCustomReactViewManager
                event);
    }
}

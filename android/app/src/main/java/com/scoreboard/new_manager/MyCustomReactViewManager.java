package com.scoreboard.new_manager;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.Map;


public class MyCustomReactViewManager extends SimpleViewManager<CustomView> {


    public static final String REACT_CLASS = "MyCustomReactViewManager";
    private String bgColor = "#00FF00";
    private String teamName = "--";
    private boolean teamNameVisibility = false;
    private ArrayList<Integer> data = new ArrayList<>();


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public CustomView createViewInstance(ThemedReactContext context) {
        return new CustomView(context, this.bgColor, this.teamName, this.teamNameVisibility);
    }

    @ReactProp(name = "bgColor")
    public void setColor(CustomView view, @Nullable String bgColor) {
        view.setBgColor(bgColor);
    }

    @ReactProp(name = "teamName")
    public void setTeamName(CustomView view, @Nullable String teamName) {
        view.setTeamName(teamName);
    }

    @ReactProp(name = "teamNameVisibility")
    public void setTeamNameVisibility(CustomView view, @Nullable boolean teamNameVisibility) {
        view.setTeamNameVisibility(teamNameVisibility);
    }



    @ReactProp(name = "data")
    public void setData(CustomView view, @Nullable ReadableArray sources) {
        ArrayList<Object> _data = sources.toArrayList();
        if (_data != null) {
            System.out.println("::_data:::");
            ArrayList<Double> integers = (ArrayList<Double>) (ArrayList<?>) (_data);
            if (integers != null) {
                System.out.println("::integers:::");
                view.setData(integers);
            }

        }

    }

    @Override
    public void receiveCommand(CustomView view, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);

        if(commandId.equalsIgnoreCase("setPage")){
            System.out.println(":::::commandId:::::"+commandId+"::::"+args.getInt(0));
            view.setPage(args.getInt(0));
        }else   if(commandId.equalsIgnoreCase("updateBg")){
            System.out.println(":::::commandId:::::"+commandId+"::::"+args.getString(0));
            view.updateBG(args.getString(0));
        } else   if(commandId.equalsIgnoreCase("updateTeamName")){
            System.out.println(":::::commandId:::::"+commandId+"::::"+args.getString(0));
            view.updateTeamName(args.getString(0));
        } else   if(commandId.equalsIgnoreCase("updateTeamNameVisibility")){
            System.out.println(":::::commandId:::::"+commandId+"::::"+args.getBoolean(0));
            view.updateTeamNameVisibility(args.getBoolean(0));
        }

    }

    // Required for rn built in EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }


    //PART 3: Added Receive Event.
    @javax.annotation.Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("nativeClick", MapBuilder.of("registrationName", "onClick"))
                .build();
    }
}

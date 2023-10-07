package com.scoreboard.my_component;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import com.reactnativenavigation.options.params.Bool;
import com.scoreboard.R;
import com.scoreboard.lib.CurlPage;
import com.scoreboard.lib.CurlView;

import java.util.ArrayList;

public class SquarePageCurlView extends CurlView {
    Context context;
    String bgColor;

    String teamName;
    boolean teamNameVisibility;
    int currentPage = 0;
    ArrayList<Double> pages = new ArrayList<>();

    public SquarePageCurlView(Context context) {
        super(context);
        this.context = context;
    }

    public SquarePageCurlView(Context context, int currentPage, ArrayList<Double> pages) {
        super(context);
        this.context = context;
        this.currentPage = currentPage;
        this.pages = pages;
    }

    public SquarePageCurlView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public SquarePageCurlView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    /**
     * set attribute and other properties
     */
    public void setOtherProperty(
            Context context,
            String bgColor,
            int currentPage,
            ArrayList<Double> pages,
            String teamName,
            boolean teamNameVisibility) {

        this.context = context;
        this.bgColor = bgColor;
        this.currentPage = currentPage;
        this.pages = pages;
        this.teamName = teamName;
        this.teamNameVisibility = teamNameVisibility;

        setPageProvider(new PageProvider(bgColor, teamName, teamNameVisibility));
        setSizeChangedObserver(new SizeChangedObserver());
        setCurrentIndex(currentPage);
        setAllowLastPageCurl(false);

    }

    /**
     * Bitmap provider.
     */
    private class PageProvider implements CurlView.PageProvider {
        String bgColor;
        String teamName;

        boolean teamNameVisibility;

        public PageProvider(String bgColor, String teamName, boolean teamNameVisibility) {
            this.bgColor = bgColor;
            this.teamName = teamName;
            this.teamNameVisibility = teamNameVisibility;
        }

        @Override
        public int getPageCount() {
            return pages.size();
        }

        private Bitmap loadBitmap(int width, int height, int index) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View v = inflater.inflate(R.layout.page_1, null);
            TextView text = v.findViewById(R.id.tv_Index);
            TextView textTeamName = v.findViewById(R.id.tv_TeamName);

            text.setBackgroundColor(Color.parseColor(bgColor));
            text.setText("" + (Math.round(pages.get(index))));
            textTeamName.setText("" + (teamName));
            textTeamName.setBackgroundColor(Color.parseColor(bgColor));
            if(teamNameVisibility == true) {
                textTeamName.setVisibility(VISIBLE);
            } else {
                textTeamName.setVisibility(INVISIBLE);
            }

            v.measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY));
            v.layout(0, 0, v.getMeasuredWidth(), v.getMeasuredHeight());
            Bitmap b = Bitmap.createBitmap(v.getWidth(), v.getHeight(), Bitmap.Config.ARGB_8888);
            Canvas c = new Canvas(b);
            v.draw(c);
            return b;
        }

        @Override
        public void updatePage(CurlPage page, int width, int height, int index) {
            Log.d("Current Page ", index + "");
            Bitmap front = loadBitmap(width, height, index);
            page.setTexture(front, CurlPage.SIDE_BOTH);
            page.setColor(Color.argb(100, 255, 255, 255), CurlPage.SIDE_BACK);
        }
    }

    /**
     * CurlView size changed observer.
     */
    private class SizeChangedObserver implements CurlView.SizeChangedObserver {
        @Override
        public void onSizeChanged(int w, int h) {
            SquarePageCurlView.this.setViewMode(CurlView.SHOW_ONE_PAGE);
        }
    }
}

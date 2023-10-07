package com.scoreboard.lib;

import android.content.Context;
import android.graphics.PointF;
import android.graphics.RectF;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;

public class CurlView extends GLSurfaceView implements View.OnTouchListener,
        CurlRenderer.Observer {

    // Fahad
    public PointF mFahadStartPos = new PointF();
    public int mFahadLastMotionEvent = MotionEvent.ACTION_CANCEL;
    public int curlStatusValue = CurlRenderer.PAGE_BOTTOM;
    public double mFahadSingleTapDividerPercentage = 1;
    public double mFahadLastPoint = 0;
    public double mFahadSecondLastPoint = 0;
    public double mFahadSlideDifferencePercentage = 15;
    public double mFahadSlideChangePercentage = 0;
    public boolean mFahadLongSlideFirstTime = true;
    public boolean mFahadLongSlideAllowed = true;
    public float mFahadLongSlideAnimationDelay = 0.0005f;

    // Curl state. We are flipping none, left or right page.
    public static final int CURL_TOP = 1;
    public static final int CURL_NONE = 0;
    public static final int CURL_BOTTOM = 2;

    // Constants for mAnimationTargetEvent.
    public static final int SET_CURL_TO_TOP = 1;
    public static final int SET_CURL_TO_BOTTOM = 2;

    // Shows one page at the center of view.
    public static final int SHOW_ONE_PAGE = 1;
    // Shows two pages side by side.
    public static final int SHOW_TWO_PAGES = 2;

    public boolean mAllowLastPageCurl = true;

    public boolean mAnimate = false;
    public long mAnimationDurationTime = 300;
    public PointF mAnimationSource = new PointF();
    public long mAnimationStartTime;
    public PointF mAnimationTarget = new PointF();
    public int mAnimationTargetEvent;

    public PointF mCurlDir = new PointF();

    public PointF mCurlPos = new PointF();
    public int mCurlState = CURL_NONE;
    // Current bitmap index. This is always showed as front of right page.
    public int mCurrentIndex = 0;

    // Start position for dragging.
    public PointF mDragStartPos = new PointF();

    public boolean mEnableTouchPressure = false;
    // Bitmap size. These are updated from renderer once it's initialized.
    public int mPageBitmapHeight = -1;

    public int mPageBitmapWidth = -1;
    // Page meshes. Left and right meshes are 'static' while curl is used to
    // show page flipping.
    public CurlMesh mPageCurl;

    public CurlMesh mPageTop;
    public PageProvider mPageProvider;
    public CurlMesh mPageBottom;

    public PointerPosition mPointerPos = new PointerPosition();

    public CurlRenderer mRenderer;
    public boolean mRenderTopPage = true;
    public SizeChangedObserver mSizeChangedObserver;

    // One page is the default.
    public int mViewMode = SHOW_ONE_PAGE;
    public GestureDetector gestureDetector;
    public PageChangeListener pageChangeListener;
    public TouchListener touchListener;
    public interface TouchListener {
        public void onTouchChangeListener(boolean isTouch);
    }
    /**
     * Default constructor.
     */
    public CurlView(Context ctx) {
        super(ctx);
        init(ctx);
    }

    /**
     * Default constructor.
     */
    public CurlView(Context ctx, AttributeSet attrs) {
        super(ctx, attrs);
        init(ctx);
    }

    /**
     * Default constructor.
     */
    public CurlView(Context ctx, AttributeSet attrs, int defStyle) {
        this(ctx, attrs);
    }

    /**
     * Get current page index. Page indices are zero based values presenting
     * page being shown on right side of the book.
     */
    public int getCurrentIndex() {
        return mCurrentIndex;
    }

    /**
     * Initialize method.
     */
    //    boolean oldIndex = 0;

    private void init(Context ctx) {
        mRenderer = new CurlRenderer(this);
        setRenderer(mRenderer);
        setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        setOnTouchListener(this);

        // Even though left and right pages are static we have to allocate room
        // for curl on them too as we are switching meshes. Another way would be
        // to swap texture ids only.
        mPageTop = new CurlMesh(10);
        mPageBottom = new CurlMesh(10);
        mPageCurl = new CurlMesh(10);
        mPageTop.setFlipTexture(true);
        mPageBottom.setFlipTexture(false);
        gestureDetector = new GestureDetector(ctx, new SingleTapConfirm());
    }

    @Override
    public void onDrawFrame() {
        // We are not animating.
        if (mAnimate == false) {
            return;
        }

        long currentTime = System.currentTimeMillis();

        // If animation is done.
        if (currentTime >= mAnimationStartTime + mAnimationDurationTime) {

            if (mAnimationTargetEvent == SET_CURL_TO_BOTTOM) {
                // Switch curled page to right.
                CurlMesh bottom = mPageCurl;
                CurlMesh curl = mPageBottom;
                bottom.setRect(mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM));
                bottom.setFlipTexture(false);
                bottom.reset();
                mRenderer.removeCurlMesh(curl);
                mPageCurl = curl;
                mPageBottom = bottom;
                // If we were curling left page update current index.
                if (mCurlState == CURL_TOP) {
                    --mCurrentIndex;
                }
            } else if (mAnimationTargetEvent == SET_CURL_TO_TOP) {
                // Switch curled page to left.
                CurlMesh top = mPageCurl;
                CurlMesh curl = mPageTop;
                top.setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
                top.setFlipTexture(true);
                top.reset();
                mRenderer.removeCurlMesh(curl);
                if (!mRenderTopPage) {
                    mRenderer.removeCurlMesh(top);
                }
                mPageCurl = curl;
                mPageTop = top;
                // If we were curling right page update current index.
                if (mCurlState == CURL_BOTTOM) {
                    ++mCurrentIndex;
                }
            }
            mCurlState = CURL_NONE;
            mAnimate = false;
            requestRender();
        } else {
            mPointerPos.mPos.set(mAnimationSource);
            float t = 1f - ((float)(currentTime - mAnimationStartTime) / mAnimationDurationTime);
            t = 1f - (t * t * t * (3 - 2 * t));
            mPointerPos.mPos.x += (mAnimationTarget.x - mAnimationSource.x) * t;
            mPointerPos.mPos.y += (mAnimationTarget.y - mAnimationSource.y) * t;
            updateCurlPos(mPointerPos);
        }
    }

    @Override
    public void onPageSizeChanged(int width, int height) {
        mPageBitmapWidth = width;
        mPageBitmapHeight = height;
        updatePages();
        requestRender();
    }

    @Override
    public void onSizeChanged(int w, int h, int ow, int oh) {
        super.onSizeChanged(w, h, ow, oh);
        requestRender();
        if (mSizeChangedObserver != null) {
            mSizeChangedObserver.onSizeChanged(w, h);
        }
    }

    @Override
    public void onSurfaceCreated() {
        // In case surface is recreated, let page meshes drop allocated texture
        // ids and ask for new ones. There's no need to set textures here as
        // onPageSizeChanged should be called later on.
        mPageTop.resetTexture();
        mPageBottom.resetTexture();
        mPageCurl.resetTexture();
    }

    @Override
    public boolean onTouch(View view, MotionEvent me) {

        if (me.getAction() == MotionEvent.ACTION_CANCEL || me.getAction() == MotionEvent.ACTION_UP) {
            System.out.println(":::::ACTION_UP::::::");
            pageChangeListener.onPageTouch(false);
        } else if (me.getAction() == MotionEvent.ACTION_MOVE) {
            System.out.println(":::::ACTION_MOVE::::::");
            pageChangeListener.onPageTouch(true);
        }
        // No dragging during animation at the moment.
        // TODO: Stop animation on touch event and return to drag mode.
        // We need page rects quite extensively so get them for later use.
        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);
        if (gestureDetector.onTouchEvent(me)) {
            mFahadSingleTap();
            return true;
        } else {
            Log.e("CurlView", "onTouch: Lng tap ");
            if (mAnimate || mPageProvider == null) {
                if (touchListener != null) {
                    touchListener.onTouchChangeListener(false);
                }
                return false;
            }

            // Store pointer position.
            mPointerPos.mPos.set(me.getX(), me.getY());
            mRenderer.translate(mPointerPos.mPos);
            if (mEnableTouchPressure) {
                mPointerPos.mPressure = me.getPressure();
            } else {
                mPointerPos.mPressure = 0.9f;
            }

            switch (me.getAction()) {
                case MotionEvent.ACTION_DOWN: {

                    mFahadStartPos.set(mPointerPos.mPos);
                    mFahadLastMotionEvent = MotionEvent.ACTION_DOWN;

                }
                case MotionEvent.ACTION_MOVE: {


                    Log.e("CurlView", "onTouch: MotionEvent.ACTION_MOVE");

                    mFahadSecondLastPoint = mFahadLastPoint;
                    mFahadLastPoint = mPointerPos.mPos.y;

                    if (mFahadLastMotionEvent == MotionEvent.ACTION_MOVE) {

                        if (mFahadLongSlideFirstTime) {

                            mFahadLongSlideFirstTime = false;

                            mFahadLongSlideAllowed = false;

                            updateCurlPosInitiated(mPointerPos);

                            return true;
                        }

                        if (mFahadLongSlideAllowed) {
                            updateCurlPos(mPointerPos);
                        }
                        return true;
                    }

                    float startPosition = mFahadStartPos.y;
                    float currentPosition = mPointerPos.mPos.y;
                    float startPositionABS = Math.abs(startPosition);
                    float currentPositionABS = Math.abs(currentPosition);
                    mFahadSlideChangePercentage = ((Math.abs(currentPosition - startPosition) / (Math.abs(rightRect.bottom) + Math.abs(rightRect.top))) * 100);

                    if (mFahadSlideChangePercentage > mFahadSlideDifferencePercentage && mFahadLastMotionEvent == MotionEvent.ACTION_DOWN) {

                        if (startPosition > currentPosition) {
                            //Down Slide

                            mFahadLastMotionEvent = MotionEvent.ACTION_MOVE;

                            curlStatusValue = CurlRenderer.PAGE_BOTTOM;
                            mfahadSlideDownFunc();

                        } else if (startPosition <= currentPosition) {
                            //Up Slide

                            mFahadLastMotionEvent = MotionEvent.ACTION_MOVE;

                            curlStatusValue = CurlRenderer.PAGE_TOP;
                            mfahadSlideDownFunc();

                        }
                    }

                    return true;
                    //                    break;
                }
                case MotionEvent.ACTION_CANCEL: {
                    mFahadLastMotionEvent = MotionEvent.ACTION_CANCEL;
                    if (touchListener != null) {
                        touchListener.onTouchChangeListener(true);
                    }
                    Log.e("CurlView", "onTouch: MotionEvent.ACTION_CANCEL");
                }
                case MotionEvent.ACTION_UP: {

                    mFahadLongSlideFirstTime = true;
                    mFahadLastMotionEvent = MotionEvent.ACTION_CANCEL;
                    Log.e("CurlView", "onTouch: MotionEvent.ACTION_UP");

                    if (mFahadSlideChangePercentage < mFahadSlideDifferencePercentage && mFahadSlideChangePercentage > 0) {

                        if (mFahadLastPoint > mFahadSecondLastPoint) {
                            //Down Slide

                            mFahadLastMotionEvent = MotionEvent.ACTION_MOVE;

                            curlStatusValue = CurlRenderer.PAGE_BOTTOM;

                        } else {
                            //Up Slide

                            mFahadLastMotionEvent = MotionEvent.ACTION_MOVE;

                            curlStatusValue = CurlRenderer.PAGE_TOP;

                        }

                        mFahadSingleTapSpecial(curlStatusValue);
                        return true;
                    }

                    //                if (shouldClick)
                    //                    setCurrentIndex(getCurrentIndex() + 1);
                    if (mCurlState == CURL_TOP || mCurlState == CURL_BOTTOM) {
                        // Animation source is the point from where animation starts.
                        // Also it's handled in a way we actually simulate touch events
                        // meaning the output is exactly the same as if user drags the
                        // page to other side. While not producing the best looking
                        // result (which is easier done by altering curl position and/or
                        // direction directly), this is done in a hope it made code a
                        // bit more readable and easier to maintain.
                        mAnimationSource.set(mPointerPos.mPos);
                        mAnimationStartTime = System.currentTimeMillis();

                        // Given the explanation, here we decide whether to simulate
                        // drag to left or right end.

                        float half = (rightRect.top + rightRect.bottom) / 2;

                        if ((mViewMode == SHOW_ONE_PAGE && mPointerPos.mPos.y > half) ||
                                mViewMode == SHOW_TWO_PAGES &&
                                        mPointerPos.mPos.y > rightRect.top) {
                            // On right side target is always right page's right border.
                            mAnimationTarget.set(mDragStartPos);
                            mAnimationTarget.y = mRenderer
                                    .getPageRect(CurlRenderer.PAGE_BOTTOM).bottom;
                            mAnimationTargetEvent = SET_CURL_TO_BOTTOM;
                            if (pageChangeListener != null) {
                                //                                new Handler().postDelayed(new Runnable() {
                                //                                    @Override
                                //                                    public void run() {
                                pageChangeListener.onPagePrevious();
                                //                                    }
                                //                                },10);
                            }
                        } else {
                            // On left side target depends on visible pages.
                            mAnimationTarget.set(mDragStartPos);
                            if (mCurlState == CURL_BOTTOM || mViewMode == SHOW_TWO_PAGES) {
                                mAnimationTarget.y = leftRect.top;
                            } else {
                                mAnimationTarget.y = rightRect.top;
                            }
                            mAnimationTargetEvent = SET_CURL_TO_TOP;
                            if (pageChangeListener != null) {
                                //                                new Handler().postDelayed(new Runnable() {
                                //                                    @Override
                                //                                    public void run() {
                                pageChangeListener.onPageNext();
                                //                                    }
                                //                                },10);
                            }
                        }
                        mAnimate = true;
                        requestRender();
                    }
                    if (touchListener != null) {
                        touchListener.onTouchChangeListener(false);
                    }
                    return true;
                }
            }
            return false;
        }
    }

    private void updateCurlPosInitiated(PointerPosition fpointerPos) {

        float originOfyValue = fpointerPos.mPos.y;
        PointerPosition pointerPos = fpointerPos;

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);

        float f;
        if (mCurlState == CURL_BOTTOM) {
            f = rightRect.bottom;
            while (f > originOfyValue) {

                pointerPos.mPos.y = f;

                updateCurlPos(pointerPos);
                f = f - mFahadLongSlideAnimationDelay;

            }
        } else {
            f = leftRect.top;
            while (f < originOfyValue) {

                pointerPos.mPos.y = f;

                updateCurlPos(pointerPos);
                f = f + mFahadLongSlideAnimationDelay;

            }
        }

        mFahadLongSlideAllowed = true;
    }

    public boolean mfahadDownFunc() {

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);
        if (touchListener != null) {
            touchListener.onTouchChangeListener(true);
        }
        Log.e("CurlView", "onTouch: MotionEvent.ACTION_DOWN");
        //                shouldClick = true;
        // Once we receive pointer down event its position is mapped to
        // right or left edge of page and that'll be the position from where
        // user is holding the paper to make curl happen.

        PointF mBottomPointer = mPointerPos.mPos;
        mBottomPointer.y = rightRect.bottom;
        mAnimationSource.set(mBottomPointer);

        mDragStartPos.set(mBottomPointer);

        // First we make sure it's not over or below page. Pages are
        // supposed to be same height so it really doesn't matter do we use
        // left or right one.
        if (mDragStartPos.x > rightRect.left) {
            mDragStartPos.x = rightRect.left;
        } else if (mDragStartPos.x < rightRect.right) {
            mDragStartPos.x = rightRect.right;
        }

        // Then we have to make decisions for the user whether curl is going
        // to happen from left or right, and on which page.
        if (mViewMode == SHOW_TWO_PAGES) {
            // If we have an open book and pointer is on the left from right
            // page we'll mark drag position to left edge of left page.
            // Additionally checking mCurrentIndex is higher than zero tells
            // us there is a visible page at all.
            if (mDragStartPos.y < rightRect.top && mCurrentIndex > 0) {
                mDragStartPos.y = leftRect.top;

                startCurl(CURL_TOP);
                return true;
            }
            // Otherwise check pointer is on right page's side.
            else if (mDragStartPos.y >= rightRect.top &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }
                startCurl(CURL_BOTTOM);
                return true;
            }
        } else if (mViewMode == SHOW_ONE_PAGE) {
            double tapDividerfY = (rightRect.top) * mFahadSingleTapDividerPercentage;

            if (mDragStartPos.y < tapDividerfY && mCurrentIndex > 0) {
                mDragStartPos.y = rightRect.top;
                startCurl(CURL_TOP);
                return true;
            } else if (mDragStartPos.y >= tapDividerfY &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }
                startCurl(CURL_BOTTOM);
                return true;
            }
        }
        // If we have are in curl state, let this case clause flow through
        // to next one. We have pointer position and drag position defined
        // and this will create first render request given these points.
        if (mCurlState == CURL_NONE) {
            return false;
        }

        return true;
    }
    public boolean mfahadDownSpecialFunc(int specialPageMode) {

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);
        if (touchListener != null) {
            touchListener.onTouchChangeListener(true);
        }
        Log.e("CurlView", "onTouch: MotionEvent.ACTION_DOWN");
        //                shouldClick = true;
        // Once we receive pointer down event its position is mapped to
        // right or left edge of page and that'll be the position from where
        // user is holding the paper to make curl happen.

        PointF mBottomPointer = mPointerPos.mPos;
        mBottomPointer.y = rightRect.bottom;
        mAnimationSource.set(mDragStartPos);

        mDragStartPos.set(mBottomPointer);

        // First we make sure it's not over or below page. Pages are
        // supposed to be same height so it really doesn't matter do we use
        // left or right one.
        if (mDragStartPos.x > rightRect.left) {
            mDragStartPos.x = rightRect.left;
        } else if (mDragStartPos.x < rightRect.right) {
            mDragStartPos.x = rightRect.right;
        }

        // Then we have to make decisions for the user whether curl is going
        // to happen from left or right, and on which page.
        if (mViewMode == SHOW_TWO_PAGES) {
            // If we have an open book and pointer is on the left from right
            // page we'll mark drag position to left edge of left page.
            // Additionally checking mCurrentIndex is higher than zero tells
            // us there is a visible page at all.
            if (mDragStartPos.y < rightRect.top && mCurrentIndex > 0) {
                mDragStartPos.y = leftRect.top;

                startCurl(CURL_TOP);
                return true;
            }
            // Otherwise check pointer is on right page's side.
            else if (mDragStartPos.y >= rightRect.top &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }

                startCurl(CURL_BOTTOM);
                return true;
            }
        } else if (mViewMode == SHOW_ONE_PAGE) {

            if (specialPageMode == CurlRenderer.PAGE_BOTTOM && mCurrentIndex > 0) {
                mDragStartPos.y = rightRect.top;
                startCurl(CURL_TOP);
                return true;
            } else if (specialPageMode == CurlRenderer.PAGE_TOP &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }
                startCurl(CURL_BOTTOM);
                return true;
            }
        }
        // If we have are in curl state, let this case clause flow through
        // to next one. We have pointer position and drag position defined
        // and this will create first render request given these points.
        if (mCurlState == CURL_NONE) {
            return false;
        }

        return true;
    }

    public boolean mFahadSingleTap() {

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);

        mfahadDownFunc();
        // single tap

        Log.e("CurlView", "onTouch: single tap ");
        if (touchListener != null) {
            touchListener.onTouchChangeListener(false);
        }

        if (mCurlState == CURL_TOP || mCurlState == CURL_BOTTOM) {
            // Animation source is the point from where animation starts.
            // Also it's handled in a way we actually simulate touch events
            // meaning the output is exactly the same as if user drags the
            // page to other side. While not producing the best looking
            // result (which is easier done by altering curl position and/or
            // direction directly), this is done in a hope it made code a
            // bit more readable and easier to maintain.
            //            PointF mBottomPointer = mPointerPos.mPos;
            //            mBottomPointer.y = rightRect.bottom;
            //            mAnimationSource.set(mBottomPointer);

            mAnimationSource.set(mDragStartPos);

            mAnimationStartTime = System.currentTimeMillis();

            // Given the explanation, here we decide whether to simulate
            // drag to left or right end.
            if (mViewMode == SHOW_ONE_PAGE && mPointerPos.mPos.y > ((rightRect.top) * mFahadSingleTapDividerPercentage) ||
                    mViewMode == SHOW_TWO_PAGES &&
                            mPointerPos.mPos.y > rightRect.top) {

                mAnimationTarget.set(mDragStartPos);
                if (mCurlState == CURL_BOTTOM || mViewMode == SHOW_TWO_PAGES) {
                    mAnimationTarget.y = leftRect.top;
                } else {
                    mAnimationTarget.y = rightRect.top;
                }
                mAnimationTargetEvent = SET_CURL_TO_TOP;
                if (pageChangeListener != null) {
                    //                    new Handler().postDelayed(new Runnable() {
                    //                        @Override
                    //                        public void run() {
                    pageChangeListener.onPageNext();
                    //                        }
                    //                    },10);
                }
            } else {
                // On left side target depends on visible pages. top
          /*mAnimationTarget.set(mDragStartPos);
          if (mCurlState == CURL_BOTTOM || mViewMode == SHOW_TWO_PAGES) {
              mAnimationTarget.y = leftRect.top;
          } else {
              mAnimationTarget.y = rightRect.top;
          }
          mAnimationTargetEvent = SET_CURL_TO_TOP;*/
                // On right side target is always right page's right border. bottom
                mAnimationTarget.set(mDragStartPos);
                mAnimationTarget.y = mRenderer
                        .getPageRect(CurlRenderer.PAGE_BOTTOM).bottom;
                mAnimationTargetEvent = SET_CURL_TO_BOTTOM;
                if (pageChangeListener != null) {
                    //                    new Handler().postDelayed(new Runnable() {
                    //                        @Override
                    //                        public void run() {
                    pageChangeListener.onPagePrevious();
                    //                        }
                    //                    },10);
                }
            }
            mAnimate = true;
            requestRender();
        }
        return true;
    }

    public boolean mFahadSingleTapSpecial(int specialPageMode) {

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);

        mfahadDownSpecialFunc(specialPageMode);
        // single tap

        Log.e("CurlView", "onTouch: single tap ");
        if (touchListener != null) {
            touchListener.onTouchChangeListener(false);
        }

        if (mCurlState == CURL_TOP || mCurlState == CURL_BOTTOM) {
            // Animation source is the point from where animation starts.
            // Also it's handled in a way we actually simulate touch events
            // meaning the output is exactly the same as if user drags the
            // page to other side. While not producing the best looking
            // result (which is easier done by altering curl position and/or
            // direction directly), this is done in a hope it made code a
            // bit more readable and easier to maintain.

            mAnimationSource.set(mDragStartPos);

            mAnimationStartTime = System.currentTimeMillis();

            // Given the explanation, here we decide whether to simulate
            // drag to left or right end.
            if (mViewMode == SHOW_ONE_PAGE && specialPageMode == CurlRenderer.PAGE_TOP ||
                    mViewMode == SHOW_TWO_PAGES &&
                            mPointerPos.mPos.y > rightRect.top) {

                mAnimationTarget.set(mDragStartPos);
                if (mCurlState == CURL_BOTTOM || mViewMode == SHOW_TWO_PAGES) {
                    mAnimationTarget.y = leftRect.top;
                } else {
                    mAnimationTarget.y = rightRect.top;
                }
                mAnimationTargetEvent = SET_CURL_TO_TOP;
                if (pageChangeListener != null) {
                    //                    new Handler().postDelayed(new Runnable() {
                    //                        @Override
                    //                        public void run() {
                    pageChangeListener.onPageNext();
                    //                        }
                    //                    },10);
                }
            } else {
                // On left side target depends on visible pages. top
          /*mAnimationTarget.set(mDragStartPos);
          if (mCurlState == CURL_BOTTOM || mViewMode == SHOW_TWO_PAGES) {
              mAnimationTarget.y = leftRect.top;
          } else {
              mAnimationTarget.y = rightRect.top;
          }
          mAnimationTargetEvent = SET_CURL_TO_TOP;*/
                // On right side target is always right page's right border. bottom
                mAnimationTarget.set(mDragStartPos);
                mAnimationTarget.y = mRenderer
                        .getPageRect(CurlRenderer.PAGE_BOTTOM).bottom;
                mAnimationTargetEvent = SET_CURL_TO_BOTTOM;
                if (pageChangeListener != null) {
                    //                    new Handler().postDelayed(new Runnable() {
                    //                        @Override
                    //                        public void run() {
                    pageChangeListener.onPagePrevious();
                    //                        }
                    //                    },10);
                }
            }
            mAnimate = true;
            requestRender();
        }
        return true;
    }

    public boolean mfahadSlideDownFunc() {

        RectF rightRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
        RectF leftRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);
        if (touchListener != null) {
            touchListener.onTouchChangeListener(true);
        }
        Log.e("CurlView", "onTouch: MotionEvent.ACTION_DOWN");
        //                shouldClick = true;
        // Once we receive pointer down event its position is mapped to
        // right or left edge of page and that'll be the position from where
        // user is holding the paper to make curl happen.

        PointF mBottomPointer = mPointerPos.mPos;
        mBottomPointer.y = rightRect.bottom;
        mAnimationSource.set(mDragStartPos);

        mDragStartPos.set(mBottomPointer);

        // First we make sure it's not over or below page. Pages are
        // supposed to be same height so it really doesn't matter do we use
        // left or right one.
        if (mDragStartPos.x > rightRect.left) {
            mDragStartPos.x = rightRect.left;
        } else if (mDragStartPos.x < rightRect.right) {
            mDragStartPos.x = rightRect.right;
        }

        // Then we have to make decisions for the user whether curl is going
        // to happen from left or right, and on which page.
        if (mViewMode == SHOW_TWO_PAGES) {
            // If we have an open book and pointer is on the left from right
            // page we'll mark drag position to left edge of left page.
            // Additionally checking mCurrentIndex is higher than zero tells
            // us there is a visible page at all.
            if (curlStatusValue == CurlRenderer.PAGE_TOP && mCurrentIndex > 0) {
                mDragStartPos.y = leftRect.top;
                startCurl(CURL_TOP);
                return true;
            }
            // Otherwise check pointer is on right page's side.
            else if (curlStatusValue == CurlRenderer.PAGE_BOTTOM &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }
                startCurl(CURL_BOTTOM);
                return true;
            }
        } else if (mViewMode == SHOW_ONE_PAGE) {
            //            float halfY = (rightRect.bottom + rightRect.top) / 2;
            if (curlStatusValue == CurlRenderer.PAGE_TOP && mCurrentIndex > 0) {
                mDragStartPos.y = rightRect.top;
                startCurl(CURL_TOP);
                return true;
            } else if (curlStatusValue == CurlRenderer.PAGE_BOTTOM &&
                    mCurrentIndex < mPageProvider.getPageCount()) {
                mDragStartPos.y = rightRect.bottom;
                if (!mAllowLastPageCurl &&
                        mCurrentIndex >= mPageProvider.getPageCount() - 1) {
                    return false;
                }
                startCurl(CURL_BOTTOM);
                return true;
            }
        }
        // If we have are in curl state, let this case clause flow through
        // to next one. We have pointer position and drag position defined
        // and this will create first render request given these points.
        if (mCurlState == CURL_NONE) {
            return false;
        }

        return true;
    }

    /**
     * Allow the last page to curl.
     */
    public void setAllowLastPageCurl(boolean allowLastPageCurl) {
        mAllowLastPageCurl = allowLastPageCurl;
    }

    /**
     * Sets background color - or OpenGL clear color to be more precise. Color
     * is a 32bit value consisting of 0xAARRGGBB and is extracted using
     * android.graphics.Color eventually.
     */
    @Override
    public void setBackgroundColor(int color) {
        //        mRenderer.setBackgroundColor(color);
        //        requestRender();
    }

    /**
     * Sets mPageCurl curl position.
     */
    private void setCurlPos(PointF curlPos, PointF curlDir, double radius) {

        // First reposition curl so that page doesn't 'rip off' from book.
        if (mCurlState == CURL_BOTTOM ||
                (mCurlState == CURL_TOP && mViewMode == SHOW_ONE_PAGE)) {
            RectF pageRect = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM);
            if (curlPos.y >= pageRect.bottom) {
                mPageCurl.reset();
                requestRender();
                return;
            }
            if (curlPos.y < pageRect.top) {
                curlPos.y = pageRect.top;
            }
            if (curlDir.x != 0) {
                float diffY = curlPos.y - pageRect.top;
                float leftX = curlPos.x + (diffY * curlDir.y / curlDir.x);
                if (curlDir.x < 0 && leftX < pageRect.left) {
                    curlDir.y = curlPos.x - pageRect.left;
                    curlDir.x = pageRect.top - curlPos.y;
                } else if (curlDir.x > 0 && leftX > pageRect.right) {
                    curlDir.y = pageRect.right - curlPos.x;
                    curlDir.x = curlPos.y - pageRect.top;
                }
            }
        } else if (mCurlState == CURL_TOP) {
            RectF pageRect = mRenderer.getPageRect(CurlRenderer.PAGE_TOP);
            if (curlPos.y <= pageRect.top) {
                mPageCurl.reset();
                requestRender();
                return;
            }
            if (curlPos.y > pageRect.bottom) {
                curlPos.y = pageRect.bottom;
            }
            if (curlDir.x != 0) {
                float diffY = curlPos.y - pageRect.bottom;
                float rightX = curlPos.x + (diffY * curlDir.y / curlDir.y);
                if (curlDir.x < 0 && rightX < pageRect.left) {
                    curlDir.y = pageRect.left - curlPos.x;
                    curlDir.x = curlPos.y - pageRect.bottom;
                } else if (curlDir.x > 0 && rightX > pageRect.right) {
                    curlDir.y = curlPos.x - pageRect.right;
                    curlDir.x = pageRect.bottom - curlPos.y;
                }
            }
        }

        // Finally normalize direction vector and do rendering.
        double dist = Math.sqrt(curlDir.y * curlDir.y + curlDir.x * curlDir.x);
        if (dist != 0) {
            curlDir.y /= dist;
            curlDir.x /= dist;
            mPageCurl.curl(curlPos, curlDir, radius);
        } else {
            mPageCurl.reset();
        }

        requestRender();
    }

    /**
     * Set current page index. Page indices are zero based values presenting
     * page being shown on right side of the book. E.g if you set value to 4;
     * right side front facing bitmap will be with index 4, back facing 5 and
     * for left side page index 3 is front facing, and index 2 back facing (once
     * page is on left side it's flipped over).
     * <p>
     * Current index is rounded to closest value divisible with 2.
     */

    public void setCurrentIndexWithAnimation() {
        mCurlState = CURL_TOP;
        mAnimationSource.set(mPointerPos.mPos);
        mAnimationStartTime = System.currentTimeMillis();

        mAnimationTarget.set(mDragStartPos);
        mAnimationTarget.y = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM).bottom;
        mAnimationTargetEvent = SET_CURL_TO_BOTTOM;

        mAnimate = true;
        //        updatePages();
        requestRender();
    }

    public void setCurrentIndex(int index) {
        if (mPageProvider == null || index < 0) {
            mCurrentIndex = 0;
        } else {
            if (mAllowLastPageCurl) {
                mCurrentIndex = Math.min(index, mPageProvider.getPageCount());
            } else {
                mCurrentIndex = Math.min(index,
                        mPageProvider.getPageCount() - 1);
            }
        }
        updatePages();
        requestRender();
    }

    /**
     * If set to true, touch event pressure information is used to adjust curl
     * radius. The more you press, the flatter the curl becomes. This is
     * somewhat experimental and results may vary significantly between devices.
     * On emulator pressure information seems to be flat 1.0f which is maximum
     * value and therefore not very much of use.
     */
    public void setEnableTouchPressure(boolean enableTouchPressure) {
        mEnableTouchPressure = enableTouchPressure;
    }

    /**
     * Set margins (or padding). Note: margins are proportional. Meaning a value
     * of .1f will produce a 10% margin.
     */
    public void setMargins(float left, float top, float right, float bottom) {
        mRenderer.setMargins(left, top, right, bottom);
    }

    /**
     * Update/set page provider.
     */
    public void setPageProvider(PageProvider pageProvider) {
        mPageProvider = pageProvider;
        mCurrentIndex = 0;
        updatePages();
        requestRender();
    }

    /**
     * Setter for whether left side page is rendered. This is useful mostly for
     * situations where right (main) page is aligned to left side of screen and
     * left page is not visible anyway.
     */
    public void setRenderTopPage(boolean renderTopPage) {
        mRenderTopPage = renderTopPage;
    }

    /**
     * Sets SizeChangedObserver for this View. Call back method is called from
     * this View's onSizeChanged method.
     */
    public void setSizeChangedObserver(SizeChangedObserver observer) {
        mSizeChangedObserver = observer;
    }

    /**
     * Sets view mode. Value can be either SHOW_ONE_PAGE or SHOW_TWO_PAGES. In
     * former case right page is made size of display, and in latter case two
     * pages are laid on visible area.
     */
    public void setViewMode(int viewMode) {
        switch (viewMode) {
            case SHOW_ONE_PAGE:
                mViewMode = viewMode;
                mPageTop.setFlipTexture(true);
                mRenderer.setViewMode(CurlRenderer.SHOW_ONE_PAGE);
                break;
            case SHOW_TWO_PAGES:
                mViewMode = viewMode;
                mPageTop.setFlipTexture(false);
                mRenderer.setViewMode(CurlRenderer.SHOW_TWO_PAGES);
                break;
        }
    }

    /**
     * Switches meshes and loads new bitmaps if available. Updated to support 2
     * pages in landscape
     */
    private void startCurl(int page) {


        switch (page) {

            // Once right side page is curled, first right page is assigned into
            // curled page. And if there are more bitmaps available new bitmap is
            // loaded into right side mesh.
            case CURL_BOTTOM: {
                // Remove meshes from renderer.
                mRenderer.removeCurlMesh(mPageTop);
                mRenderer.removeCurlMesh(mPageBottom);
                mRenderer.removeCurlMesh(mPageCurl);

                // We are curling right page.
                CurlMesh curl = mPageBottom;
                mPageBottom = mPageCurl;
                mPageCurl = curl;

                if (mCurrentIndex > 0) {
                    mPageTop.setFlipTexture(true);
                    mPageTop
                            .setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
                    mPageTop.reset();
                    if (mRenderTopPage) {
                        mRenderer.addCurlMesh(mPageTop);
                    }
                }
                if (mCurrentIndex < mPageProvider.getPageCount() - 1) {
                    updatePage(mPageBottom.getTexturePage(), mCurrentIndex + 1);
                    mPageBottom.setRect(mRenderer
                            .getPageRect(CurlRenderer.PAGE_BOTTOM));
                    mPageBottom.setFlipTexture(false);
                    mPageBottom.reset();
                    mRenderer.addCurlMesh(mPageBottom);
                }

                // Add curled page to renderer.
                mPageCurl.setRect(mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM));
                mPageCurl.setFlipTexture(false);
                mPageCurl.reset();
                mRenderer.addCurlMesh(mPageCurl);

                mCurlState = CURL_BOTTOM;

                break;
            }

            // On left side curl, left page is assigned to curled page. And if
            // there are more bitmaps available before currentIndex, new bitmap
            // is loaded into left page.
            case CURL_TOP: {
                // Remove meshes from renderer.
                mRenderer.removeCurlMesh(mPageTop);
                mRenderer.removeCurlMesh(mPageBottom);
                mRenderer.removeCurlMesh(mPageCurl);

                // We are curling left page.
                CurlMesh curl = mPageTop;
                mPageTop = mPageCurl;
                mPageCurl = curl;

                if (mCurrentIndex > 1) {
                    updatePage(mPageTop.getTexturePage(), mCurrentIndex - 2);
                    mPageTop.setFlipTexture(true);
                    mPageTop
                            .setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
                    mPageTop.reset();
                    if (mRenderTopPage) {
                        mRenderer.addCurlMesh(mPageTop);
                    }
                }

                // If there is something to show on right page add it to renderer.
                if (mCurrentIndex < mPageProvider.getPageCount()) {
                    mPageBottom.setFlipTexture(false);
                    mPageBottom.setRect(mRenderer
                            .getPageRect(CurlRenderer.PAGE_BOTTOM));
                    mPageBottom.reset();
                    mRenderer.addCurlMesh(mPageBottom);
                }

                // How dragging previous page happens depends on view mode.
                if (mViewMode == SHOW_ONE_PAGE ||
                        (mCurlState == CURL_TOP && mViewMode == SHOW_TWO_PAGES)) {
                    mPageCurl.setRect(mRenderer
                            .getPageRect(CurlRenderer.PAGE_BOTTOM));
                    mPageCurl.setFlipTexture(false);
                } else {
                    mPageCurl
                            .setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
                    mPageCurl.setFlipTexture(true);
                }
                mPageCurl.reset();
                mRenderer.addCurlMesh(mPageCurl);

                mCurlState = CURL_TOP;
                break;
            }

        }
    }

    /**
     * Updates curl position.
     */
    private void updateCurlPos(PointerPosition pointerPos) {

        // Default curl radius.
        double radius = mRenderer.getPageRect(CURL_BOTTOM).height() / 3;
        // TODO: This is not an optimal solution. Based on feedback received so
        // far; pressure is not very accurate, it may be better not to map
        // coefficient to range [0f, 1f] but something like [.2f, 1f] instead.
        // Leaving it as is until get my hands on a real device. On emulator
        // this doesn't work anyway.
        radius *= Math.max(1f - pointerPos.mPressure, 0f);
        // NOTE: Here we set pointerPos to mCurlPos. It might be a bit confusing
        // later to see e.g "mCurlPos.x - mDragStartPos.x" used. But it's
        // actually pointerPos we are doing calculations against. Why? Simply to
        // optimize code a bit with the cost of making it unreadable. Otherwise
        // we had to this in both of the next if-else branches.
        mCurlPos.set(pointerPos.mPos);

        // If curl happens on right page, or on left page on two page mode,
        // we'll calculate curl position from pointerPos.
        if (mCurlState == CURL_BOTTOM ||
                (mCurlState == CURL_TOP && mViewMode == SHOW_TWO_PAGES)) {

            mCurlDir.y = mCurlPos.y - mDragStartPos.y;
            mCurlDir.x = mCurlPos.x - mDragStartPos.x;
            float dist = (float) Math.sqrt(mCurlDir.y * mCurlDir.y + mCurlDir.x *
                    mCurlDir.x);

            // Adjust curl radius so that if page is dragged far enough on
            // opposite side, radius gets closer to zero.
            float pageHeight = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM)
                    .height();
            double curlLen = radius * Math.PI;
            if (dist > (pageHeight * 2) - curlLen) {
                curlLen = Math.max((pageHeight * 2) - dist, 0f);
                radius = curlLen / Math.PI;
            }

            // Actual curl position calculation.
            if (dist >= curlLen) {
                double translate = (dist - curlLen) / 2;
                if (mViewMode == SHOW_TWO_PAGES) {
                    mCurlPos.y -= mCurlDir.y * translate / dist;
                } else {
                    float pageLeftY = mRenderer
                            .getPageRect(CurlRenderer.PAGE_BOTTOM).top;
                    radius = Math.max(Math.min(mCurlPos.y - pageLeftY, radius),
                            0f);
                }
                mCurlPos.x -= mCurlDir.x * translate / dist;
            } else {
                double angle = Math.PI * Math.sqrt(dist / curlLen);
                double translate = radius * Math.sin(angle);
                mCurlPos.y += mCurlDir.y * translate / dist;
                mCurlPos.x += mCurlDir.x * translate / dist;
            }
        }
        // Otherwise we'll let curl follow pointer position.
        else if (mCurlState == CURL_TOP) {

            // Adjust radius regarding how close to page edge we are.
            float pageLeftY = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM).top;
            radius = Math.max(Math.min(mCurlPos.y - pageLeftY, radius), 0f);

            float pageRightY = mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM).bottom;
            mCurlPos.y -= Math.min(pageRightY - mCurlPos.y, radius);
            mCurlDir.y = mCurlPos.y + mDragStartPos.y;
            mCurlDir.x = mCurlPos.x - mDragStartPos.x;
        }

        setCurlPos(mCurlPos, mCurlDir, radius);
    }

    /**
     * Updates given CurlPage via PageProvider for page located at index.
     */
    private void updatePage(CurlPage page, int index) {
        // First reset page to initial state.
        page.reset();
        // Ask page provider to fill it up with bitmaps and colors.
        mPageProvider.updatePage(page, mPageBitmapWidth, mPageBitmapHeight,
                index);
    }

    /**
     * Updates bitmaps for page meshes.
     */
    private void updatePages() {
        if (mPageProvider == null || mPageBitmapWidth <= 0 || mPageBitmapHeight <= 0) {
            return;
        }

        // Remove meshes from renderer.
        mRenderer.removeCurlMesh(mPageTop);
        mRenderer.removeCurlMesh(mPageBottom);
        mRenderer.removeCurlMesh(mPageCurl);

        int topIdx = mCurrentIndex - 1;
        int bottomIdx = mCurrentIndex;
        int curlIdx = -1;
        if (mCurlState == CURL_TOP) {
            curlIdx = topIdx;
            --topIdx;
        } else if (mCurlState == CURL_BOTTOM) {
            curlIdx = bottomIdx;
            ++bottomIdx;
        }

        if (bottomIdx >= 0 && bottomIdx < mPageProvider.getPageCount()) {
            updatePage(mPageBottom.getTexturePage(), bottomIdx);
            mPageBottom.setFlipTexture(false);
            mPageBottom.setRect(mRenderer.getPageRect(CurlRenderer.PAGE_BOTTOM));
            mPageBottom.reset();
            mRenderer.addCurlMesh(mPageBottom);
        }
        if (topIdx >= 0 && topIdx < mPageProvider.getPageCount()) {
            updatePage(mPageTop.getTexturePage(), topIdx);
            mPageTop.setFlipTexture(true);
            mPageTop.setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
            mPageTop.reset();
            if (mRenderTopPage) {
                mRenderer.addCurlMesh(mPageTop);
            }
        }
        if (curlIdx >= 0 && curlIdx < mPageProvider.getPageCount()) {
            updatePage(mPageCurl.getTexturePage(), curlIdx);

            if (mCurlState == CURL_BOTTOM) {
                mPageCurl.setFlipTexture(true);
                mPageCurl.setRect(mRenderer
                        .getPageRect(CurlRenderer.PAGE_BOTTOM));
            } else {
                mPageCurl.setFlipTexture(false);
                mPageCurl
                        .setRect(mRenderer.getPageRect(CurlRenderer.PAGE_TOP));
            }

            mPageCurl.reset();
            mRenderer.addCurlMesh(mPageCurl);
        }
    }

    /**
     * Provider for feeding 'book' with bitmaps which are used for rendering
     * pages.
     */
    public interface PageProvider {

        /**
         * Return number of pages available.
         */
        public int getPageCount();

        /**
         * Called once new bitmaps/textures are needed. Width and height are in
         * pixels telling the size it will be drawn on screen and following them
         * ensures that aspect ratio remains. But it's possible to return bitmap
         * of any size though. You should use provided CurlPage for storing page
         * information for requested page number.<br/>
         * <br/>
         * Index is a number between 0 and getBitmapCount() - 1.
         */
        public void updatePage(CurlPage page, int width, int height, int index);
    }

    /**
     * Simple holder for pointer position.
     */
    private class PointerPosition {
        PointF mPos = new PointF();
        float mPressure;
    }

    /**
     * Observer interface for handling CurlView size changes.
     */
    public interface SizeChangedObserver {

        /**
         * Called once CurlView size changes.
         */
        public void onSizeChanged(int width, int height);
    }

    private class SingleTapConfirm extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onSingleTapUp(MotionEvent e) {
            return true;
        }
    }

    public void setListener(PageChangeListener pageChangeListener) {
        this.pageChangeListener = pageChangeListener;
    }

    public void setTouchListener(TouchListener touchListener) {
        this.touchListener = touchListener;
    }
}
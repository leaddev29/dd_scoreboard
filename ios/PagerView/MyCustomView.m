#import <React/RCTViewManager.h>
//#import "Scoreboard-Swift.h"
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>
#import "Scoreboard-Swift.h"


@interface RCTMyCustomViewManager : RCTViewManager
@end

@implementation RCTMyCustomViewManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(status, BOOL)
RCT_EXPORT_VIEW_PROPERTY(data, NSArray<NSNumber *>)
RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(teamName, NSString)
RCT_EXPORT_VIEW_PROPERTY(teamNameVisibility, BOOL)

RCT_EXPORT_VIEW_PROPERTY(onClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPageScroll, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(setPage:(nonnull NSNumber*) reactTag index: (nonnull NSNumber*) index ) {
  NSLog(@"Native Method Has been Successfully Called.");
//  NSLog(index)
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        MyCustomView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[MyCustomView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
    [view goToPage:index.integerValue];
    }];

}

RCT_EXPORT_METHOD(updateTeamName:(nonnull NSNumber*) reactTag index: (nonnull NSString*) index ) {
  NSLog(@"Native Method Has been Successfully Called.");
//  NSLog(index)
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        MyCustomView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[MyCustomView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
    [view updateTeamName:index];
    }];

}

RCT_EXPORT_METHOD(updateBg:(nonnull NSNumber*) reactTag index: (nonnull NSString*) index ) {
  NSLog(@"Native Method Has been Successfully Called.");
//  NSLog(index)
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        MyCustomView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[MyCustomView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
    [view updateBg:index];
    }];

}



RCT_EXPORT_METHOD(updateTeamNameVisibility:(nonnull NSNumber*) reactTag index: (BOOL) index ) {
  NSLog(@"Native Method Has been Successfully Called.");
//  NSLog(index)
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        MyCustomView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[MyCustomView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
    [view updateTeamNameVisibility:index];
    }];

}

- (UIView *)view
{
  return [[MyCustomView alloc] init];
}

@end


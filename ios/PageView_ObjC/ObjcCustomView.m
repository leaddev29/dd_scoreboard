//
//  ObjcCustomView.m
//  Scoreboard
//
//  Created by Saqib Rehman on 10/12/22.
//

#import "ObjcCustomView.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

@interface ObjcCustomView() <UIPageViewControllerDelegate,UIPageViewControllerDataSource>
  
@end

@implementation ObjcCustomView



RCT_EXPORT_MODULE()
- (UIView *) view{
  return [[UIView alloc] init];
}


- (nullable UIViewController *)pageViewController:(nonnull UIPageViewController *)pageViewController viewControllerAfterViewController:(nonnull UIViewController *)viewController {
  return [[UIViewController alloc] init];
}

- (nullable UIViewController *)pageViewController:(nonnull UIPageViewController *)pageViewController viewControllerBeforeViewController:(nonnull UIViewController *)viewController {
  return [[UIViewController alloc] init];
}

@end

//
//  RCTCircleManager.m
//  mobile
//
//  Created by arlendp on 2017/11/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTCircleManager.h"
#import "CircleView.h"
#import "DFIDemoChordViewController.h"

@implementation RCTCircleManager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  CircleView *innerView = [[CircleView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  return view;
  //return circle;
}

//RCT_EXPORT_VIEW_PROPERTY(bounds, CGPoint);

- (void)haha {
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  NSLog(@"fasfasf");
  
}

@end

//
//  RCTCocos2Manager.m
//  platform
//
//  Created by arlendp on 2017/11/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTCocos2Manager.h"
#import "CocosDemoViewTwo.h"
#import "CocosInstanceManager.h"

@implementation RCTCocos2Manager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  CocosDemoViewTwo *innerView = [[CocosDemoViewTwo alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  
  CocosInstanceManager *sharedInstance = [CocosInstanceManager sharedManager];
  sharedInstance.index = 2;
  sharedInstance.demo2 = innerView;
  return view;
  //return circle;
}

@end

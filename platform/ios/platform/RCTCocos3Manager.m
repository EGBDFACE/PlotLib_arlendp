//
//  RCTCocos3Manager.m
//  platform
//
//  Created by arlendp on 2017/11/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTCocos3Manager.h"
#import "CocosDemoViewThree.h"
#import "CocosInstanceManager.h"

@implementation RCTCocos3Manager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  CocosDemoViewThree *innerView = [[CocosDemoViewThree alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  
  CocosInstanceManager *sharedInstance = [CocosInstanceManager sharedManager];
  sharedInstance.index = 3;
  sharedInstance.demo3 = innerView;
  return view;
  //return circle;
}

@end

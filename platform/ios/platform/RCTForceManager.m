//
//  RCTForceManager.m
//  platform
//
//  Created by arlendp on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTForceManager.h"
#import "ForceView.h"

@implementation RCTForceManager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  ForceView *innerView = [[ForceView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  return view;
  //return circle;
}

@end

//
//  RCTPackManager.m
//  platform
//
//  Created by arlendp on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTPackManager.h"
#import "PackView.h"

@implementation RCTPackManager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  PackView *innerView = [[PackView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  return view;
  //return circle;
}

@end

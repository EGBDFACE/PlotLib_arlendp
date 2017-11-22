//
//  RCTCocosManager.m
//  platform
//
//  Created by arlendp on 2017/11/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTCocosManager.h"
#import "CocosTestView.h"
#import "CocosInstanceManager.h"

@implementation RCTCocosManager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (UIView *)view
{
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
  
  CocosTestView *innerView = [[CocosTestView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [view addSubview:innerView];
  
  CocosInstanceManager *sharedInstance = [CocosInstanceManager sharedManager];
  sharedInstance.index = 1;
  sharedInstance.demo1 = innerView;
  
  return view;
  //return circle;
}

@end

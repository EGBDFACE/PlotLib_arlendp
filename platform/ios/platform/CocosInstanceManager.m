//
//  CocosInstanceManager.m
//  platform
//
//  Created by arlendp on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CocosInstanceManager.h"

@interface CocosInstanceManager()

@end


@implementation CocosInstanceManager

+ (instancetype)sharedManager {
  static dispatch_once_t onceToken;
  static CocosInstanceManager *sharedInstance;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  
  return sharedInstance;
}

- (void)cancel {
  switch (_index) {
    case 1:
      NSLog(@"cancel 1");
      [_demo1 closeView];
      break;
    case 2:
      NSLog(@"cancel 2");
      [_demo2 closeView];
      break;
    case 3:
      NSLog(@"cancel 3");
      [_demo3 closeView];
      break;
    default:
      break;
  }
}

@end

//
//  CocosManager.m
//  platform
//
//  Created by arlendp on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CocosControlManager.h"
#import "CocosInstanceManager.h"

@implementation CocosControlManager

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(cancel){
  //RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
  NSLog(@"js call cocos control");
  [[CocosInstanceManager sharedManager] cancel];
}
@end

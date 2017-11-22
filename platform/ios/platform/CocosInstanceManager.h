//
//  CocosInstanceManager.h
//  platform
//
//  Created by arlendp on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CocosTestView.h"
#import "CocosDemoViewTwo.h"
#import "CocosDemoViewThree.h"

@interface CocosInstanceManager : NSObject

@property (nonatomic, assign) NSInteger index;
@property (nonatomic, strong) CocosTestView *demo1;
@property (nonatomic, strong) CocosDemoViewTwo *demo2;
@property (nonatomic, strong) CocosDemoViewThree *demo3;

+ (instancetype)sharedManager;
- (void)cancel;

@end

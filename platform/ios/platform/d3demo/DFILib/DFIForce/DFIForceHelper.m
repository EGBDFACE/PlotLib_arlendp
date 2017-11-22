//
//  DFIForceHelper.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceHelper.h"

@implementation DFIForceHelper

+ (float)constant:(float)x {
    return x;
}

+ (float)jiggle {
    return ((float)rand() / RAND_MAX - 0.5f) * 1e-6;
}

@end

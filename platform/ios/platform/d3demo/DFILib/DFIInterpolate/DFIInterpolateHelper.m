//
//  DFIInterpolateHelper.m
//  DFI
//
//  Created by vanney on 2017/5/6.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIInterpolateHelper.h"

@implementation DFIInterpolateHelper

+ (DFIInterpolateHelperBlockType)basis:(NSArray *)values {
    int n = values.count - 1;
    return ^CGFloat(CGFloat t) {
        int i;
        if (t <= 0) {
            t = 0;
            i = 0;
        } else if (t >= 1) {
            t = 1;
            i = n - 1;
        } else {
            i = floor(t * n);
        }

        CGFloat v1 = [[values objectAtIndex:i] floatValue];
        CGFloat v2 = [[values objectAtIndex:i + 1] floatValue];
        CGFloat v0 = i > 0 ? [[values objectAtIndex:i - 1] floatValue] : 2 * v2 - v1;
        CGFloat v3 = i < n - 1 ? [[values objectAtIndex:i + 2] floatValue] : 2 * v2 - v1;

        return [self basisWithT1:(t - i / n) * n v0:v0 v1:v1 v2:v2 andV3:v3];
    };
}

+ (DFIInterpolateHelperBlockType)basisClosed:(NSArray *)values {
    int n = values.count;
    return ^CGFloat(CGFloat t) {
        int x = (int)t;
        t = t - x;
        int i = floor((t < 0 ? ++t : t) * n);
        CGFloat v0 = [[values objectAtIndex:(i + n - 1) % n] floatValue];
        CGFloat v1 = [[values objectAtIndex:i % n] floatValue];
        CGFloat v2 = [[values objectAtIndex:(i + 1) % n] floatValue];
        CGFloat v3 = [[values objectAtIndex:(i + 2) % n] floatValue];

        return [self basisWithT1:(t - i / n) * n v0:v0 v1:v1 v2:v2 andV3:v3];
    };
}

+ (CGFloat)basisWithT1:(CGFloat)t1 v0:(CGFloat)v0 v1:(CGFloat)v1 v2:(CGFloat)v2 andV3:(CGFloat)v3 {
    CGFloat t2 = t1 * t1;
    CGFloat t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}


@end

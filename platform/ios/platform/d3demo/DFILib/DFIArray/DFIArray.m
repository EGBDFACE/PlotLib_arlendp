//
//  DFIArray.m
//  DFI
//
//  Created by vanney on 2017/5/2.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIArray.h"
#import <UIKit/UIKit.h>

@implementation DFIArray

+ (NSMutableArray *)rangeWithStart:(int)start stop:(int)stop andStep:(int)step {
    int i = -1;
    int n = MAX(0, ceil((stop - start) / (CGFloat)step));
    if (isnan(n)) {
        n = 0;
    }
    NSLog(@"vanney code log : DFIArray n is %d", n);
    NSMutableArray *range = [NSMutableArray arrayWithCapacity:n];
    while (++i < n) {
        [range addObject:@(start + i * step)];
    }

    return range;
}


@end

//
//  DFIShapeOffsetBase.m
//  DFI
//
//  Created by vanney on 2017/4/27.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeOffsetBase.h"
#import "DFIShapeStack.h"

@implementation DFIShapeOffsetBase

+ (void)dealWithSeries:(NSArray *)series andOrder:(NSArray *)order withType:(DFIShapeOffsetType)type {
    switch (type) {
        default:
            [self p_dealNoneWithSeries:series andOrder:order];
            break;
    }
}

+ (void)p_dealNoneWithSeries:(NSArray *)series andOrder:(NSArray *)order {
    int n = series.count;
    if (n <= 1) {
        return;
    }

    DFIShapeStackRecord *s0, *s1;
    s1 = [series objectAtIndex:[[order firstObject] intValue]];
    int m = s1.data.count;

    for (int i = 1; i < n; ++i) {
        s0 = s1;
        s1 = [series objectAtIndex:[[order objectAtIndex:i] intValue]];
        for (int j = 0; j < m; ++j) {
            NSMutableArray *s0Data = [s0.data objectAtIndex:j];
            NSMutableArray *s1data = [s1.data objectAtIndex:j];
            CGFloat s00 = [[s0Data firstObject] floatValue];
            CGFloat s01 = [[s0Data objectAtIndex:1] floatValue];
            CGFloat s10 = [[s1data firstObject] floatValue];
            CGFloat s11 = [[s1data objectAtIndex:1] floatValue];

            if (isnan(s01)) {
                s01 = s00;
                [s0Data replaceObjectAtIndex:1 withObject:@(s01)];
            }

            s10 = s01;
            s11 += s10;
            [s1data replaceObjectAtIndex:0 withObject:@(s10)];
            [s1data replaceObjectAtIndex:1 withObject:@(s11)];
        }
    }
}

@end

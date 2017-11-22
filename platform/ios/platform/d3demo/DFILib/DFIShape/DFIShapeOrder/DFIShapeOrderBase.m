//
//  DFIShapeOrderBase.m
//  DFI
//
//  Created by vanney on 2017/4/26.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeOrderBase.h"

@implementation DFIShapeOrderBase

+ (id)dealWithSeries:(NSArray *)series andType:(DFIShapeOrderType)type {
    id result;
    switch (type) {
        default:
            result = [self p_dealTypeNoneWithSeries:series];
    }

    return result;
}

+ (id)p_dealTypeNoneWithSeries:(NSArray *)series {
    int sLength = series.count;
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:sLength];
    for (int i = 0; i < sLength; ++i) {
        [result addObject:@(0)];
    }
    while (--sLength > 0) {
        [result replaceObjectAtIndex:sLength withObject:@(sLength)];
    }

    return result;
}

@end

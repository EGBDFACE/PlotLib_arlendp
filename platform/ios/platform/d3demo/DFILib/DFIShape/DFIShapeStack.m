//
//  DFIShapeStack.m
//  DFI
//
//  Created by vanney on 2017/4/26.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeStack.h"

@implementation DFIShapeStackRecord
@end

@interface DFIShapeStack()
@end

@implementation DFIShapeStack

- (instancetype)init {
    if (self = [super init]) {
        _value = ^CGFloat(NSDictionary *data, NSString *key) {
            id curData = [data objectForKey:key];
            if (curData) {
                return [curData floatValue];
            } else {
                return 0.0f;
            }
        };
        _keys = ^NSArray *(id data) {
            return [NSArray new];
        };
        _stackOrderType = DFIShapeOrderTypeNone;
        _stackOffsetType = DFIShapeOffsetTypeNone;
    }

    return self;
}

- (NSArray *)loadStackWithData:(NSArray *)data {
    NSArray *keys = _keys(data);
    int m = data.count, n = keys.count;
    NSMutableArray *stacks = [NSMutableArray arrayWithCapacity:n];

    for (int i = 0; i < n; ++i) {
        NSString *curKey = [keys objectAtIndex:i];
        NSMutableArray *curStackData = [NSMutableArray arrayWithCapacity:m];

        for (int j = 0; j < m; ++j) {
            NSDictionary *curData = [data objectAtIndex:j];
            CGFloat curValue = _value(curData, curKey);
            NSMutableArray *curRecord = [@[@(0), @(curValue)] mutableCopy];
            if (_xKey) {
                [curRecord addObject:[curData objectForKey:_xKey]];
            }
            [curStackData addObject:curRecord];
        }

        DFIShapeStackRecord *curStack = [[DFIShapeStackRecord alloc] init];
        curStack.data = curStackData;
        curStack.key = curKey;
        [stacks addObject:curStack];
    }

    // order
    NSArray *orders = [DFIShapeOrderBase dealWithSeries:stacks andType:_stackOrderType];
    for (int k = 0; k < n; ++k) {
        int destIndex = [[orders objectAtIndex:k] intValue];
        DFIShapeStackRecord *curStack = [stacks objectAtIndex:destIndex];
        curStack.index = k;
    }

    // offset
    [DFIShapeOffsetBase dealWithSeries:stacks andOrder:orders withType:_stackOffsetType];

    return stacks;
}


@end

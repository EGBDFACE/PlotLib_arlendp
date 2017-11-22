//
//  DFIShapePie.m
//  DFI
//
//  Created by vanney on 2017/3/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapePie.h"
#import "DFIDSVParseResult.h"

@interface DFIShapePie()
@property (nonatomic, copy) float (^defaultValue)(id);
@end

@implementation DFIShapePie

- (instancetype)init {
    if (self = [super init]) {
        _startAngle = _padAngle = 0.0f;
        _endAngle = 2 * M_PI;
        _defaultValue = ^float (id obj){
            return [obj floatValue];
        };
        _arcs = nil;
        _value = _defaultValue;
    }

    return self;
}

- (NSMutableArray *)loadPieWithData:(NSMutableArray *)data {
    int dataLength = data.count;
    int i, j, sum = 0;
    float k;
    float diffAngle = MIN(2 * M_PI, MAX(-2 * M_PI, _endAngle - _startAngle));
    float p = MIN(fabsf(diffAngle) / dataLength, _padAngle);
    float pa = p * (diffAngle < 0 ? -1 : 1);
    float curValue;

    NSMutableArray *index = [NSMutableArray new];
    NSMutableArray *arcs = [NSMutableArray new];

    for (i = 0; i < dataLength; ++i) {
        id curData = [data objectAtIndex:i];
        curValue = _value(curData);
        [index addObject:@(i)];
        [arcs addObject:@(curValue)];
        if (curValue > 0) {
            sum += curValue;
        }
    }

    // TODO - sort data
    NSArray *sortedIndex;
    sortedIndex = [index sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        int indexOne = [obj1 intValue];
        int indexTwo = [obj2 intValue];
        float valueOne = [[arcs objectAtIndex:indexOne] floatValue];
        float valueTwo = [[arcs objectAtIndex:indexTwo] floatValue];
        if (valueOne >= valueTwo) {
            return NSOrderedDescending;
        } else {
            return NSOrderedAscending;
        }
    }];

    NSMutableArray *finalArcs = [NSMutableArray new];

    float tempEndAngle;
    float tempStartAngle = _startAngle;
    k = sum != 0 ? (diffAngle - dataLength * pa) / sum : 0.0f;
    for (i = 0; i < dataLength; ++i) {
        j = [[sortedIndex objectAtIndex:i] intValue];
        curValue = [[arcs objectAtIndex:j] floatValue];
        tempEndAngle = tempStartAngle + (curValue > 0 ? curValue * k : 0.0f) + pa;
        NSDictionary *curArc = [NSDictionary dictionaryWithObjectsAndKeys:
                [data objectAtIndex:j], @"data",
                @(i), @"index",
                @(curValue), @"value",
                @(tempStartAngle), @"startAngle",
                @(tempEndAngle), @"endAngle",
                @(p), @"padAngle",
                nil
        ];
        [finalArcs addObject:curArc];
        tempStartAngle = tempEndAngle;
    }

    _arcs = finalArcs;
    return finalArcs;
}

- (NSMutableArray *)loadPieWithDSVParseResult:(DFIDSVParseResult *)result {
    return [self loadPieWithData:result.rows];
}


@end

//
//  DFIChord.m
//  DFI
//
//  Created by vanney on 2017/5/2.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIChord.h"
#import "DFIArray.h"


@implementation DFIChordRecord
@end


@implementation DFIChord

- (instancetype)init {
    if (self = [super init]) {
        _padAngle = 0.0f;
        _sortGroups = nil;
        _sortSubgroups = nil;
        _sortChords = nil;
        _chords = [[DFIChordRecord alloc] init];
    }

    return self;
}

- (void)loadChordWithMatrix:(NSArray *)matrix {
    int n = matrix.count;
    NSMutableArray *groupSums = [NSMutableArray array];
    NSMutableArray *groupIndex = [DFIArray rangeWithStart:0 stop:n andStep:1];
    NSMutableArray *subGroupIndex = [NSMutableArray array];
    //NSMutableArray *chords = [NSMutableArray array];
    NSMutableArray *groups = [NSMutableArray arrayWithCapacity:n];
    for (int l = 0; l < n; ++l) {
        [groups addObject:[NSNull null]];
    }
    NSMutableArray *subGroups = [NSMutableArray arrayWithCapacity:n * n];
    for (int m = 0; m < n * n; ++m) {
        [subGroups addObject:[NSNull null]];
    }

    int i = -1, j;
    CGFloat k, x, dx, x0;

    // compute sum, store in k. groupSums store each row sum
    k = 0.0f;
    while (++i < n) {
        NSArray *curRowData = [matrix objectAtIndex:i];
        x = 0.0f;
        j = -1;
        while (++j < n) {
            CGFloat curValue = [[curRowData objectAtIndex:j] floatValue];
            x += curValue;
        }
        [groupSums addObject:@(x)];
        [subGroupIndex addObject:[DFIArray rangeWithStart:0 stop:n andStep:1]];
        k += x;
    }

    // sort groups
    if (_sortGroups) {
        NSArray *sortedArray = [groupIndex sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
            int index1 = [obj1 intValue];
            int index2 = [obj2 intValue];
            return _sortGroups([groupSums objectAtIndex:index1], [groupSums objectAtIndex:index2]);
        }];

        groupIndex = [sortedArray mutableCopy];
    }

    // sort subgroups
    if (_sortSubgroups) {
        [subGroupIndex enumerateObjectsUsingBlock:^(NSMutableArray *obj, NSUInteger idx, BOOL *stop) {
            NSArray *curRowData = [matrix objectAtIndex:idx];
            NSArray *sortedSubArray = [obj sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
                int index1 = [obj1 intValue];
                int index2 = [obj2 intValue];
                return _sortSubgroups([curRowData objectAtIndex:index1], [curRowData objectAtIndex:index2]);
            }];
            //obj = [sortedSubArray mutableCopy];
            [subGroupIndex replaceObjectAtIndex:idx withObject:[sortedSubArray mutableCopy]];
        }];
    }


    // now k diff from 0 to 2 pi
    k = MAX(0, 2 * M_PI - _padAngle * n) / k;
    dx = k ? _padAngle : 2 * M_PI / n;

    // 将数据形成arc，放在subgroups和groups中
    x = 0.0f, i = -1;
    while (++i < n) {
        x0 = x, j = -1;
        int di = [[groupIndex objectAtIndex:i] intValue];
        NSMutableArray *subIndex = [subGroupIndex objectAtIndex:di];
        NSMutableArray *curRowData = [matrix objectAtIndex:di];
        while (++j < n) {
            int dj = [[subIndex objectAtIndex:j] intValue];
            CGFloat v = [[curRowData objectAtIndex:dj] floatValue];
            CGFloat a0 = x, a1 = x += v * k;
            NSDictionary *curSubGroupRecord = @{
                    @"index": @(di),
                    @"subIndex": @(dj),
                    @"startAngle": @(a0),
                    @"endAngle": @(a1),
                    @"value": @(v)
            };
            [subGroups replaceObjectAtIndex:dj * n + di withObject:curSubGroupRecord];
        }
        NSDictionary *curGroupRecord = @{
                @"index": @(di),
                @"startAngle": @(x0),
                @"endAngle": @(x),
                @"value": [groupSums objectAtIndex:di]
        };
        [groups replaceObjectAtIndex:di withObject:curGroupRecord];
        x += dx;
    }

    // generate chords
    NSMutableArray *chordsData = [NSMutableArray array];
    i = -1;
    while (++i < n) {
        j = i - 1; // 保证不会出现 01 和 10 的情况
        while (++j < n) {
            NSDictionary *source = [subGroups objectAtIndex:j * n + i];
            NSDictionary *target = [subGroups objectAtIndex:i * n + j];
            if ([[source objectForKey:@"value"] floatValue] < [[target objectForKey:@"value"] floatValue]) {
                [chordsData addObject:@{
                        @"source": target,
                        @"target": source
                }];
            } else {
                [chordsData addObject:@{
                        @"source": source,
                        @"target": target
                }];
            }
        }
    }

    NSArray *sortedChords;
    if (_sortChords) {
        sortedChords = [chordsData sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
            return _sortChords(obj1, obj2);
        }];
    } else {
        sortedChords = [chordsData copy];
    }

    _chords.data = sortedChords;
    _chords.groups = groups;
}

@end

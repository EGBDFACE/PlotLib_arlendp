//
//  DFIQuadtreeItem.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIQuadtreeItem.h"

@implementation DFIQuadtreeItem

- (instancetype)init {
    if (self = [super init]) {
        _items = [NSMutableArray arrayWithCapacity:4];
        for (int i = 0; i < 4; ++i) {
            [_items addObject:[NSNull null]];
        }
        _node = nil;
        _value = NAN;
        _x = NAN;
        _y = NAN;
    }

    return self;
}

- (instancetype)initWithLeaf:(DFIForceNode *)node {
    if (self = [super init]) {
        _items = [NSMutableArray arrayWithCapacity:4];
        for (int i = 0; i < 4; ++i) {
            [_items addObject:[NSNull null]];
        }
        _node = node;
        _value = NAN;
        _x = NAN;
        _y = NAN;
    }

    return self;
}

- (instancetype)initWithBranch:(DFIQuadtreeItem *)branch andIndex:(int)index {
    if (self = [super init]) {
        _items = [NSMutableArray arrayWithCapacity:4];
        for (int i = 0; i < 4; ++i) {
            [_items addObject:[NSNull null]];
        }
        _node = nil;
        [_items replaceObjectAtIndex:index withObject:branch];
        _value = NAN;
        _x = NAN;
        _y = NAN;
    }

    return self;
}


- (DFIQuadtreeItemStatus)itemStatus {
    if (_node != nil) {
        return DFIQuadtreeItemStatusLeaf;
    }

    for (int i = 0; i < 4; ++i) {
        DFIQuadtreeItem *curItem = [_items objectAtIndex:i];
        if (curItem != [NSNull null]) {
            return DFIQuadtreeItemStatusBranch;
        }
    }

    return DFIQuadtreeItemStatusEmpty;
}


@end

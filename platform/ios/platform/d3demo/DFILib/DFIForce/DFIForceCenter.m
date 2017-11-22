//
//  DFIForceCenter.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceCenter.h"

@interface DFIForceCenter()
@property (nonatomic, strong) NSMutableArray *nodes;
@end


@implementation DFIForceCenter

#pragma mark - public method

- (instancetype)initWithNodes:(NSMutableArray *)nodes {
    if (self = [super init]) {
        _nodes = nodes;
        _x = 0;
        _y = 0;
    }

    return self;
}

- (void)force:(float)alpha {
    int n = _nodes.count;
    float sx = 0, sy = 0;

    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [_nodes objectAtIndex:i];
        sx += curNode.x;
        sy += curNode.y;
    }

    sx = sx / n - _x;
    sy = sy / n - _y;

    for (int j = 0; j < n; ++j) {
        DFIForceNode *curNode = [_nodes objectAtIndex:j];
        curNode.x -= sx;
        curNode.y -= sy;
    }
}

- (void)centerInitializeWithX:(float)x andY:(float)y {
    _x = x;
    _y = y;
}


@end

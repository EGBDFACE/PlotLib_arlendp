//
//  DFIForceManybody.m
//  DFI
//
//  Created by vanney on 2017/2/10.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceManybody.h"
#import "DFIForceNode.h"
#import "DFIForceHelper.h"

@interface DFIForceManybody()
@property (nonatomic, strong) NSMutableArray *nodes;
@property (nonatomic, strong) NSMutableArray *strengths;
@property(nonatomic, assign) float alpha;
@property (nonatomic, strong) DFIForceNode *tempNode;
@end

@implementation DFIForceManybody

#pragma mark - public method
- (instancetype)initWithNodes:(NSMutableArray *)nodes {
    if (self = [super init]) {
        _nodes = nodes;
        _distanceMin = 1;
        _distanceMax = INFINITY;
        _theta = 0.9;

        [self pInitialize];
    }

    return self;
}

- (void)force:(float)alpha {
    _alpha = alpha;
    int n = _nodes.count;
    DFIQuadtree *quadtree = [[DFIQuadtree alloc] init];
    [quadtree addAll:_nodes];
    quadtree.delegate = self;

    [quadtree visitAfter];
    for (int i = 0; i < n; ++i) {
        _tempNode = [_nodes objectAtIndex:i];
        [quadtree visit];
    }

    /* backend release quadtree */
    DFIQuadtree *tmp = quadtree;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        [tmp class];
    });
}


#pragma mark - private method

- (void)pInitialize {
    if (_nodes == nil) {
        return;
    }

    int n = _nodes.count;
    _strengths = [[NSMutableArray alloc] initWithCapacity:n];

    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [_nodes objectAtIndex:i];
        [_strengths addObject:@([DFIForceHelper constant:-30])];
    }
}


#pragma mark - DFIQuadtreeDelegate

- (BOOL)quadtree:(DFIQuadtree *)quadtree visitItem:(DFIQuadtreeItem *)item x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    if (isnan(item.value)) {
        return YES;
    }

    float x = item.x - _tempNode.x;
    float y = item.y - _tempNode.y;
    float w = x1 - x0;
    float l = x * x + y * y;

    // 应用 Barnes-Hut 近似算法
    if (w * w / (_theta * _theta) < l) {
        if (l < _distanceMax * _distanceMax) {
            if (x == 0) {
                x = [DFIForceHelper jiggle];
                l += x * x;
            }
            if (y == 0) {
                y = [DFIForceHelper jiggle];
                l += y * y;
            }
            if (l < _distanceMin * _distanceMin) {
                l = sqrtf(_distanceMin * _distanceMin * l);
            }

            _tempNode.vx += x * item.value * _alpha / l;
            _tempNode.vy += y * item.value * _alpha / l;
        }
        return YES;
    } else if ([item itemStatus] == DFIQuadtreeItemStatusBranch || l >= _distanceMax * _distanceMax) {
        return NO;
    }

    // TODO - do something with q.next
    if (![item.node.id isEqualToString:_tempNode.id]) {
        if (x == 0) {
            x = [DFIForceHelper jiggle];
            l += x * x;
        }
        if (y == 0) {
            y = [DFIForceHelper jiggle];
            l += y * y;
        }

        if (l < _distanceMin * _distanceMin) {
            l = sqrtf(_distanceMin * _distanceMin * l);
        }
    }

    // TODO - do something with q.next
    if (![item.node.id isEqualToString:_tempNode.id]) {
        float curStrength = [[_strengths objectAtIndex:item.node.index] floatValue];
        w = curStrength * _alpha / l;
        _tempNode.vx += x * w;
        _tempNode.vy += y * w;
    }
    
    return NO;
}

// accumulate
- (void)quadtree:(DFIQuadtree *)quadtree visitAfterItem:(DFIQuadtreeItem *)item x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    float strength = 0;
    if ([item itemStatus] == DFIQuadtreeItemStatusBranch) {
        float x = 0, y = 0;
        for (int i = 0; i < 4; ++i) {
            DFIQuadtreeItem *subItem = [item.items objectAtIndex:i];
            if (subItem != [NSNull null] && !isnan(subItem.value)) {
                strength += subItem.value;
                x += subItem.value * subItem.x;
                y += subItem.value * subItem.y;
            }
        }
        item.x = x / strength;
        item.y = y / strength;
    } else if ([item itemStatus] == DFIQuadtreeItemStatusLeaf) {
        DFIForceNode *leaf = item.node;
        float leafStrength = [[_strengths objectAtIndex:leaf.index] floatValue];
        item.x = leaf.x;
        item.y = leaf.y;
        strength += leafStrength;
    }
    item.value = strength;
}

@end

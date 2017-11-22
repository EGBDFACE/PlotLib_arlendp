//
//  DFIHierarchyCluster.m
//  DFI
//
//  Created by vanney on 2017/2/27.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyCluster.h"
#import "DFIHierarchyNode.h"

@interface DFIHierarchyCluster ()
@property (nonatomic, copy) int (^defaultSeparation)(DFIHierarchyNode *, DFIHierarchyNode *);
@property (nonatomic, assign) BOOL nodeSize;
@property (nonatomic, assign) float dy;
@property (nonatomic, assign) float dx;
@end

@implementation DFIHierarchyCluster

#pragma mark - public method

- (instancetype)init {
    if (self = [super init]) {
        _dx = _dy = 1.0f;
        _nodeSize = NO;
        _defaultSeparation = ^int(DFIHierarchyNode *a, DFIHierarchyNode *b) {
            // TODO - compare two node parent
            if (a.parent == b.parent) {
                return 1;
            } else {
                return 2;
            }
        };
        _separation = _defaultSeparation;
        _root = nil;
    }

    return self;
}

- (void)loadRootNode:(DFIHierarchyNode *)root {
    _root = root;
    __block DFIHierarchyNode *previousNode = nil;
    __block float x = 0.0f;
    __weak DFIHierarchyCluster *weakSelf = self;
    [root eachAfter:^(DFIHierarchyNode *node) {
        NSMutableArray *children = node.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            node.x = [weakSelf pMeanX:children];
            node.y = [weakSelf pMaxY:children];
        } else {
            node.x = (previousNode == nil) ? 0.0f : (x += weakSelf.separation(node, previousNode));
            node.y = 0.0f;
            previousNode = node;
        }
    }];

    DFIHierarchyNode *left, *right;
    left = [self pLeafLeft:root];
    right = [self pLeafRight:root];
    float x0, x1;
    x0 = left.x - _separation(left, right) / 2;
    x1 = right.x + _separation(right, left) / 2;

    [root eachAfter:_nodeSize ? ^(DFIHierarchyNode *node) {
        node.x = (node.x - root.x) * weakSelf.dx;
        node.y = (node.y - root.y) * weakSelf.dy;
    } : ^(DFIHierarchyNode *node) {
        node.x = (node.x - x0) / (x1 - x0) * weakSelf.dx;
        node.y = (1 - (root.y != 0.0f ? node.y / root.y : 1)) * weakSelf.dy;
    }];
}

- (DFIHierarchyCluster *)size:(CGSize)size {
    // TODO - if size not exist
    _nodeSize = NO;
    _dx += size.width;
    _dy += size.height;
    return self;
}


#pragma mark - private method

- (float)pMeanX:(NSMutableArray *)children {
    int childrenCount = children.count;
    if (childrenCount <= 0) {
        // TODO - maybe exit
        return 0.0f;
    }
    float x = 0.0f;
    DFIHierarchyNode *curNode;
    for (int i = 0; i < childrenCount; ++i) {
        curNode = [children objectAtIndex:i];
        x += curNode.x;
    }

    return x / childrenCount;
}

- (float)pMaxY:(NSMutableArray *)children {
    int childrenCount = children.count;
    if (childrenCount <= 0) {
        return 0.0f;
    }
    float y = 0.0f;
    DFIHierarchyNode *curNode;
    for (int i = 0; i < childrenCount; ++i) {
        curNode = [children objectAtIndex:i];
        if (curNode.y > y) {
            y = curNode.y;
        }
    }

    return y + 1.0f;
}

- (DFIHierarchyNode *)pLeafLeft:(DFIHierarchyNode *)node {
    DFIHierarchyNode *curNode = node;
    while (curNode.children.count > 0) {
        curNode = [curNode.children firstObject];
    }
    return curNode;
}

- (DFIHierarchyNode *)pLeafRight:(DFIHierarchyNode *)node {
    DFIHierarchyNode *curNode = node;
    while (curNode.children.count > 0) {
        curNode = [curNode.children lastObject];
    }
    return curNode;
}

@end

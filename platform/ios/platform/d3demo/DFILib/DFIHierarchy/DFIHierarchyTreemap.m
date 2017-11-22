//
//  DFIHierarchyTreemap.m
//  DFI
//
//  Created by vanney on 2017/3/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyTreemap.h"
#import "DFIHierarchyNode+Treemap.h"
#import "DFIHierarchyTreemapTile.h"

@interface DFIHierarchyTreemap()
@property (nonatomic, assign) float dx;
@property (nonatomic, assign) float dy;
@property (nonatomic, assign) BOOL round;

@property (nonatomic, strong) DFIHierarchyTreemapTile *tile;

@property (nonatomic, strong) NSMutableArray *paddingStack;

@end

@implementation DFIHierarchyTreemap

- (instancetype)init {
    if (self = [super init]) {
        _tile = [DFIHierarchyTreemapTile defaultManager];
        _round = NO;
        _dx = _dy = 1.0f;
        _paddingInner = _paddingTop = _paddingRight = _paddingBottom = _paddingLeft = 0.0f;
        
        _paddingStack = [NSMutableArray new];
        [_paddingStack addObject:@(0.0f)];
    }

    return self;
}

- (void)loadRootNode:(DFIHierarchyNode *)root {
    NSLog(@"vanney code log : start");
    _root = root;
    _root.x0 = _root.y0 = 0;
    _root.x1 = _dx;
    _root.y1 = _dy;
    
    __weak DFIHierarchyTreemap *weakSelf = self;
    [_root eachBefore:^(DFIHierarchyNode *node) {
        //NSLog(@"curnode value is %f", node.value);
        //NSLog(@"curnode x1 is %f y1 is %f, x0 is %f y0 is %f and id is %@ and value is %f", node.x1, node.y1, node.x0, node.y0, [node.data objectForKey:@"name"], node.value);
        [weakSelf pPositionNode:node];
    }];

    _paddingStack = [NSMutableArray new];
    [_paddingStack addObject:@(0.0f)];

    NSLog(@"vanney code log : end");

    // TODO - if round is YES
}

- (DFIHierarchyTreemap *)size:(CGSize)size {
    _dx = size.width;
    _dy = size.height;
    return self;
}


#pragma mark - Private Method

- (void)pPositionNode:(DFIHierarchyNode *)node {
    /*
     * 将padding应用到node的坐标上面
     */
    float padding = [[self.paddingStack objectAtIndex:node.depth] floatValue];
    float x0 = node.x0 + padding;
    float y0 = node.y0 + padding;
    float x1 = node.x1 - padding;
    float y1 = node.y1 - padding;

    if (x1 < x0) {
        x0 = x1 = (x0 + x1) / 2;
    }
    if (y1 < y0) {
        y1 = y0 = (y1 + y0) / 2;
    }
    node.x0 = x0;
    node.x1 = x1;
    node.y0 = y0;
    node.y1 = y1;

    NSMutableArray *children = node.children;
    int childrenCount = children.count;
    if (childrenCount > 0) {
        padding = self.paddingInner / 2;
        if (self.paddingStack.count > node.depth + 1) {
            [self.paddingStack replaceObjectAtIndex:node.depth + 1 withObject:@(padding)];
        } else {
            [self.paddingStack addObject:@(padding)];
        }

        x0 += self.paddingLeft - padding;
        y0 += self.paddingTop - padding;
        x1 -= self.paddingRight - padding;
        y1 -= self.paddingBottom - padding;
        if (x1 < x0) {
            x0 = x1 = (x0 + x1) / 2;
        }
        if (y1 < y0) {
            y1 = y0 = (y1 + y0) / 2;
        }
        [self.tile squarify:node x0:x0 y0:y0 x1:x1 andY1:y1];
        //NSLog(@"vanney code log : finished ?");
    }
}

@end

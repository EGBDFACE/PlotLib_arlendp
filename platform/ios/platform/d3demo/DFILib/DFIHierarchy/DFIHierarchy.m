//
//  DFIHierarchy.m
//  DFI
//
//  Created by vanney on 2017/2/27.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchy.h"
#import "DFIHierarchyNode.h"
#import "DFIHelperQueue.h"


@implementation DFIHierarchy

+ (int)computeHeight:(DFIHierarchyNode *)node {
    int height = 0;
    DFIHierarchyNode *curNode = node;
    do {
        curNode.height = height;
    } while ((curNode = curNode.parent) != nil && (curNode.height < ++height));
    return height;
}

- (DFIHierarchyNode *)createHierarchyWithData:(NSMutableDictionary *)data {
    // TODO - pass a children function

    _root = [[DFIHierarchyNode alloc] initWithData:data];
    // TODO - deal with data.value
    DFIHelperQueue *queue = [[DFIHelperQueue alloc] init];
    [queue enqueue:_root];

    DFIHierarchyNode *curNode;
    while (curNode = [queue dequeue]) {
        NSMutableArray *children = [self pDefaultChildren:curNode.data];
        if (children && children.count > 0) {
            int childrenCount = children.count;
            for (int i = 0; i < childrenCount; ++i) {
                DFIHierarchyNode *curChild = [[DFIHierarchyNode alloc] initWithData:[children objectAtIndex:i]];
                curChild.parent = curNode;
                curChild.depth = curNode.depth + 1;
                [curNode.children addObject:curChild];
                [queue enqueue:curChild];
            }
        }
    }

    [_root eachBefore:^(DFIHierarchyNode *node) {
        int height = 0;
        DFIHierarchyNode *curNode = node;
        do {
            curNode.height = height;
        } while ((curNode = curNode.parent) != nil && (curNode.height < ++height));
    }];

    return _root;
}


#pragma mark - Private Method

/*
 * 默认的获取children的方法
 */
- (NSMutableArray *)pDefaultChildren:(NSMutableDictionary *)data {
    return [data objectForKey:@"children"];
}


@end

//
//  DFIHierarchyNode.m
//  DFI
//
//  Created by vanney on 2017/2/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyNode.h"
#import "DFIHelperStack.h"
#import "DFIHelperQueue.h"


@implementation DFIHierarchyNode

- (instancetype)initWithData:(NSMutableDictionary *)data {
    if (self = [super init]) {
        _data = data;
        _depth = _height = 0;
        _id = nil;
        _parent = nil;
        _children = [NSMutableArray new];
        _x = _y = 0.0f;
    }

    return self;
}

- (instancetype)initAsPreNode {
    if (self = [super init]) {
        _data = nil;
        _depth = -1;
        _height = 0;
        _id = nil;
        _parent = nil;
        _children = nil;
        _x = _y = 0.0f;
    }
    return self;
}

- (DFIHierarchyNode *)eachBefore:(void (^)(DFIHierarchyNode *))block {
    DFIHelperStack *stack = [[DFIHelperStack alloc] init];
    [stack push:self];
    DFIHierarchyNode *curNode;
    NSMutableArray *children;
    while ((curNode = [stack pop]) != nil) {
        block(curNode);
        children = curNode.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            for (int i = childrenCount - 1; i >= 0; --i) {
                [stack push:[children objectAtIndex:i]];
            }
        }
    }

    return self;
}

- (DFIHierarchyNode *)eachAfter:(void (^)(DFIHierarchyNode *))block {
    DFIHelperStack *stack = [[DFIHelperStack alloc] init];
    [stack push:self];
    DFIHelperStack *nextStack = [[DFIHelperStack alloc] init];
    DFIHierarchyNode *curNode;
    NSMutableArray *children;
    while ((curNode = [stack pop]) != nil) {
        [nextStack push:curNode];
        children = curNode.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            for (int i = 0; i < childrenCount; ++i) {
                [stack push:[children objectAtIndex:i]];
            }
        }
    }
    while ((curNode = [nextStack pop]) != nil) {
        block(curNode);
    }
    return self;
}

- (DFIHierarchyNode *)each:(void (^)(DFIHierarchyNode *))block {
    DFIHelperQueue *queue = [[DFIHelperQueue alloc] init];
    [queue enqueue:self];
    DFIHierarchyNode *curNode;
    NSMutableArray *children;
    while (curNode = [queue dequeue]) {
        block(curNode);
        children = curNode.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            for (int i = 0; i < childrenCount; ++i) {
                [queue enqueue:[children objectAtIndex:i]];
            }
        }
    }
    return self;
}

- (NSMutableArray *)descendants {
    __block NSMutableArray *result = [NSMutableArray new];
    [self each:^(DFIHierarchyNode *node) {
        [result addObject:node];
    }];

    return result;
}

- (NSMutableArray *)leaves {
    __block NSMutableArray *leaves = [NSMutableArray new];
    [self eachBefore:^(DFIHierarchyNode *node) {
        if (node.children.count <= 0) {
            [leaves addObject:node];
        }
    }];

    return leaves;
}


#pragma mark - D3 Description Data

- (NSDictionary *)dfiDescription {
    return @{
            @"Name": _id,
            @"Value": @(_value)
    };
}

- (void)loadOriginalData:(NSDictionary *)data {

}


@end

//
//  DFIForceNode.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceNode.h"

@implementation DFIForceNode

- (instancetype)initWithId:(NSString *)id andGroup:(int)group {
    if (self = [super init]) {
        _id = id;
        _group = group;
        _x = NAN;
        _y = NAN;
        _vx = NAN;
        _vy = NAN;
        _fx = NAN;
        _fy = NAN;
    }

    return self;
}

+ (DFIForceNode *)findNodeById:(NSString *)nodeId inNodes:(NSMutableArray *)nodes {
    int n = nodes.count;
    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [nodes objectAtIndex:i];
        if ([nodeId isEqualToString:curNode.id]) {
            return curNode;
        }
    }

    return nil;
}

@end

//
//  DFIHierarchyStratify.m
//  DFI
//
//  Created by vanney on 2017/2/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyStratify.h"
#import "DFIHierarchyNode.h"
#import "DFIDSVParseResult.h"
#import "DFIHierarchy.h"

@interface DFIHierarchyStratify() {
    NSString *_keyPrefix;
}
@end

@implementation DFIHierarchyStratify

#pragma mark - public method

- (instancetype)init {
    if (self = [super init]) {
        // TODO - maybe need add something
        _keyPrefix = @"$";
        _root = nil;
    }

    return self;
}

- (DFIHierarchyNode *)loadDSVData:(DFIDSVParseResult *)data {
    __block int dataLength = data.rows.count, i;
    NSString *nodeKey;
    NSMutableArray *nodes = [NSMutableArray arrayWithCapacity:dataLength];
    NSMutableDictionary *nodeByKey = [NSMutableDictionary new];
    DFIHierarchyNode *parent;

    for (i = 0; i < dataLength; ++i) {
        NSMutableDictionary *curData = data.rows[i];
        DFIHierarchyNode *curNode = [[DFIHierarchyNode alloc] initWithData:curData];
        [nodes addObject:curNode];
        NSString *nodeID = [curData objectForKey:@"id"];
        if (nodeID != nil) {
            curNode.id = nodeID;
            nodeKey = [NSString stringWithFormat:@"%@%@", _keyPrefix, nodeID];
            [nodeByKey setObject:curNode forKey:nodeKey];
        }
    }

    for (i = 0; i < dataLength; ++i) {
        DFIHierarchyNode *curNode = nodes[i];
        NSString *nodeID = nil;
        nodeID = self.parentID(curNode);

        if (nodeID == nil) {
            if (_root != nil) {
                NSLog(@"vanney code log : multiple roots");
                exit(1);
            }
            _root = curNode;
        } else {
            parent = [nodeByKey objectForKey:[NSString stringWithFormat:@"%@%@", _keyPrefix, nodeID]];
            if (parent == nil) {
                NSLog(@"vanney code log : missing node : %@", nodeID);
                exit(1);
            }
            // TODO - deal with ambiguous
            [parent.children addObject:curNode];
            curNode.parent = parent;
        }
    }

    if (_root == nil) {
        NSLog(@"vanney code log : no root");
        exit(1);
    }

    _root.parent = [[DFIHierarchyNode alloc] initAsPreNode];
    [[_root eachBefore:^(DFIHierarchyNode *blockNode) {
        blockNode.depth = blockNode.parent.depth + 1;
        --dataLength;
    }] eachBefore:^(DFIHierarchyNode *blockNode) {
        [DFIHierarchy computeHeight:blockNode];
    }];
    _root.parent = nil;
    if (dataLength > 0) {
        NSLog(@"vanney code log : cycle");
        exit(1);
    }

    return _root;
}


#pragma mark - private method


@end

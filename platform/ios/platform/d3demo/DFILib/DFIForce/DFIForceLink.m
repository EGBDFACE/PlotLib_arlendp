//
//  DFIForceLink.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceLink.h"
#import "DFIForceHelper.h"


@implementation DFIForceLinkElement

- (instancetype)initWithSource:(NSString *)source target:(NSString *)target andValue:(float)value {
    if (self = [super init]) {
        _source = source;
        _target = target;
        _value = value;
    }

    return self;
}

@end


@interface DFIForceLink ()
@property (nonatomic, strong) NSMutableArray *nodes;
@property (nonatomic, strong) NSMutableArray *counts; // node的度，被牵引的link的数量
@property (nonatomic, strong) NSMutableArray *bias; // link的弹簧系数
@property (nonatomic, strong) NSMutableArray *strengths; // link的弹力
@property (nonatomic, strong) NSMutableArray *distances; // link的距离 30为弹簧的初始距离
@end

@implementation DFIForceLink

@synthesize links = _links;

#pragma mark - public method

- (instancetype)initWithNodes:(NSMutableArray *)nodes {
    if (self = [super init]) {
        _iterations = 1;
        //_distance = [DFIForceHelper constant:30];
        _nodes = nodes;
        [self pInitialize];
    }

    return self;
}

//- (void)setLinks:(NSMutableArray *)links {
//    _links = links;
//    [self pInitialize];
//}
//
//- (NSMutableArray *)links {
//    if (_links == nil) {
//        _links = [NSMutableArray new];
//    }
//    return _links;
//}



- (void)force:(float)alpha {
    int n = self.links.count;
    for (int k = 0; k < _iterations; ++k) {
        for (int i = 0; i < n; ++i) {
            DFIForceLinkElement *linkElement = self.links[i];
            DFIForceNode *source = linkElement.sourceNode;
            DFIForceNode *target = linkElement.targetNode;
            float x, y, l, b;
            x = target.x + target.vx - source.x - source.vx;
            y = target.y + target.vy - source.y - source.vy;
            l = sqrtf(x * x + y * y);
            NSNumber *curDistance = [_distances objectAtIndex:i];
            NSNumber *curStrength = [_strengths objectAtIndex:i];
            NSNumber *curBia = [_bias objectAtIndex:i];
            b = [curBia floatValue];
            l = (l - [curDistance floatValue]) / l * alpha * [curStrength floatValue];
            x *= l;
            y *= l;

            target.vx -= x * b;
            target.vy -= y * b;
            source.vx += x * (1 - b);
            source.vy += y * (1 - b);
        }
    }
}

- (void)linksInitialize:(NSMutableArray *)links {
    int n = links.count;
    _links = [[NSMutableArray alloc] initWithCapacity:n];
    for (int i = 0; i < n; ++i) {
        NSDictionary *curLinkData = [links objectAtIndex:i];
        DFIForceLinkElement *curLink = [[DFIForceLinkElement alloc] initWithSource:[curLinkData objectForKey:@"source"] target:[curLinkData objectForKey:@"target"] andValue:[[curLinkData objectForKey:@"value"] floatValue]];
        [_links addObject:curLink];
    }
    [self pInitialize];
}


#pragma mark - private method

//- (DFIForceNode *)pFindNodeById:(NSString *)nodeId {
//    int n = _nodes.count;
//    for (int i = 0; i < n; ++i) {
//        DFIForceNode *curNode = [_nodes objectAtIndex:i];
//        if ([nodeId isEqualToString:curNode.id]) {
//            return curNode;
//        }
//    }
//
//    return nil;
//}

- (void)pInitialize {
    if (_nodes == nil) {
        return;
    }

    int i, n, m;
    n = [_nodes count];
    m = [self.links count];

    _counts = [NSMutableArray arrayWithCapacity:n];
    for (i = 0; i < n; ++i) {
        [_counts addObject:@0];
    }

    _bias = [NSMutableArray arrayWithCapacity:m];
    for (i = 0; i < m; ++i) {
        [_bias addObject:@0];
    }

    for (i = 0; i < m; ++i) {
        DFIForceLinkElement *linkElement = self.links[i];
        linkElement.index = i;
        linkElement.sourceNode = [DFIForceNode findNodeById:linkElement.source inNodes:_nodes];
        linkElement.targetNode = [DFIForceNode findNodeById:linkElement.target inNodes:_nodes];

        NSNumber *sourceCount = _counts[linkElement.sourceNode.index];
        [_counts replaceObjectAtIndex:linkElement.sourceNode.index withObject:@([sourceCount intValue] + 1)];
        NSNumber *targetCount = _counts[linkElement.targetNode.index];
        [_counts replaceObjectAtIndex:linkElement.targetNode.index withObject:@([targetCount intValue] + 1)];
    }

    for (i = 0; i < m; ++i) {
        DFIForceLinkElement *linkElement = self.links[i];
        float sourceBia = [_counts[linkElement.sourceNode.index] floatValue];
        float targetBia = [_counts[linkElement.targetNode.index] floatValue];
        [_bias replaceObjectAtIndex:i withObject:@(sourceBia / (sourceBia + targetBia))];
    }

    _strengths = [NSMutableArray arrayWithCapacity:m];
    _distances = [NSMutableArray arrayWithCapacity:m];

    [self pInitializeStrength];
    [self pInitializeDistance];
}

- (void)pInitializeStrength {
    if (_nodes == nil) {
        return;
    }

    int n = _links.count;
    for (int i = 0; i < n; ++i) {
        //[_strengths replaceObjectAtIndex:i withObject:@([self pDefaultStrengthWithLink:self.links[i]])];
        [_strengths addObject:@([self pDefaultStrengthWithLink:[self.links objectAtIndex:i]])];
    }
}

- (void)pInitializeDistance {
    if (_nodes == nil) {
        return;
    }

    int n = _links.count;
    for (int i = 0; i < n; ++i) {
        //[_distances replaceObjectAtIndex:i withObject:@([DFIForceHelper constant:30])];
        [_distances addObject:@([DFIForceHelper constant:30])];
    }
}

- (float)pDefaultStrengthWithLink:(DFIForceLinkElement *)link {
    return 1.0f / MIN([_counts[link.sourceNode.index] floatValue], [_counts[link.targetNode.index] floatValue]);
}

- (int)pIndex:(DFIForceLinkElement *)link {
    return link.index;
}

@end

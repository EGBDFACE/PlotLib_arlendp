//
//  DFIForceSimulation.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIForceSimulation.h"
#import <QuartzCore/QuartzCore.h>

@interface DFIForceSimulation() {
    float _initialRadius;
    float _initialAngle;

    // TODO - for test, wait to delete
    int _stepTimesForTest;
    NSTimeInterval _initialTime;
}

@property (nonatomic, strong) NSMutableArray *forces;
@property (nonatomic, strong) CADisplayLink *timer;

@property (nonatomic, strong) NSMutableArray *nodesBackup;
@end

@implementation DFIForceSimulation

#pragma mark - public method

- (instancetype)initWithNodes:(NSMutableArray *)nodes {
    if (self = [super init]) {
        _nodesBackup = nodes;

        _status = DFIForceSimulationStatusNormal;
        _stepTimesForTest = 0;
        _initialTime = [[NSDate date] timeIntervalSince1970];
        _initialRadius = 10.0f;
        _initialAngle = (float) (M_PI * (3 - sqrtf(5.0f)));
        _alpha = 1.0f;
        _alphaMin = 0.001f;
        _alphaDecay = 1 - powf(_alphaMin, 1.0f / 300);
        _alphaTarget = 0.0f;
        _velocityDecay = 0.6f;
        _forces = [NSMutableArray new];
        [self pInitializeNodes:nodes];
    }

    return self;
}

- (void)forceStart {
    NSLog(@"vanney code log : force start");
    [self pStartTimer];
}

- (void)addForce:(DFIForceBaseForce *)force {
    if (force != nil) {
        [_forces addObject:force];
    }
}

- (void)restart {
    [self pStopTimer];
    [self pStartTimer];
}

- (DFIForceNode *)findNodeWithinRadius:(float)radius pointX:(float)x andPointY:(float)y {
    int n = _nodes.count;
    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [_nodes objectAtIndex:i];
        float dx = x - curNode.x;
        float dy = y - curNode.y;
        float distance = sqrtf(dx * dx + dy * dy);
        if (distance <= radius) {
            return curNode;
        }
    }

    return nil;
}

- (void)reset {
    [self pInitializeNodes:_nodesBackup];
    [self restart];
}


#pragma mark - private method

// about timer
- (void)pStartTimer {
    [self pStopTimer];
    _timer = [CADisplayLink displayLinkWithTarget:self selector:@selector(pStep)];
    NSLog(@"vanney code log : initialize fps is %d", _timer.frameInterval);
    [_timer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    //[_timer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)pStopTimer {
    if (_timer != nil) {
        NSLog(@"vanney code log : final fps is %d", _timer.frameInterval);
        [_timer invalidate];
        _timer = nil;
    }
}

- (void)pInitializeNodes:(NSMutableArray *)nodes {
    int n = nodes.count;

    // initialize nodes
    _nodes = [[NSMutableArray alloc] initWithCapacity:n];
    for (int i = 0; i < n; ++i) {
        // TODO - deal with node group, maybe dynamic add class property
        NSDictionary *curNodeData = [nodes objectAtIndex:i];
        DFIForceNode *curNode = [[DFIForceNode alloc] initWithId:[curNodeData objectForKey:@"id"] andGroup:[[curNodeData objectForKey:@"group"] intValue]];
        curNode.index = i;
        if (isnan(curNode.x) || isnan(curNode.y)) {
            float radius = _initialRadius * sqrtf(i);
            float angle = i * _initialAngle;
            curNode.x = radius * cosf(angle);
            curNode.y = radius * sinf(angle);
        }

        if (isnan(curNode.vx) || isnan(curNode.vy)) {
            curNode.vx = curNode.vy = 0;
        }

        // add to _nodes array
        [_nodes addObject:curNode];
    }
}

- (void)pStep {
    ++_stepTimesForTest;
    NSTimeInterval curTime = [[NSDate date] timeIntervalSince1970];
    //NSLog(@"vanney code log : current index is %d time is %lf", _stepTimesForTest, curTime - _initialTime);
    _initialTime = curTime;
    [self pTick];
    //NSLog(@"vanney code log : tick time is %lf", [[NSDate date] timeIntervalSince1970] - curTime);
    if ([self.delegate respondsToSelector:@selector(simulationTickFinished)]) {
        [self.delegate simulationTickFinished];
    }
    if (_alpha < _alphaMin) {
        //NSLog(@"vanney code log : times is %d", _stepTimesForTest);
        [self pStopTimer];
        // TODO - call custom end event
    }
}

- (void)pTick {
    int n = _nodes.count;
    _alpha += (_alphaTarget - _alpha) * _alphaDecay;

    int forceNum = _forces.count;
    for (int i = 0; i < forceNum; ++i) {
        DFIForceBaseForce *curForce = [_forces objectAtIndex:i];
        [curForce force:_alpha];
    }

    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [_nodes objectAtIndex:i];
        if (isnan(curNode.fx)) {
            curNode.x += curNode.vx *= _velocityDecay;
        } else {
            curNode.x = curNode.fx;
            curNode.vx = 0;
        }
        if (isnan(curNode.fy)) {
            curNode.y += curNode.vy *= _velocityDecay;
        } else {
            curNode.y = curNode.fy;
            curNode.vy = 0;
        }

    }

}

@end

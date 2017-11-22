//
//  DFIGLForceView.h
//  DFI
//
//  Created by vanney on 2017/2/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DFIForceNode.h"
#import "DFIForceLink.h"
#import "DFIForceSimulation.h"

@interface DFIGLForceView : UIScrollView <DFIForceSimulationDelegate>

@property (nonatomic, strong) NSMutableArray *nodes;
@property (nonatomic, strong) NSMutableArray *links;
@property (nonatomic, strong) DFIForceSimulation *simulation;

@property(nonatomic, assign) float radiusInPoint;
@property(nonatomic, assign) CGPoint touchLocation;

@property (nonatomic, weak) DFIForceNode *paningNode;

- (void)forceViewShowPerFrame;
- (CGPoint)transformPointInScrollViewWithPoint:(CGPoint)point;

- (void)pan:(UIPanGestureRecognizer *)recognizer;

@end

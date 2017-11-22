//
//  DFIGLHierarchyClusterView.m
//  DFI
//
//  Created by vanney on 2017/3/8.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyClusterView.h"
#import "DFIHierarchyCluster.h"
#import "DFIHierarchyNode.h"

@interface DFIGLHierarchyClusterView()
@property (nonatomic, strong) DFIHierarchyCluster *cluster;
@end

@implementation DFIGLHierarchyClusterView
- (instancetype)initWithFrame:(CGRect)frame andCluster:(DFIHierarchyCluster *)cluster {
    if (self = [super initWithFrame:frame]) {
        _cluster = cluster;
        self.opaque = NO;
        self.backgroundColor = [UIColor whiteColor];
    }

    return self;
}


- (void)drawRect:(CGRect)rect {
    NSLog(@"vanney code log : draw once");
    //NSLog(@"vanney code log : cos 90 is %f", cosf(M_PI));

    [[UIColor colorWithRed:5.0f / 255.0f green:5.0f / 255.0f blue:5.0f / 255.0f alpha:0.6] setStroke];

    UIBezierPath *path = [self pCreatePath];
    path.lineWidth = 1.5f;
    [path applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
    [path stroke];
}


#pragma mark - private method

- (CGPoint)pProjectWithPoint:(CGPoint)point {
    float radius = point.y;
    float angle = (point.x - 90) / 180 * M_PI;
    CGPoint result = CGPointMake(radius * cosf(angle), radius * sinf(angle));
    return result;
}

- (UIBezierPath *)pCreatePath {
    UIBezierPath *path = [UIBezierPath bezierPath];
    NSMutableArray *nodes = [_cluster.root descendants];
    int nodeLength = nodes.count;
    if (nodeLength > 1) {
        [nodes removeObjectAtIndex:0];
        nodeLength--;
        for (int i = 0; i < nodeLength - 1; ++i) {
            DFIHierarchyNode *curNode = [nodes objectAtIndex:i];
            //CGPoint test = [self pProjectWithPoint:CGPointMake(curNode.x, curNode.y)];
            //NSLog(@"vanney code log : curNode x is %f y is %f", test.x, test.y);
            [path moveToPoint:[self pProjectWithPoint:CGPointMake(curNode.x, curNode.y)]];
            [path addCurveToPoint:[self pProjectWithPoint:CGPointMake(curNode.parent.x, curNode.parent.y)]
                    controlPoint1:[self pProjectWithPoint:CGPointMake(curNode.x, (curNode.y + curNode.parent.y) / 2)]
                    controlPoint2:[self pProjectWithPoint:CGPointMake(curNode.parent.x, (curNode.y + curNode.parent.y) / 2)]];
        }
    }

    return path;
}

@end

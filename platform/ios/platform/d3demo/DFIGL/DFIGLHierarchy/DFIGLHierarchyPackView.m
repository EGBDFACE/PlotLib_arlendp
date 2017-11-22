//
//  DFIGLHierarchyPackView.m
//  DFI
//
//  Created by vanney on 2017/3/16.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyPackView.h"
#import "DFIHierarchyPack.h"
#import "DFIHierarchyNode.h"

@interface DFIGLHierarchyPackView()
@property (nonatomic, strong) DFIHierarchyPack *pack;
@end

@implementation DFIGLHierarchyPackView
- (instancetype)initWithFrame:(CGRect)frame andPack:(DFIHierarchyPack *)pack {
    if (self = [super initWithFrame:frame]) {
        _pack = pack;
        self.opaque = NO;
        self.backgroundColor = [UIColor whiteColor];
    }

    return self;
}

- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    NSMutableArray *nodes = [_pack.root descendants];
    int nodeLength = nodes.count;
    [[UIColor blackColor] setStroke];
    [[self pRandomColor] setFill];
    int curDepth = 0;
    if (nodeLength > 0) {
        for (int i = 0; i < nodeLength; ++i) {
            DFIHierarchyNode *curNode = [nodes objectAtIndex:i];
            if (curNode.depth != curDepth) {
                curDepth = curNode.depth;
                [[self pRandomColor] setFill];
            }
            UIBezierPath *path = [UIBezierPath bezierPath];
            [path addArcWithCenter:CGPointMake(curNode.x, curNode.y) radius:curNode.radius startAngle:0.0f endAngle:2 * M_PI clockwise:YES];
            [path stroke];
            // TODO - 可以优化
            [path fill];
        }
    }
}

- (UIColor *)pRandomColor {
    NSInteger R = arc4random() % 256;
    NSInteger G = arc4random() % 256;
    NSInteger B = arc4random() % 256;
    UIColor *result = [UIColor colorWithRed:R / 255.0f green:G / 255.0f blue:B / 255.0f alpha:1.0f];
    return result;
}

@end

//
//  DFIGLHierarchyTreemapView.m
//  DFI
//
//  Created by vanney on 2017/3/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyTreemapView.h"
#import "DFIHierarchyTreemap.h"
#import "DFIHierarchyNode.h"
#import "DFIHierarchyNode+Treemap.h"

@interface DFIGLHierarchyTreemapView()
@property (nonatomic, strong) DFIHierarchyTreemap *treemap;
@end

@implementation DFIGLHierarchyTreemapView

- (instancetype)initWithFrame:(CGRect)frame andTree:(DFIHierarchyTreemap *)treemap {
    if (self = [super initWithFrame:frame]) {
        _treemap = treemap;
        self.opaque = YES;
        self.backgroundColor = [UIColor whiteColor];
    }

    return self;
}

- (void)addRectWithPath:(UIBezierPath *)path andFillColor:(UIColor *)color {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.opaque = YES;
    shapeLayer.lineWidth = 0.5f;
    shapeLayer.path = path.CGPath;
    shapeLayer.fillColor = color.CGColor;
    shapeLayer.strokeColor = [UIColor whiteColor].CGColor;
    [superLayer addSublayer:shapeLayer];
}


//- (void)drawRect:(CGRect)rect {
//    CGContextRef contex = UIGraphicsGetCurrentContext();
//
//    [[UIColor colorWithRed:5.0f / 255.0f green:5.0f / 255.0f blue:5.0f / 255.0f alpha:0.6] setFill];
//    // TODO - deal with rects
//    NSLog(@"start");
//    NSMutableArray *leaves = [_treemap.root leaves];
//    int leafCount = leaves.count;
//    if (leaves.count > 0) {
//        for (int i = 0; i < leafCount; ++i) {
//            DFIHierarchyNode *curLeaf = [leaves objectAtIndex:i];
//            CGRect curRect = CGRectMake(curLeaf.x0, curLeaf.y0, curLeaf.x1 - curLeaf.x0, curLeaf.y1 - curLeaf.y0);
//            CGContextFillRect(contex, curRect);
//        }
//    }
//    NSLog(@"end");
//}

@end

//
//  DFIGLHierarchyTreeView.m
//  DFI
//
//  Created by vanney on 2017/3/10.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyTreeView.h"
#import "DFIHierarchyTree.h"
#import "DFIHierarchyNode.h"

@interface DFIGLHierarchyTreeView()
@property (nonatomic, strong) DFIHierarchyTree *tree;
@end

@implementation DFIGLHierarchyTreeView

- (instancetype)initWithFrame:(CGRect)frame andTree:(DFIHierarchyTree *)tree {
    if (self = [super initWithFrame:frame]) {
        _tree = tree;
        self.opaque = NO;
        self.backgroundColor = [UIColor whiteColor];
    }

    return self;
}

- (void)drawRect:(CGRect)rect {
    [[UIColor colorWithRed:5.0f / 255.0f green:5.0f / 255.0f blue:5.0f / 255.0f alpha:0.6] setStroke];

    UIBezierPath *path = [self pCreatePath];
    path.lineWidth = 1.5f;
    //[path applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
    [path stroke];
}


#pragma mark - Private Method

- (UIBezierPath *)pCreatePath {
    UIBezierPath *path = [UIBezierPath bezierPath];
    NSMutableArray *nodes = [_tree.root descendants];
    if (nodes.count > 1) {
        [nodes removeObjectAtIndex:0];
        int nodeCount = nodes.count;
        for (int i = 0; i < nodeCount; ++i) {
            DFIHierarchyNode *curNode = [nodes objectAtIndex:i];
            [path moveToPoint:CGPointMake(curNode.x, curNode.y)];
            [path addCurveToPoint:CGPointMake(curNode.parent.x, curNode.parent.y)
                    controlPoint1:CGPointMake(curNode.x, (curNode.y + curNode.parent.y) / 2)
                    controlPoint2:CGPointMake(curNode.parent.x, (curNode.y + curNode.parent.y) / 2)];
        }
    }

    return path;
}

@end

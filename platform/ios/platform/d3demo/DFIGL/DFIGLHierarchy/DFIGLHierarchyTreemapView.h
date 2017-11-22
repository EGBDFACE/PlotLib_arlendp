//
//  DFIGLHierarchyTreemapView.h
//  DFI
//
//  Created by vanney on 2017/3/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <UIKit/UIKit.h>

@class DFIHierarchyTreemap;

@interface DFIGLHierarchyTreemapView : UIView

- (instancetype)initWithFrame:(CGRect)frame andTree:(DFIHierarchyTreemap *)treemap;

- (void)addRectWithPath:(UIBezierPath *)path andFillColor:(UIColor *)color;

@end

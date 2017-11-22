//
//  DFIGLShapeLineView.m
//  DFI
//
//  Created by vanney on 2017/4/25.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLShapeLineView.h"
#import "DFIShapeLine.h"
#import "DFIPath.h"

@implementation DFIGLShapeLineView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor whiteColor];
        self.opaque = YES;
    }

    return self;
}

- (void)addLine:(DFIShapeLine *)line {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = line.context.path;
    shapeLayer.path = temp.CGPath;
    shapeLayer.lineWidth = 1.5f;
    shapeLayer.strokeColor = [UIColor colorWithRed:70.0f / 255.0f green:130.0f / 255.0f blue:180.0f / 255.0f alpha:1.0f].CGColor;
    shapeLayer.fillColor = [UIColor whiteColor].CGColor;

    [superLayer addSublayer:shapeLayer];
}

@end

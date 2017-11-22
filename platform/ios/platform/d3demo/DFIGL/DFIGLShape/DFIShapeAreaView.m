//
//  DFIShapeAreaView.m
//  DFI
//
//  Created by vanney on 2017/4/26.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeAreaView.h"
#import "DFIShapeArea.h"
#import "DFIPath.h"

@implementation DFIShapeAreaView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor whiteColor];
        self.opaque = YES;
    }

    return self;
}

- (void)addArea:(DFIShapeArea *)area {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = area.context.path;
    shapeLayer.path = temp.CGPath;
    shapeLayer.lineWidth = 1.5f;
    shapeLayer.strokeColor = [UIColor colorWithRed:70.0f / 255.0f green:130.0f / 255.0f blue:180.0f / 255.0f alpha:1.0f].CGColor;
    shapeLayer.fillColor = [UIColor colorWithRed:176.0f / 255.0f green:196.0f / 255.0f blue:222.0f / 255.0f alpha:1.0f].CGColor;

    [superLayer addSublayer:shapeLayer];
}

- (void)addArea:(DFIShapeArea *)area withFillColor:(UIColor *)fillColor andStrokeColor:(UIColor *)strokeColor {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = area.context.path;
    shapeLayer.path = temp.CGPath;
    shapeLayer.lineWidth = 1.5f;
    shapeLayer.strokeColor = strokeColor.CGColor;
    shapeLayer.fillColor = fillColor.CGColor;

    [superLayer addSublayer:shapeLayer];
}



/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end

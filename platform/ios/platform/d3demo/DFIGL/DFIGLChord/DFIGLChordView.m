//
//  DFIGLChordView.m
//  DFI
//
//  Created by vanney on 2017/5/3.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLChordView.h"
#import "DFIPath.h"
#import "DFIShapeArc.h"
#import "DFIChordRibbon.h"
#import "DFIColor.h"

@implementation DFIGLChordView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor whiteColor];
        self.opaque = YES;
    }
    return self;
}

- (void)addOuterArc:(DFIShapeArc *)arc withCenter:(CGPoint)center andFillColor:(UIColor *)color {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = arc.path.path;
    [temp applyTransform:CGAffineTransformMakeTranslation(center.x, center.y)];
    shapeLayer.path = temp.CGPath;
    shapeLayer.fillColor = color.CGColor;
    shapeLayer.strokeColor = [UIColor darkGrayColor].CGColor;
    shapeLayer.lineWidth = 1.5f;
    [superLayer addSublayer:shapeLayer];
}

- (void)addOuterArc:(DFIShapeArc *)arc withCenter:(CGPoint)center andFillColorString:(NSString *)colorString {
    CALayer *superLayer = self.layer;

    DFIColor *color = [DFIColor colorWithFormat:colorString];
    DFIColor *strokeColor = [color darkerWithK:1.0];

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = arc.path.path;
    [temp applyTransform:CGAffineTransformMakeTranslation(center.x, center.y)];
    shapeLayer.path = temp.CGPath;
    shapeLayer.fillColor = [color toUIColor].CGColor;
    shapeLayer.strokeColor = [strokeColor toUIColor].CGColor;
    shapeLayer.lineWidth = 1.5f;
    [superLayer addSublayer:shapeLayer];

}

- (void)addInnerRibbon:(DFIChordRibbon *)ribbon withCenter:(CGPoint)center andFillColorString:(NSString *)colorString {
    CALayer *superLayer = self.layer;

    DFIColor *color = [DFIColor colorWithFormat:colorString];
    DFIColor *strokeColor = [color darkerWithK:1.0];

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.opacity = 0.67;
    UIBezierPath *temp = ribbon.context.path;
    [temp applyTransform:CGAffineTransformMakeTranslation(center.x, center.y)];
    shapeLayer.path = temp.CGPath;
    shapeLayer.fillColor = [color toUIColor].CGColor;
    shapeLayer.strokeColor = [strokeColor toUIColor].CGColor;
    shapeLayer.lineWidth = 1.5f;
    [superLayer addSublayer:shapeLayer];
}


- (void)addInnerRibbon:(DFIChordRibbon *)ribbon withCenter:(CGPoint)center andFillColor:(UIColor *)color {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.opacity = 0.67;
    UIBezierPath *temp = ribbon.context.path;
    [temp applyTransform:CGAffineTransformMakeTranslation(center.x, center.y)];
    shapeLayer.path = temp.CGPath;
    shapeLayer.fillColor = color.CGColor;
    shapeLayer.strokeColor = [UIColor darkGrayColor].CGColor;
    shapeLayer.lineWidth = 1.5f;
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

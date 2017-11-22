//
//  DFIShapeSymbolView.m
//  DFI
//
//  Created by vanney on 2017/4/28.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <Colours/Colours.h>
#import "DFIShapeSymbolView.h"
#import "DFIShapeSymbol.h"
#import "DFIPath.h"

@implementation DFIShapeSymbolView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor whiteColor];
        self.opaque = NO;
    }

    return self;
}


- (void)addSymbol:(DFIShapeSymbol *)symbol andCenter:(CGPoint)center {
    CALayer *superLayer = self.layer;

    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *temp = symbol.context.path;
    [temp applyTransform:CGAffineTransformMakeTranslation(center.x, center.y)];
    shapeLayer.path = temp.CGPath;
    shapeLayer.strokeColor = [UIColor blackColor].CGColor;
    shapeLayer.lineWidth = 1.5f;
    shapeLayer.fillColor = [UIColor steelBlueColor].CGColor;

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

//
//  DFIGL2BaseLayer.m
//  DFI
//
//  Created by vanney on 2017/5/11.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGL2BaseLayer.h"
#import "DFIColor.h"
#import "DFIPath.h"

@interface DFIGL2BaseLayer()
@property (nonatomic, strong) UIView *descriptionView;
@end

@implementation DFIGL2BaseLayer

/**
 * override layer method
 * @return
 */
+ (CALayer *)layer {
    DFIGL2BaseLayer *layer = [[DFIGL2BaseLayer alloc] init];
    // avoid offscreen render
    layer.allowsGroupOpacity = NO;
    // can reuse layer
    //layer.shouldRasterize = YES;
    return layer;
}

#pragma mark - setter && getter

- (void)setDfiStrokeColor:(DFIColor *)dfiStrokeColor {
    _dfiStrokeColor = dfiStrokeColor;
    self.strokeColor = [_dfiStrokeColor toUIColor].CGColor;
}

- (void)setDfiFillColor:(DFIColor *)dfiFillColor {
    _dfiFillColor = dfiFillColor;
    self.fillColor = [_dfiFillColor toUIColor].CGColor;
}

- (void)setDfiPath:(DFIPath *)dfiPath {
    _dfiPath = dfiPath;
    self.path = _dfiPath.path.CGPath;
}

- (void)setOriginalPosition:(CGPoint)originalPosition {
    _originalPosition = originalPosition;
    self.position = _originalPosition;
}


#pragma mark - Public method

- (void)moveToPoint:(CGPoint)dest {
    self.position = dest;
}

- (void)translation:(CGPoint)translate {
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    self.position = CGPointMake(self.position.x + translate.x, self.position.y + translate.y);
    [CATransaction commit];
}


- (void)highLightLayer {
    DFIColor *highLightColor = [_dfiStrokeColor brighterWithK:1.0f];
    self.strokeColor = [highLightColor toUIColor].CGColor;
}

- (void)deEmphasizeLayer {
    DFIColor *darkerColor = [_dfiStrokeColor darkerWithK:1.0f];
    self.strokeColor = [darkerColor toUIColor].CGColor;
}

- (void)ordinaryLayer {
    self.strokeColor = [_dfiStrokeColor toUIColor].CGColor;
}

- (BOOL)containerPoint:(CGPoint)point {
    if ([_dfiPath.path containsPoint:point]) {
        return YES;
    } else {
        return NO;
    }
}


@end

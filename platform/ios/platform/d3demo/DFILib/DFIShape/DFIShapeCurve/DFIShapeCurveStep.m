//
//  DFIShapeCurveStep.m
//  DFI
//
//  Created by vanney on 2017/4/25.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeCurveStep.h"
#import "DFIPath.h"
#import <UIKit/UIKit.h>

@interface DFIShapeCurveStep()
// step类独有的
@property (nonatomic, assign) CGFloat t;
@property (nonatomic, assign) CGFloat x;
@property (nonatomic, assign) CGFloat y;
@end

@implementation DFIShapeCurveStep

- (void)areaStart {
    self.line = 0.0f;
}

- (void)areaEnd {
    self.line = NAN;
}

- (void)lineStart {
    _x = _y = NAN;
    self.point = 0;
}

- (void)lineEnd {
    if (0 < _t && _t < 1 && self.point == 2) {
        [self.context lineTo:CGPointMake(_x, _y)];
    }
    if ((self.line && !isnan(self.line)) || (self.line != 0.0f && self.point == 1)) {
        [self.context closePath];
    }
    if (self.line >= 0) {
        _t = 1 - _t;
        self.line = 1 - self.line;
    }
}

- (void)point:(CGPoint)point {
    switch (self.point) {
        case 0: {
            self.point = 1;
            if (self.line && !isnan(self.line)) {
                [self.context lineTo:point];
            } else {
                [self.context moveTo:point];
            }
            break;
        }
        case 1:
            self.point = 2;
        default: {
            if (_t <= 0) {
                [self.context lineTo:CGPointMake(_x, point.y)];
                [self.context lineTo:point];
            } else {
                CGFloat x1 = _x * (1 - _t) + point.x * _t;
                [self.context lineTo:CGPointMake(x1, _y)];
                [self.context lineTo:CGPointMake(x1, point.y)];
            }
            break;
        }
    }

    _x = point.x;
    _y = point.y;
}

- (void)loadPath:(DFIPath *)path {
    self.context = path;
    _t = 0.5f;
}

@end

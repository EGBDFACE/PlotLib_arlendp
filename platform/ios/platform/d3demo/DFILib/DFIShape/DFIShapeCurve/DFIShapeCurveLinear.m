//
//  DFIShapeCurveLinear.m
//  DFI
//
//  Created by vanney on 2017/4/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeCurveLinear.h"
#import "DFIPath.h"

@interface DFIShapeCurveLinear()
@end

@implementation DFIShapeCurveLinear

- (void)areaStart {
    self.line = 0.0f;
}

- (void)areaEnd {
    self.line = NAN;
}

- (void)lineStart {
    self.point = 0;
}

- (void)lineEnd {
    NSLog(@"vanney code log : line is %f and point is %d", self.line, self.point);
    if ((self.line && !isnan(self.line))  || (self.line != 0.0f && self.point == 1)) {
        [self.context closePath];
    }

    self.line = 1.0f - self.line;
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
        default:
            [self.context lineTo:point];
            break;
    }
}

- (void)loadPath:(DFIPath *)path {
    self.context = path;
}


@end

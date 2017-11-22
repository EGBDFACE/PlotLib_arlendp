//
//  DFIInterpolateColor.m
//  DFI
//
//  Created by vanney on 2017/5/5.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIInterpolateColor.h"

@implementation DFIInterpolateColor


+ (DFIInterpolateColorBlockType1)p_linearWithA:(CGFloat)a andD:(CGFloat)d {
    return ^CGFloat(CGFloat t) {
        return a + t * d;
    };
}

+ (DFIInterpolateColorBlockType1)p_exponentialWithA:(CGFloat)a b:(CGFloat)b andY:(CGFloat)y {
    a = pow(a, y);
    b = pow(b, y) - a;
    y = 1 / y;

    return ^CGFloat(CGFloat t) {
        return pow(a + t * b, y);
    };
}

+ (DFIInterpolateColorBlockType1)hueWithA:(CGFloat)a andB:(CGFloat)b {
    CGFloat d = b - a;
    if (d) {
        return [DFIInterpolateColor p_linearWithA:a andD:(d > 180 || d < -180) ? d - 360 * round(d / 360) : d];
    } else {
        return ^CGFloat(CGFloat x) {
            return isnan(a) ? b : a;
        };
    }
}

+ (DFIInterpolateColorBlockType2)gamma:(CGFloat)y {
    if (y == 1) {
        return ^DFIInterpolateColorBlockType1 (CGFloat a, CGFloat b) {
            CGFloat d = b - a;
            if (d) {
                return [DFIInterpolateColor p_linearWithA:a andD:d];
            } else {
                return ^CGFloat(CGFloat x) {
                    return isnan(a) ? b : a;
                };
            }
        };
    } else {
        return ^DFIInterpolateColorBlockType1 (CGFloat a, CGFloat b) {
            if (b - a) {
                return [DFIInterpolateColor p_exponentialWithA:a b:b andY:y];
            } else {
                return ^CGFloat(CGFloat x) {
                    return isnan(a) ? b : a;
                };
            }
        };
    }
}

+ (DFIInterpolateColorBlockType1)nogammaWithA:(CGFloat)a andB:(CGFloat)b {
    CGFloat d = b - a;
    if (d) {
        return [DFIInterpolateColor p_linearWithA:a andD:d];
    } else {
        return ^CGFloat(CGFloat x) {
            return isnan(a) ? b : a;
        };
    }
}


@end

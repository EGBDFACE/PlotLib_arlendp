//
//  DFIInterPolateRGB.m
//  DFI
//
//  Created by vanney on 2017/5/5.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIInterPolateRGB.h"
#import "DFIColor.h"
#import "DFIInterpolateColor.h"
#import "DFIInterpolateHelper.h"

@interface DFIInterPolateRGB()
/** 定义计算插值的block **/
@property (nonatomic, copy) DFIInterpolateColorBlockType1 r;
@property (nonatomic, copy) DFIInterpolateColorBlockType1 g;
@property (nonatomic, copy) DFIInterpolateColorBlockType1 b;
@property (nonatomic, copy) DFIInterpolateColorBlockType1 opacity;
@end

@implementation DFIInterPolateRGB

- (instancetype)initWithStart:(NSString *)startColorFormat andEnd:(NSString *)endColorFormat {
    return [self initWithStart:startColorFormat andEnd:endColorFormat andGamma:1.0f];
}

- (instancetype)initWithStart:(NSString *)startColorFormat andEnd:(NSString *)endColorFormat andGamma:(CGFloat)gamma {
    if (self = [super init]) {
        _gamma = gamma;
        DFIInterpolateColorBlockType2 color = [DFIInterpolateColor gamma:gamma];
        DFIColor *startColor = [DFIColor colorWithFormat:startColorFormat];
        DFIColor *endColor = [DFIColor colorWithFormat:endColorFormat];

        _r = color(startColor.r, endColor.r);
        _g = color(startColor.g, endColor.g);
        _b = color(startColor.b, endColor.b);
        _opacity = [DFIInterpolateColor nogammaWithA:startColor.opacity andB:endColor.opacity];
    }

    return self;
}

- (instancetype)initBasisWithColors:(NSArray *)colors {
    if (self = [super init]) {
        int n = colors.count, i;
        NSMutableArray *rArray = [NSMutableArray arrayWithCapacity:n];
        NSMutableArray *gArray = [NSMutableArray arrayWithCapacity:n];
        NSMutableArray *bArray = [NSMutableArray arrayWithCapacity:n];
//    for (i = 0; i < n; ++i) {
//        [rArray addObject:[NSNull null]];
//        [gArray addObject:[NSNull null]];
//        [bArray addObject:[NSNull null]];
//    }
        DFIColor *curColor;
        for (i = 0; i < n; ++i) {
            NSString *curColorFormat = [colors objectAtIndex:i];
            curColor = [DFIColor colorWithFormat:curColorFormat];
            [rArray addObject:@(curColor.r)];
            [gArray addObject:@(curColor.g)];
            [bArray addObject:@(curColor.b)];
        }

        _r = [DFIInterpolateHelper basis:rArray];
        _g = [DFIInterpolateHelper basis:gArray];
        _b = [DFIInterpolateHelper basis:bArray];
        _opacity = ^CGFloat(CGFloat t) {
            return 1.0f;
        };
    }

    return self;
}

- (instancetype)initBasisClosedWithColors:(NSArray *)colors {
    if (self = [super init]) {
        int n = colors.count, i;
        NSMutableArray *rArray = [NSMutableArray arrayWithCapacity:n];
        NSMutableArray *gArray = [NSMutableArray arrayWithCapacity:n];
        NSMutableArray *bArray = [NSMutableArray arrayWithCapacity:n];
//    for (i = 0; i < n; ++i) {
//        [rArray addObject:[NSNull null]];
//        [gArray addObject:[NSNull null]];
//        [bArray addObject:[NSNull null]];
//    }
        DFIColor *curColor;
        for (i = 0; i < n; ++i) {
            NSString *curColorFormat = [colors objectAtIndex:i];
            curColor = [DFIColor colorWithFormat:curColorFormat];
            [rArray addObject:@(curColor.r)];
            [gArray addObject:@(curColor.g)];
            [bArray addObject:@(curColor.b)];
        }

        _r = [DFIInterpolateHelper basisClosed:rArray];
        _g = [DFIInterpolateHelper basisClosed:gArray];
        _b = [DFIInterpolateHelper basisClosed:bArray];
        _opacity = ^CGFloat(CGFloat t) {
            return 1.0f;
        };
    }

    return self;
}


- (DFIColor *)interpolate:(CGFloat)t {
    DFIColor *interColor = [[DFIColor alloc] init];
    interColor.r = _r(t);
    interColor.g = _g(t);
    interColor.b = _b(t);
    interColor.opacity = _opacity(t);
    return interColor;
}


@end

//
//  DFIScaleContinuous.m
//  DFI
//
//  Created by vanney on 2017/5/4.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIScaleContinuous.h"

@interface DFIScaleContinuous()
@property (nonatomic, copy) DFIScaleBlockType2 deinterpolate;
@property (nonatomic, copy) DFIScaleBlockType2 reinterpolate;
@property (nonatomic, assign) BOOL piecewise;
@property (nonatomic, assign) CGFloat output;
@property (nonatomic, assign) CGFloat input;
@end

@implementation DFIScaleContinuous

@synthesize domain = _domain;
@synthesize range = _range;
@synthesize clamp = _clamp;

static int unit[2] = {0, 1};

#pragma mark - Class method



#pragma mark - Object method
- (instancetype)initWithDeinterpolate:(DFIScaleBlockType2)deinterpolate andReinterpolate:(DFIScaleBlockType2)reinterpolate {
    if (self = [super init]) {
        _deinterpolate = deinterpolate;
        _reinterpolate = reinterpolate;
        self.domain = [@[@(unit[0]), @(unit[1])] mutableCopy];
        self.range = [@[@(unit[0]), @(unit[1])] mutableCopy];
        self.clamp = NO;
        // TODO - deal with interpolateValue

        [self p_rescale];
    }
    return self;
}

- (CGFloat)scale:(CGFloat)x {
    // TODO - replace reinterpolate with interpolate
    if (_piecewise) {
        _output = [self p_polymapWithDomain:self.domain range:self.range deinterpolate:self.clamp ? [self p_deinterpolateClamp:_deinterpolate] : _deinterpolate andReinterpolate:_reinterpolate](x);
    } else {
        _output = [self p_bitmapWithDomain:self.domain range:self.range deinterpolate:self.clamp ? [self p_deinterpolateClamp:_deinterpolate] : _deinterpolate andReinterpolate:_reinterpolate](x);
    }
    return _output;
}

- (CGFloat)invert:(CGFloat)x {
    // TODO - unfinished
    return 0.0f;
}

- (void)setDomain:(NSMutableArray *)domain {
    _domain = domain;
    [self p_rescale];
}

- (void)setRange:(NSMutableArray *)range {
    _range = range;
    [self p_rescale];
}

- (void)setClamp:(BOOL)clamp {
    _clamp = clamp;
    [self p_rescale];
}


- (void)p_rescale {
    _piecewise = MIN(self.domain.count, self.range.count) > 2 ? YES : NO;
    _output = _input = 0;
}

- (DFIScaleBlockType1)p_bitmapWithDomain:(NSArray *)domain range:(NSArray *)range deinterpolate:(DFIScaleBlockType2)deinterpolate andReinterpolate:(DFIScaleBlockType2)reinterpolate {
    CGFloat d0 = [[domain firstObject] floatValue];
    CGFloat d1 = [[domain objectAtIndex:1] floatValue];
    CGFloat r0 = [[range firstObject] floatValue];
    CGFloat r1 = [[range objectAtIndex:1] floatValue];
    DFIScaleBlockType1 db, rb;
    if (d1 < d0) {
        db = deinterpolate(d1, d0);
        rb = reinterpolate(r1, r0);
    } else {
        db = deinterpolate(d0, d1);
        rb = reinterpolate(r0, r1);
    }

    return ^CGFloat (CGFloat x) {
        return rb(db(x));
    };
}

- (DFIScaleBlockType1)p_polymapWithDomain:(NSArray *)domain range:(NSArray *)range deinterpolate:(DFIScaleBlockType2)deinterpolate andReinterpolate:(DFIScaleBlockType2)reinterpolate {
    return nil;
}

- (DFIScaleBlockType1)deinterpolateLinerWithA:(CGFloat)a andB:(CGFloat)b {
    b -= a;
    if (b) {
        return ^CGFloat (CGFloat x) {
            return (x - a) / b;
        };
    } else {
        return ^CGFloat (CGFloat x) {
            return b;
        };
    }
}

- (DFIScaleBlockType2)p_deinterpolateClamp:(DFIScaleBlockType2)deinterpolate {
    return ^DFIScaleBlockType1 (CGFloat a, CGFloat b) {
        DFIScaleBlockType1 d = deinterpolate(a, b);
        return ^CGFloat (CGFloat x) {
            return x <= a ? 0 : (x >= b ? 1 : d(x));
        };
    };
}

- (DFIScaleBlockType2)p_reinterpolateClamp:(DFIScaleBlockType2)reinterpolate {
    return ^DFIScaleBlockType1 (CGFloat a, CGFloat b) {
        DFIScaleBlockType1 r = reinterpolate(a, b);
        return ^CGFloat (CGFloat t) {
            return t <= 0 ? a : (t >= 1 ? b : r(t));
        };
    };
}


@end

//
//  DFIShapeArc.m
//  DFI
//
//  Created by vanney on 2017/3/21.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <QuartzCore/QuartzCore.h>
#import "DFIShapeArc.h"
#import "DFIPath.h"

#define kInnerRadius @"innerRadius"
#define kOuterRadius @"outerRadius"
#define kCornerRadius @"cornerRadius"
#define kPadRadius @"padRadius"
#define kStartAngle @"startAngle"
#define kEndAngle @"endAngle"
#define kPadAngle @"padAngle"

#define kPointRadius 1e-12


@interface DFIShapeArc()
@property (nonatomic, strong) NSString *originalDataName;
@property (nonatomic, assign) CGFloat originalDataValue;
@end


@implementation DFIShapeArc

- (instancetype)init {
    if (self = [super init]) {
        _path = [[DFIPath alloc] init];
        _innerRadius = _outerRadius = _padRadius = _startAngle = _endAngle = NAN;
        _padAngle = _cornerRadius = 0.0f;
        //_layer = [CAShapeLayer layer];
    }

    return self;
}

- (void)loadArcWithData:(NSDictionary *)data {
    [self p_createPathWithData:data];
    //_layer.path = _path.path.CGPath;
}


#pragma mark - Description Data

- (NSDictionary *)dfiDescription {
    return @{
            @"Name": _originalDataName,
            @"Value": @(_originalDataValue)
    };
}

- (void)loadOriginalData:(NSDictionary *)data {
    _originalDataName = [data objectForKey:@"name"] ? [data objectForKey:@"name"] : @"iD3 - Arc";
    _originalDataValue = [data objectForKey:@"value"] ? [[data objectForKey:@"value"] floatValue] : 0.0f;
}


#pragma mark - Private method

/*
 * 供加载data的方法调用，构建arc的path
 */
- (void)p_createPathWithData:(NSDictionary *)data {
    _innerRadius = [data objectForKey:kInnerRadius] ? [[data objectForKey:kInnerRadius] floatValue] : _innerRadius;
    _outerRadius = [data objectForKey:kOuterRadius] ? [[data objectForKey:kOuterRadius] floatValue] : _outerRadius;
    _startAngle = [data objectForKey:kStartAngle] ? [[data objectForKey:kStartAngle] floatValue] - M_PI_2 : _startAngle;
    _endAngle = [data objectForKey:kEndAngle] ? [[data objectForKey:kEndAngle] floatValue] - M_PI_2 : _endAngle;

    // 确保不为空
    if (isnan(_innerRadius) || isnan(_outerRadius) || isnan(_startAngle) || isnan(_endAngle)) {
        NSLog(@"vanney code log : param can not be null");
        exit(1);
    }

    float diffAngle = fabsf(_endAngle - _startAngle);
    BOOL angleClockWise = _endAngle - _startAngle;

    float radius; // 临时变量

    // 确保外圈大于内圈, 如果外圈小于内圈,互换
    if (_outerRadius < _innerRadius) {
        radius = _outerRadius;
        _outerRadius = _innerRadius;
        _innerRadius = radius;
    }

    if (_outerRadius <= kPointRadius) { // 是一个点
        [_path moveTo:CGPointMake(0.0f, 0.0f)];
    } else if (diffAngle > 2 * M_PI - kPointRadius) { // 是个圆或圆环
        [_path moveTo:CGPointMake(_outerRadius * cosf(_startAngle), _outerRadius * sinf(_startAngle))];
        // 画大圆
        [_path arcWithCenter:CGPointZero startAngle:_startAngle endAngle:_endAngle andRadius:_outerRadius clockwise:!angleClockWise];
        // 再画小圆
        if (_innerRadius > kPointRadius) {
            [_path moveTo:CGPointMake(_innerRadius * cosf(_startAngle), _innerRadius * sinf(_startAngle))];
            [_path arcWithCenter:CGPointZero startAngle:_endAngle endAngle:_startAngle andRadius:_innerRadius clockwise:angleClockWise];
        }
    } else { // 是个圆弧
        float a00 = _startAngle, a01 = _startAngle;
        float a10 = _endAngle, a11 = _endAngle;
        float da0 = diffAngle, da1 = diffAngle;

        // 判断是否需要padAngle && padRadius
        // TODO - padding and corner
//        _padAngle = [data objectForKey:kPadAngle] ? [[data objectForKey:kPadAngle] floatValue] / 2 : 0.0f;
//        float radiusPadding;
//        if (_padAngle > kPointRadius) {
//            _padRadius = [data objectForKey:kPadRadius] ? [[data objectForKey:kPadRadius] floatValue] : sqrtf(_innerRadius * _innerRadius + _outerRadius * _outerRadius);
//            radiusPadding = _padRadius;
//        } else {
//            radiusPadding = 0.0f;
//        }
//        _cornerRadius = MIN(fabsf(_outerRadius - _innerRadius) / 2, _cornerRadius);
//        float rc0 = _cornerRadius, rc1 = _cornerRadius;
//
//        // 应用padding
//        if (radiusPadding > kPointRadius) {
//            float p0 = [self p_asin:radiusPadding / _innerRadius * sinf(_padAngle)];
//
//        }

        /*
         * (x01, y01) 外圈起始点
         * (x10, y10) 内圈终止点
         */
        float x01 = _outerRadius * cosf(a01);
        float y01 = _outerRadius * sinf(a01);
        float x10 = _innerRadius * cosf(a10);
        float y10 = _innerRadius * sinf(a10);

        if (da1 <= kPointRadius) { // 弧度极小，相当于一条线
            [_path moveTo:CGPointMake(x01, y01)];
        } else { // 确实是个圆弧
            [_path moveTo:CGPointMake(x01, y01)];
            [_path arcWithCenter:CGPointZero startAngle:a01 endAngle:a11 andRadius:_outerRadius clockwise:!angleClockWise];
        }

        if (_innerRadius <= kPointRadius) { // 如果内圈太小，就是圆，而不是环
            [_path lineTo:CGPointMake(x10, y10)];
        } else {
            [_path lineTo:CGPointMake(x10, y10)];
            [_path arcWithCenter:CGPointZero startAngle:a10 endAngle:a00 andRadius:_innerRadius clockwise:angleClockWise];
        }

        [_path closePath];
    }
}

/*
 * 反正弦函数
 */
- (float)p_asin:(float)x {
    float result;
    if (x >= 1) {
        result = M_PI_2;
    } else if (x <= -1) {
        result = -M_PI_2;
    } else {
        result = asinf(x);
    }
    return result;
}


@end

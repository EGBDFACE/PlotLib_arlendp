//
//  DFIPath.m
//  DFI
//
//  Created by vanney on 2017/3/21.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIPath.h"
#import "DFIHierarchyNode.h"

@interface DFIPath()
/*
 * (x0, y0) startPoint (x1, y1) endPoint
 */
@property (nonatomic, assign) float x0;
@property (nonatomic, assign) float y0;
@property (nonatomic, assign) float x1;
@property (nonatomic, assign) float y1;
@end

@implementation DFIPath

- (instancetype)init {
    if (self = [super init]) {
        _x0 = _x1 = _y0 = _y1 = NAN;
        _path = [UIBezierPath bezierPath];
    }

    return self;
}

- (DFIPath *)moveTo:(CGPoint)point {
    _x0 = _x1 = point.x;
    _y0 = _y1 = point.y;
    [_path moveToPoint:point];
    return self;
}

- (DFIPath *)closePath {
    _x1 = _x0;
    _y1 = _y0;
    [_path closePath];
    return self;
}

- (DFIPath *)lineTo:(CGPoint)point {
    _x1 = point.x;
    _y1 = point.y;
    [_path addLineToPoint:point];
    return self;
}

- (DFIPath *)quadraticCurveTo:(CGPoint)endPoint withControl:(CGPoint)controlPoint {
    _x1 = endPoint.x;
    _y1 = endPoint.y;
    [_path addQuadCurveToPoint:endPoint controlPoint:controlPoint];
    return self;
}

- (DFIPath *)bezierCurveTo:(CGPoint)endPoint withControl1:(CGPoint)point1 andControl2:(CGPoint)point2 {
    _x1 = endPoint.x;
    _y1 = endPoint.y;
    [_path addCurveToPoint:endPoint controlPoint1:point1 controlPoint2:point2];
    return self;
}

- (DFIPath *)arcTo:(CGPoint)point1 to:(CGPoint)point2 withRadius:(float)radius {
    return self;
}

- (DFIPath *)arcWithCenter:(CGPoint)center startAngle:(float)startAngle endAngle:(float)endAngle andRadius:(float)radius clockwise:(BOOL)clockwise {
    _x1 = center.x + radius * cosf(endAngle);
    _y1 = center.y + radius * sinf(endAngle);
    [_path addArcWithCenter:center radius:radius startAngle:startAngle endAngle:endAngle clockwise:!clockwise];
    return self;
}

- (DFIPath *)rectWithPoint:(CGPoint)point width:(float)width andHeight:(float)height {
    [_path moveToPoint:point];
    [_path addLineToPoint:CGPointMake(point.x + width, point.y)];
    [_path addLineToPoint:CGPointMake(point.x + width, point.y + height)];
    [_path addLineToPoint:CGPointMake(point.x, point.y + height)];
    [_path addLineToPoint:point];
    return self;
}


@end

//
//  DFIShapeSymbolBase.m
//  DFI
//
//  Created by vanney on 2017/4/28.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeSymbolBase.h"
#import "DFIPath.h"

@implementation DFIShapeSymbolBase

+ (void)drawInContext:(DFIPath *)context withType:(DFIShapeSymbolType)type andSize:(CGFloat)size {
    switch (type) {
        case DFIShapeSymbolTypeCircle:
            [self p_drawCircleInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeCross:
            [self p_drawCrossInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeDiamond:
            [self p_drawDiamondInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeSquare:
            [self p_drawSquareInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeStar:
            [self p_drawStarInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeTriangle:
            [self p_drawTriangleInContext:context withSize:size];
            break;
        case DFIShapeSymbolTypeWye:
            [self p_drawWyeInContext:context withSize:size];
            break;
        default:
            break;
    }
}

+ (void)p_drawCircleInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat r = sqrt(size / M_PI);
    [context moveTo:CGPointMake(r, 0)];
    [context arcWithCenter:CGPointMake(0, 0) startAngle:0 endAngle:2 * M_PI andRadius:r clockwise:YES];
}

+ (void)p_drawCrossInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat r = sqrt(size / 5) / 2;
    [context moveTo:CGPointMake(-3 * r, -r)];
    [context lineTo:CGPointMake(-r, -r)];
    [context lineTo:CGPointMake(-r, -3 * r)];
    [context lineTo:CGPointMake(r, -3 * r)];
    [context lineTo:CGPointMake(r, -r)];
    [context lineTo:CGPointMake(3 * r, -r)];
    [context lineTo:CGPointMake(3 * r, r)];
    [context lineTo:CGPointMake(r, r)];
    [context lineTo:CGPointMake(r, 3 * r)];
    [context lineTo:CGPointMake(-r, 3 * r)];
    [context lineTo:CGPointMake(-r, r)];
    [context lineTo:CGPointMake(-3 * r, r)];
    [context closePath];
}

+ (void)p_drawDiamondInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat tan30 = sqrt(1.0f / 3.0f);
    CGFloat tan30_2 = tan30 * 2;
    CGFloat y = sqrt(size / tan30_2);
    CGFloat x = y * tan30;

    [context moveTo:CGPointMake(0, -y)];
    [context lineTo:CGPointMake(x, 0)];
    [context lineTo:CGPointMake(0, y)];
    [context lineTo:CGPointMake(-x, 0)];
    [context closePath];
}

+ (void)p_drawSquareInContext:(DFIPath *)context withSize:(CGFloat)size {
    NSLog(@"vanney code log : square");
    CGFloat w = sqrt(size);
    CGFloat x = -w / 2;
    [context rectWithPoint:CGPointMake(x, x) width:w andHeight:w];
}

+ (void)p_drawStarInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat ka = 0.89081309152928522810;
    CGFloat kr = sin(M_PI / 10) / sin(7 * M_PI / 10);
    CGFloat kx = sin(2 * M_PI / 10) * kr;
    CGFloat ky = -cos(2 * M_PI / 10) * kr;

    CGFloat r = sqrt(size * ka);
    CGFloat x = kx * r;
    CGFloat y = ky * r;

    [context moveTo:CGPointMake(0, -r)];
    [context lineTo:CGPointMake(x, y)];

    for (int i = 1; i < 5; ++i) {
        CGFloat a = 2 * M_PI * i / 5;
        CGFloat c = cos(a);
        CGFloat s = sin(a);
        [context lineTo:CGPointMake(s * r, -c * r)];
        [context lineTo:CGPointMake(c * x - s * y, s * x + c * y)];
    }

    [context closePath];
}

+ (void)p_drawTriangleInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat sqrt3 = sqrt(3.0);
    CGFloat y = -sqrt(size / (sqrt3 * 3));
    [context moveTo:CGPointMake(0, y * 2)];
    [context lineTo:CGPointMake(-sqrt3 * y, -y)];
    [context lineTo:CGPointMake(sqrt3 * y, -y)];
    [context closePath];
}

+ (void)p_drawWyeInContext:(DFIPath *)context withSize:(CGFloat)size {
    CGFloat c = -0.5, s = sqrt(3.0f) / 2, k = 1.0f / sqrt(12.0f), a = (k / 2 + 1) * 3;

    CGFloat r = sqrt(size / a), x0 = r / 2, y0 = r * k, x1 = x0, y1 = r * k + r, x2 = -x1, y2 = y1;

    [context moveTo:CGPointMake(x0, y0)];
    [context lineTo:CGPointMake(x1, y1)];
    [context lineTo:CGPointMake(x2, y2)];
    [context lineTo:CGPointMake(c * x0 - s * y0, s * x0 + c * y0)];
    [context lineTo:CGPointMake(c * x1 - s * y1, s * x1 + c * y1)];
    [context lineTo:CGPointMake(c * x2 - s * y2, s * x2 + c * y2)];
    [context lineTo:CGPointMake(c * x0 + s * y0, c * y0 - s * x0)];
    [context lineTo:CGPointMake(c * x1 + s * y1, c * y1 - s * x1)];
    [context lineTo:CGPointMake(c * x2 + s * y2, c * y2 - s * x2)];
    [context closePath];
}


@end

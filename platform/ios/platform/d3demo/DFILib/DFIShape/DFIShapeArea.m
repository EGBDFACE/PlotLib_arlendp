//
//  DFIShapeArea.m
//  DFI
//
//  Created by vanney on 2017/4/25.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeArea.h"
#import "DFIPath.h"

@interface DFIShapeArea()
@property (nonatomic, strong) DFIShapeCurveBase *curve;
@end

@implementation DFIShapeArea

/**
 * 注意该函数不该被调用，应该使用基类的 curveWithType 方法
 * @return
 */
- (instancetype)init {
    if (self = [super init]) {
        _curveType = DFIShapeCurveTypeLinear;
        _context = nil;
        _defined = ^BOOL(id data) {
            return YES;
        };
        _x0 = ^CGFloat(NSArray * data) {
            return [[data firstObject] floatValue];
        };
        _y0 = ^CGFloat(id data) {
            return 0.0f;
        };
        _x1 = nil;
        _y1 = ^CGFloat(NSArray *data) {
            // TODO - may judge array length
            return [[data objectAtIndex:1] floatValue];
        };
    }

    return self;
}

- (void)loadAreaWithData:(NSArray *)data {
    BOOL defiend0 = NO;
    int dataLength = data.count;

    NSMutableArray *x0z = [NSMutableArray arrayWithCapacity:dataLength];
    NSMutableArray *y0z = [NSMutableArray arrayWithCapacity:dataLength];
    //初始化数组
    for (int l = 0; l < dataLength; ++l) {
        [x0z addObject:@(0)];
        [y0z addObject:@(0)];
    }

    if (_context == nil) {
        _context = [[DFIPath alloc] init];
        _curve = [DFIShapeCurveBase curveWithType:_curveType];
        [_curve loadPath:_context];
    }

    for (int i = 0; i <= dataLength; ++i) {
        id curData = nil;
        if (i < dataLength) {
            curData = [data objectAtIndex:i];
        }
        
        int j;
        if (!(i < dataLength && _defined(curData) == defiend0)) {
            if (defiend0 = !defiend0) {
                j = i;
                [_curve areaStart];
                [_curve lineStart];
            } else {
                [_curve lineEnd];
                [_curve lineStart];
                for (int k = i - 1; k >= j; --k) {
                    [_curve point:CGPointMake([[x0z objectAtIndex:k] floatValue], [[y0z objectAtIndex:k] floatValue])];
                }
                [_curve lineEnd];
                [_curve areaEnd];
            }
        }
        if (defiend0) {
            [x0z replaceObjectAtIndex:i withObject:@(_x0(curData))];
            [y0z replaceObjectAtIndex:i withObject:@(_y0(curData))];
            CGFloat tempX;
            CGFloat tempY;
            if (_x1 != nil) {
                tempX = _x1(curData);
            } else {
                tempX = [[x0z objectAtIndex:i] floatValue];
            }
            if (_y1 != nil) {
                tempY = _y1(curData);
            } else {
                tempY = [[y0z objectAtIndex:1] floatValue];
            }

            [_curve point:CGPointMake(tempX, tempY)];
        }
    }
}


@end

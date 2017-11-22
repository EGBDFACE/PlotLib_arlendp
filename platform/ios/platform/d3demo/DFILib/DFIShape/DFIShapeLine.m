//
//  DFIShapeLine.m
//  DFI
//
//  Created by vanney on 2017/4/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeLine.h"
#import "DFIPath.h"
#import "DFIDSVParseResult.h"

@interface DFIShapeLine ()
//指定两点之间的线的形状
@property (nonatomic, strong) DFIShapeCurveBase *curve;
@end

@implementation DFIShapeLine

/**
 * 注意该函数不该被调用，应该使用基类的 curveWithType 方法
 * @return
 */
- (instancetype)init {
    if (self = [super init]) {
        _curveType = DFIShapeCurveTypeLinear;
        _defined = ^BOOL(id data) {
            return YES;
        };
        _context = nil;
        _x = ^CGFloat (NSArray *point) {
            return [[point firstObject] floatValue];
        };
        _y = ^CGFloat (NSArray *point) {
            if (point.count <= 1) {
                return 0.0f;
            } else {
                return [[point objectAtIndex:1] floatValue];
            }
        };
    }

    return self;
}

- (void)loadLineWithData:(NSArray *)data {
    int dataLength = data.count;
    BOOL defined0 = NO;

    if (_context == nil) {
        _context = [[DFIPath alloc] init];
        _curve = [DFIShapeCurveBase curveWithType:_curveType];
        [_curve loadPath:_context];
    }

    // i == dataLength 为了最后的line end操作
    for (int i = 0; i <= dataLength; ++i) {
        id curData = nil;
        if (i < dataLength) {
            curData = [data objectAtIndex:i];
        }
        if (!(i < dataLength && _defined(curData) == defined0)) {
            if (defined0 = !defined0) {
                [_curve lineStart];
            } else {
                [_curve lineEnd];
            }
        }

        if (defined0) {
            [_curve point:CGPointMake(_x(curData), _y(curData))];
        }
    }

    // TODO - deal with buffer
    // 注意：这里的todo不要。web端因为有canvas和svg的区别。当context使用svg的时候，这里要接一句结束path的语句
}

- (void)loadLineWithDSVParseResult:(DFIDSVParseResult *)result {
    [self loadLineWithData:result.rows];
}


@end

//
//  DFIShapeCurveBase.m
//  DFI
//
//  Created by vanney on 2017/4/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeCurveBase.h"
#import "DFIShapeCurveLinear.h"
#import "DFIShapeCurveStep.h"

@implementation DFIShapeCurveBase

+ (DFIShapeCurveBase *)curveWithType:(DFIShapeCurveType)type {
    DFIShapeCurveBase *_instance;
    switch (type) {
        case DFIShapeCurveTypeStep:
            _instance = [[DFIShapeCurveStep alloc] init];
            break;
        case DFIShapeCurveTypeLinear:
        default:
            _instance = [[DFIShapeCurveLinear alloc] init];
    }

    _instance.line = NAN;
    _instance.point = NAN;

    return _instance;
}


@end

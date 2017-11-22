//
//  DFIAxis.m
//  DFI
//
//  Created by vanney on 2017/5/4.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIAxis.h"

@implementation DFIAxis

/**
 * 全局初始化函数，但是不要自己调用
 * @return
 */
- (instancetype)initWithType:(DFIAxisType)type andScale:(id)scale {
    if (self = [super init]) {
        _tickArguments = [NSMutableArray array];
        _tickValues = nil;
        _tickFormat = nil;
        _tickSizeInner = _tickSizeOuter = 6.0f;
        _tickPadding = 3.0f;

        _type = type;
        _scale = scale;
    }

    return self;
}

- (instancetype)initTopWithScale:(id)scale {
    return [self initWithType:DFIAxisTypeTop andScale:scale];
}

- (instancetype)initRightWithScale:(id)scale {
    return [self initWithType:DFIAxisTypeRight andScale:scale];
}

- (instancetype)initBottomWithScale:(id)scale {
    return [self initWithType:DFIAxisTypeBottom andScale:scale];
}

- (instancetype)initLeftWithScale:(id)scale {
    return [self initWithType:DFIAxisTypeLeft andScale:scale];
}

- (void)loadAxisWithContext:(id)context {

}


@end

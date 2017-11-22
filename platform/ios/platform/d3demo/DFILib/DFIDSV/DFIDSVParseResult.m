//
//  DFIDSVParseResult.m
//  DFI
//
//  Created by vanney on 2017/2/23.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDSVParseResult.h"

@implementation DFIDSVParseResult

- (instancetype)init {
    if (self = [super init]) {
        _rows = [NSMutableArray new];
        _columns = [NSMutableArray new];
    }

    return self;
}

@end

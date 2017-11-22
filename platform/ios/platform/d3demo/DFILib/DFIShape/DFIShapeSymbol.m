//
//  DFIShapeSymbol.m
//  DFI
//
//  Created by vanney on 2017/4/28.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeSymbol.h"
#import "DFIPath.h"

@interface DFIShapeSymbol()

@end

@implementation DFIShapeSymbol

- (instancetype)init {
    if (self = [super init]) {
        _type = DFIShapeSymbolTypeCircle;
        _size = 64.0f;
        _context = nil;
    }

    return self;
}

- (void)loadSymbol {
    if (!_context) {
        _context = [[DFIPath alloc] init];
    }

    [DFIShapeSymbolBase drawInContext:_context withType:_type andSize:_size];
}


@end

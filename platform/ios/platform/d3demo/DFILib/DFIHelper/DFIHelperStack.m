//
//  DFIHelperStack.m
//  DFI
//
//  Created by vanney on 2017/2/10.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHelperStack.h"

@interface DFIHelperStack()
@end

@implementation DFIHelperStack

- (instancetype)init {
    if (self = [super init]) {
        _contents = [NSMutableArray new];
    }

    return self;
}

- (void)push:(id)object {
    [_contents addObject:object];
}

- (id)pop {
    id lastObject = [_contents lastObject];
    [_contents removeLastObject];
    return lastObject;
}

- (int)length {
    return _contents.count;
}


@end

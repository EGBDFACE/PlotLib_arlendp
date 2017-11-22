//
//  DFIHelperQueue.m
//  DFI
//
//  Created by vanney on 2017/3/8.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHelperQueue.h"

@interface DFIHelperQueue()
@property (nonatomic, strong) NSMutableArray *contents;
@end

@implementation DFIHelperQueue

- (instancetype)init {
    if (self = [super init]) {
        _contents = [NSMutableArray new];
    }

    return self;
}

- (void)enqueue:(id)object {
    [_contents addObject:object];
}

- (id)dequeue {
    id result = [_contents firstObject];
    if (result) {
        [_contents removeObjectAtIndex:0];
    }

    return result;
}


@end

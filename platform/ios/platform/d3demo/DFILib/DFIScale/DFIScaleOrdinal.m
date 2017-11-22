//
//  DFIScaleOrdinal.m
//  DFI
//
//  Created by vanney on 2017/5/6.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIScaleOrdinal.h"

@interface DFIScaleOrdinal()
@property (nonatomic, strong) NSMutableDictionary *map;
@property (nonatomic, strong) NSMutableDictionary *unknown;
@end


@implementation DFIScaleOrdinal

@synthesize domain = _domain;

- (instancetype)initWithRange:(NSArray *)range {
    if (self = [super init]) {
        if (range != nil) {
            self.range = [range mutableCopy];
            _map = [NSMutableDictionary new];
            _unknown = [@{@"name": @"implicit"} mutableCopy];
            _domain = [NSMutableArray new];
        }
    }

    return self;
}

- (id)scale:(id)d {
    id value = [_map objectForKey:d];
    if (value == nil) {
        // TODO - more precise
        if ([[_unknown objectForKey:@"name"] isEqualToString:@"implicit"]) {
            [_domain addObject:d];
            value = @(_domain.count - 1);
            [_map setObject:value forKey:d];
        } else {
            // TODO -
            return nil;
        }
    }
    return [self.range objectAtIndex:[value intValue] % self.range.count];
}

- (void)setDomain:(NSMutableArray *)domain {
    int i = -1;
    int n = domain.count;
    _map = [NSMutableDictionary new];
    _domain = [NSMutableArray arrayWithCapacity:n];
    while (++i < n) {
        NSString *curDomain = [domain objectAtIndex:i];
        if (![_map objectForKey:curDomain]) {
            [_domain addObject:curDomain];
            [_map setObject:@(_domain.count - 1) forKey:curDomain];
        }
    }
}


@end

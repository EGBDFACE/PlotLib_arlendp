//
//  DFIChordRibbon.m
//  DFI
//
//  Created by vanney on 2017/5/3.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIChordRibbon.h"
#import "DFIPath.h"


@interface DFIChordRibbon()
@property (nonatomic, strong) NSString *originalDataName;
@property (nonatomic, assign) CGFloat originalDataFromValue;
@property (nonatomic, assign) CGFloat originalDataToValue;
@end


@implementation DFIChordRibbon

- (instancetype)init {
    if (self = [super init]) {
        _context = nil;
        _source = ^id(NSDictionary *data) {
            return [data objectForKey:@"source"];
        };
        _target = ^id(NSDictionary *data) {
            return [data objectForKey:@"target"];
        };
        _radius = ^CGFloat(NSDictionary *data) {
            return [[data objectForKey:@"radius"] floatValue];
        };
        _startAngle = ^CGFloat(NSDictionary *data) {
            return [[data objectForKey:@"startAngle"] floatValue];
        };
        _endAngle = ^CGFloat(NSDictionary *data) {
            return [[data objectForKey:@"endAngle"] floatValue];
        };
    }

    return self;
}

- (void)loadRibbonWithData:(id)data {
    id s = _source(data);
    id t = _target(data);
    CGFloat sr = _radius(s);
    CGFloat sa0 = _startAngle(s) - M_PI / 2;
    CGFloat sa1 = _endAngle(s) - M_PI / 2;
    CGFloat sx0 = sr * cos(sa0);
    CGFloat sy0 = sr * sin(sa0);
    CGFloat tr = _radius(t);
    CGFloat ta0 = _startAngle(t) - M_PI / 2;
    CGFloat ta1 = _endAngle(t) - M_PI / 2;

    if (_context == nil) {
        _context = [[DFIPath alloc] init];
    }

    [_context moveTo:CGPointMake(sx0, sy0)];
    [_context arcWithCenter:CGPointZero startAngle:sa0 endAngle:sa1 andRadius:sr clockwise:NO];

    if (sa0 != ta0 || sa1 != ta1) {
        [_context quadraticCurveTo:CGPointMake(tr * cos(ta0), tr * sin(ta0)) withControl:CGPointZero];
        [_context arcWithCenter:CGPointZero startAngle:ta0 endAngle:ta1 andRadius:tr clockwise:NO];
    }
    [_context quadraticCurveTo:CGPointMake(sx0, sy0) withControl:CGPointZero];
    [_context closePath];
}


#pragma mark - Description D3 Data

- (NSDictionary *)dfiDescription {
    return @{
            @"Name": _originalDataName,
            @"FromValue": @(_originalDataFromValue),
            @"ToValue": @(_originalDataToValue)
    };
}

- (void)loadOriginalData:(NSDictionary *)data {
    _originalDataName = [data objectForKey:@"name"] ? [data objectForKey:@"name"] : @"iD3 - Ribbon";
    _originalDataFromValue = [data objectForKey:@"from"] ? [[data objectForKey:@"from"] floatValue] : 0.0f;
    _originalDataToValue = [data objectForKey:@"to"] ? [[data objectForKey:@"to"] floatValue] : 0.0f;
}


@end

//
//  DFIBaseModel.m
//  DFI
//
//  Created by vanney on 2017/6/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIBaseModel.h"
#import <UIKit/UIKit.h>

@interface DFIBaseModel()
@property (nonatomic, strong) NSString *originalDataName;
@property (nonatomic, assign) CGFloat originalDataValue;
@end

@implementation DFIBaseModel

- (void)loadOriginalData:(NSDictionary *)data {
    _originalDataName = [data objectForKey:@"name"] ? [data objectForKey:@"name"] : @"iD3 - BaseModel";
    _originalDataValue = [data objectForKey:@"value"] ? [[data objectForKey:@"value"] floatValue] : 0.0f;
}

- (NSDictionary *)dfiDescription {
    return @{
            @"Name": _originalDataName,
            @"Value": @(_originalDataValue)
    };
}

@end

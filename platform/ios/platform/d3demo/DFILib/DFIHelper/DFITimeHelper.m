//
//  DFITimeHelper.m
//  DFI
//
//  Created by vanney on 2017/4/24.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFITimeHelper.h"

@implementation DFITimeHelper

static NSDateFormatter *dateFormatter = nil;
static NSDate *resultDate = nil;


+ (NSDate *)dateFromString:(NSString *)string andFormat:(NSString *)format {
    [DFITimeHelper p_excuteOnce];
    [dateFormatter setDateFormat:format];
    resultDate = [dateFormatter dateFromString:string];
    return resultDate;
}

+ (void)p_excuteOnce {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (dateFormatter == nil) {
            dateFormatter = [[NSDateFormatter alloc] init];
            dateFormatter.locale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US"];
        }
        if (resultDate == nil) {
            resultDate = [[NSDate alloc] init];
        }
    });
}


@end

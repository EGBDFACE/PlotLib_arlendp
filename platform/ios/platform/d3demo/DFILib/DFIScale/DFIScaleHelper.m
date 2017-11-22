//
//  DFIScaleHelper.m
//  DFI
//
//  Created by vanney on 2017/5/8.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIScaleHelper.h"

@implementation DFIScaleHelper

static NSRegularExpression *rex = nil;

+ (NSArray *)category10 {
    return [DFIScaleHelper p_colorsWithString:@"1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"];
}

+ (NSArray *)category20 {
    return [DFIScaleHelper p_colorsWithString:@"1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5"];
}

+ (NSArray *)category20b {
    return [DFIScaleHelper p_colorsWithString:@"393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6"];
}

+ (NSArray *)category20c {
    return [DFIScaleHelper p_colorsWithString:@"3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9"];
}

+ (NSArray *)p_colorsWithString:(NSString *)string {
    rex = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@".{6}"] options:0 error:nil];
    NSRange range = NSMakeRange(0, string.length);
    NSArray *matchResult = [rex matchesInString:string options:NSMatchingCompleted range:range];
    int n = matchResult.count;
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:n];
    for (int i = 0; i < n; ++i) {
        NSTextCheckingResult *curMatch = [matchResult objectAtIndex:i];
        NSString *curString = [string substringWithRange:[curMatch range]];
        [result addObject:[NSString stringWithFormat:@"#%@", curString]];
    }

    return result;
}


@end

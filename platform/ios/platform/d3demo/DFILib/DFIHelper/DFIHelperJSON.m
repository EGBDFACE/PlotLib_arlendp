//
//  DFIHelperJSON.m
//  DFI
//
//  Created by vanney on 2017/2/12.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHelperJSON.h"

@implementation DFIHelperJSON

+ (NSMutableArray *)readJSONArrayFromFile:(NSString *)filename {
    NSString *filePath = [[NSBundle mainBundle] pathForResource:filename ofType:@"json"];
    NSData *JSONData = [NSData dataWithContentsOfFile:filePath];
    NSMutableArray *JSONArray = [NSJSONSerialization JSONObjectWithData:JSONData options:NSJSONReadingMutableContainers error:nil];
    return JSONArray;
}

+ (NSMutableDictionary *)readJSONDictFromFile:(NSString *)filename {
    NSString *filePath = [[NSBundle mainBundle] pathForResource:filename ofType:@"json"];
    NSData *JSONData = [NSData dataWithContentsOfFile:filePath];
    NSMutableDictionary *JSONDict = [NSJSONSerialization JSONObjectWithData:JSONData options:NSJSONReadingMutableContainers error:nil];
    return JSONDict;
}


@end

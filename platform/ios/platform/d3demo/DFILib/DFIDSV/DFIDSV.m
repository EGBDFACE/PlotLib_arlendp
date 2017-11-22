//
//  DFIDSV.m
//  DFI
//
//  Created by vanney on 2017/2/22.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDSV.h"
#import "NSString+MD5.h"

@interface DFIDSV() {
    NSString *_EOF;
    NSString *_EOL;
}
@property (nonatomic, strong) NSRegularExpression *reFormat;
//@property (nonatomic, strong) NSString *delimiterCode;
@property(nonatomic, assign) char delimiterCode;
@end


@implementation DFIDSV

#pragma mark - public method

- (instancetype)initWithDelimiter:(NSString *)delimiter {
    if (self = [super init]) {
        _EOF = [@"EOF" MD5];
        _EOL = [@"EOL" MD5];
        _result = [[DFIDSVParseResult alloc] init];
        NSError *error;
        NSString *pattern = [NSString stringWithFormat:@"[\"%@\n]", delimiter];
        _reFormat = [NSRegularExpression regularExpressionWithPattern:pattern options:nil error:&error];
        if (error) {
            // TODO - maybe not crash, but alter user
            NSLog(@"vanney code log : %@", [error description]);
            exit(1);
        }
        _delimiterCode = [delimiter characterAtIndex:0];
    }

    return self;
}

- (void)parseWithText:(NSString *)text {
    _result.rows = [self parseRowsWithText:text];
}

- (void)parseWithTextFileName:(NSString *)fileName andFileSuffix:(NSString *)suffix {
    NSString *filePath = [[NSBundle mainBundle] pathForResource:fileName ofType:suffix];
    NSString *text = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    [self parseWithText:text];
}


- (NSMutableArray *)parseRowsWithText:(NSString *)text {
    int curLineIndex = 0;
    int curCharIndex = 0;
    int eol = 0;
    NSString *curToken;

    NSMutableArray *rows = [NSMutableArray new]; // output rows

    while (![curToken = [self pTokenWithText:text curCharIndex:&curCharIndex andEol:&eol] isEqualToString:_EOF]) {
        NSMutableArray *tempArray = [NSMutableArray new];
        while (![curToken isEqualToString:_EOL] && ![curToken isEqualToString:_EOF]) {
            NSString *tempString = [curToken copy];
            [tempArray addObject:tempString];
            curToken = [self pTokenWithText:text curCharIndex:&curCharIndex andEol:&eol];
        }
        // TODO - maybe need delegate
        NSMutableDictionary *rowDict = [self pFuncInsideParseWithRowData:tempArray andRowNum:curLineIndex++];
        if (rowDict == nil) {
            continue;
        }
        [rows addObject:rowDict];
    }

    return rows;
}


// TODO - format dsv, from JSON to DSV
- (void)format {

}

- (void)formatValues {

}


#pragma mark - private method

- (NSString *)pTokenWithText:(NSString *)text curCharIndex:(int *)curCharIndexPointer andEol:(int *)eol {
    int textLength = text.length;
    if (*curCharIndexPointer >= textLength) {
        return _EOF;
    }

    if (*eol == 1) {
        *eol = 0;
        return _EOL;
    }

    int j = *curCharIndexPointer;
    char curChar;
    // special case: quotes
    if ([text characterAtIndex:j] == 34) {
        // TODO - deal with quotes
        return nil;
    }

    // common case: find next delimiter or newline
    while (*curCharIndexPointer < textLength) {
        int k = 1;
        curChar = [text characterAtIndex:(*curCharIndexPointer)++];
        if (curChar == 10) { // \n
            *eol = 1;
        } else if (curChar == 13) { // \r | \r\n
            *eol = 1;
            if ([text characterAtIndex:*curCharIndexPointer] == 10) {
                (*curCharIndexPointer)++;
                ++k;
            }
        } else if (curChar != _delimiterCode) {
            continue;
        }
        return [text substringWithRange:NSMakeRange(j, *curCharIndexPointer - k - j)];
    }

    // special case: last token
    return [text substringFromIndex:j];
}


// TODO - result maybe not property
- (NSMutableDictionary *)pFuncInsideParseWithRowData:(NSMutableArray *)row andRowNum:(int)index {
    if (index == 0) {
        _result.columns = row;
        return nil;
    } else {
        //return [self pConvertWithRowData:row andRowNum:index - 1];
        int curColumns = row.count;
        NSMutableDictionary *rowDict = [NSMutableDictionary new];
        for (int i = 0; i < curColumns; ++i) {
            [rowDict setObject:row[i] forKey:_result.columns[i]];
        }

        return rowDict;
    }
}

//- (NSMutableArray *)pConvertWithRowData:(NSMutableArray *)row andRowNum:(int)index {
//    return nil;
//}

@end

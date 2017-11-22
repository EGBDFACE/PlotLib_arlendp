//
//  DFIShapeBarStackView.m
//  DFI
//
//  Created by vanney on 2017/4/27.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIShapeBarStackView.h"
#import "DFIShapeStack.h"

@implementation DFIShapeBarStackView

// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.opaque = NO;
        self.backgroundColor = [UIColor whiteColor];
    }

    return self;
}

- (void)drawRect:(CGRect)rect {
    // Drawing code
    CGFloat height = rect.size.height;
    CGFloat width = rect.size.width;

    int n = self.series.count;
    CGFloat sum = 40000000;
    CGFloat xAxis = 40.0f;
    for (int i = 0; i < n; ++i) {
        UIColor *curColor = [self.colors objectAtIndex:i];
        DFIShapeStackRecord *curRecord = [self.series objectAtIndex:i];

        CGContextRef context = UIGraphicsGetCurrentContext();
        [curColor setFill];

        NSArray *curData = curRecord.data;
        int m = curData.count;
        for (int j = 0; j < m; ++j) {
            NSArray *curRectData = [curData objectAtIndex:j];
            CGFloat low = height - [[curRectData firstObject] floatValue] / sum * height;
            CGFloat high = height - [[curRectData objectAtIndex:1] floatValue] / sum * height;
            CGRect curRect = CGRectMake(xAxis, high, 15, low - high);
            CGContextFillRect(context, curRect);
            xAxis += 25.0;
        }

        xAxis = 40.0f;
    }
}

@end

//
//  DFIDemoLineViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoLineViewController.h"
#import "DFIShapeLine.h"
#import "DFIGL2BaseView.h"
#import "DFITimeHelper.h"
#import "DFIDSV.h"
#import "DFIGL2BaseLayer.h"
#import "DFIColor.h"


@interface DFIDemoLineViewController ()
@end

@implementation DFIDemoLineViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    DFIShapeLine *line = [[DFIShapeLine alloc] init];
    line.curveType = DFIShapeCurveTypeStep;

    DFIGL2BaseView *lineView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];

    [self.view addSubview:lineView];

    CGFloat height = lineView.bounds.size.height;
    line.y = ^CGFloat (NSDictionary *data) {
        NSString *yStr = [data objectForKey:@"close"];
        CGFloat yInit = [yStr floatValue];
        CGFloat y = height * 0.9 - yInit / 800.0f * height * 0.8;
        return y;
    };

    NSDate *startTime = [DFITimeHelper dateFromString:@"2007-01-01" andFormat:@"yyyy-MM-dd"];
    NSDate *endTime = [DFITimeHelper dateFromString:@"2013-12-31" andFormat:@"yyyy-MM-dd"];
    CGFloat width = [endTime timeIntervalSinceDate:startTime];
    CGFloat screenWidth = lineView.bounds.size.width;
    line.x = ^CGFloat (NSDictionary *data) {
        NSString *xDate = [data objectForKey:@"date"];
        NSDate *curDate = [DFITimeHelper dateFromString:xDate andFormat:@"dd-MMM-yy"];
        CGFloat curWidth = [curDate timeIntervalSinceDate:startTime];
        CGFloat x = screenWidth * 0.1 + curWidth / width * screenWidth * 0.8;
        NSLog(@"vanney code log : x is %f", x);
        return x;
    };
    DFIDSV *lineDSV = [[DFIDSV alloc] initWithDelimiter:@"\t"];
    [lineDSV parseWithTextFileName:@"linedata" andFileSuffix:@"tsv"];
    [line loadLineWithDSVParseResult:lineDSV.result];

    DFIGL2BaseLayer *lineLayer = [DFIGL2BaseLayer layer];
    lineLayer.dfiPath = line.context;
    lineLayer.lineWidth = 1.5f;
    lineLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    lineLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];

    [lineView addDFILayer:lineLayer];

    self.navigationItem.title = @"iD3 - Line";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLayoutSubviews {
    self.navigationController.navigationBar.translucent = NO;
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end

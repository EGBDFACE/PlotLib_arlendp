//
//  DFIDemoBarStackViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoBarStackViewController.h"
#import "DFIShapeStack.h"
#import "DFIGL2BaseView.h"
#import "DFIDSV.h"
#import "DFIColor.h"
#import "DFIPath.h"
#import "DFIGL2BaseLayer.h"
#import "DFITimeHelper.h"
#import "DFIShapeArea.h"
#import "DFIBaseModel.h"

@interface DFIDemoBarStackViewController ()

@property (nonatomic, strong) DFIGL2BaseView *stackView;
@property (nonatomic, strong) DFIGL2BaseView *areaView;

@end

@implementation DFIDemoBarStackViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    NSLog(@"vanney code log : bar stack vc loaded");

    if (_type == 1) {
        [self p_setupTypeOne];
    } else {
        [self p_setupTypeTwo];
    }

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - Stack";
}

- (void)p_setupTypeOne {
    DFIDSV *barStackDSV = [[DFIDSV alloc] initWithDelimiter:@","];
    [barStackDSV parseWithTextFileName:@"bar" andFileSuffix:@"csv"];

    NSMutableArray *resultArray = barStackDSV.result.rows;
    int rows = resultArray.count;
    NSMutableArray *resultKeys = barStackDSV.result.columns;
    NSString *firstKey = [resultKeys firstObject];
    for (int j = 0; j < rows; ++j) {
        NSMutableDictionary *curRow = [resultArray objectAtIndex:j];
        __block CGFloat sum = 0;
        [curRow enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
            if (![key isEqualToString:firstKey]) {
                sum += [obj floatValue];
            }
        }];
        NSLog(@"vanney code log : cur sum for %d is %f", j, sum);
        [curRow setObject:@(sum) forKey:@"vanneySort"];
    }

    NSArray *sortedArray = [resultArray sortedArrayUsingComparator:^NSComparisonResult(NSDictionary *a, NSDictionary *b) {
        CGFloat aValue = [[a objectForKey:@"vanneySort"] floatValue];
        CGFloat bValue = [[b objectForKey:@"vanneySort"] floatValue];
        if (aValue <= bValue) {
            return NSOrderedAscending;
        } else {
            return NSOrderedDescending;
        }
    }];

    [sortedArray enumerateObjectsUsingBlock:^(NSMutableDictionary *obj, NSUInteger idx, BOOL *stop) {
        [obj removeObjectForKey:@"vanneySort"];
    }];

    DFIShapeStack *stack = [[DFIShapeStack alloc] init];
    stack.keys = ^NSArray *(id data) {
        return [resultKeys subarrayWithRange:NSMakeRange(1, resultKeys.count - 1)];
    };
    NSArray *stackResult = [stack loadStackWithData:sortedArray];

    _stackView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _stackView.isOrderedView = YES;
    [self.view addSubview:_stackView];

    CGFloat height = _stackView.bounds.size.height;
    CGFloat sum = 40000000;
    __block CGFloat xAxis = 20.0f;
    NSArray *colors = @[
            [DFIColor colorWithFormat:@"#98abc5"],
            [DFIColor colorWithFormat:@"#8a89a6"],
            [DFIColor colorWithFormat:@"#7b6888"],
            [DFIColor colorWithFormat:@"#6b486b"],
            [DFIColor colorWithFormat:@"#a05d56"],
            [DFIColor colorWithFormat:@"#d0743c"],
            [DFIColor colorWithFormat:@"#ff8c00"]
    ];

    [stackResult enumerateObjectsUsingBlock:^(DFIShapeStackRecord *obj, NSUInteger idx, BOOL *stop) {
        NSArray *curData = obj.data;
        [curData enumerateObjectsUsingBlock:^(NSArray *obj1, NSUInteger idx1, BOOL *stop1) {
            CGFloat low = height - [[obj1 firstObject] floatValue] / sum * height;
            CGFloat high = height - [[obj1 objectAtIndex:1] floatValue] / sum * height;
            DFIPath *path = [[DFIPath alloc] init];
            [path rectWithPoint:CGPointMake(xAxis, high) width:15 andHeight:low - high];
            xAxis += 19.0f;

            DFIBaseModel *curModel = [[DFIBaseModel alloc] init];
            CGFloat lowValue = [[obj1 firstObject] floatValue];
            CGFloat highValue = [[obj1 objectAtIndex:1] floatValue];
            [curModel loadOriginalData:@{
                    @"name": obj.key,
                    @"value": @(highValue - lowValue)
            }];

            DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
            curLayer.originalPosition = CGPointZero;
            curLayer.dfiPath = path;
            curLayer.dfiFillColor = [colors objectAtIndex:idx];
            curLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
            curLayer.d3Model = curModel;

            [_stackView addDFILayer:curLayer];
        }];

        xAxis = 20.0f;
    }];
}

- (void)p_setupTypeTwo {
    DFIDSV *browserDSV = [[DFIDSV alloc] initWithDelimiter:@"\t"];
    [browserDSV parseWithTextFileName:@"browser" andFileSuffix:@"tsv"];
    NSMutableArray *resultArray = browserDSV.result.rows;
    NSMutableArray *resultKeys = browserDSV.result.columns;

    DFIShapeStack *browserStack = [[DFIShapeStack alloc] init];
    browserStack.keys = ^NSArray *(id data) {
        return [resultKeys subarrayWithRange:NSMakeRange(1, resultKeys.count - 1)];
    };
    browserStack.xKey = @"date";
    NSMutableArray *browserAreas = [browserStack loadStackWithData:resultArray];

    _areaView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _areaView.isOrderedView = YES;
    [self.view addSubview:_areaView];

    NSDate *startTime = [DFITimeHelper dateFromString:@"2015-06-01" andFormat:@"yyyy-MM-dd"];
    NSDate *endTime = [DFITimeHelper dateFromString:@"2016-07-01" andFormat:@"yyyy-MM-dd"];
    CGFloat width = [endTime timeIntervalSinceDate:startTime];
    CGFloat screenWidth = _areaView.bounds.size.width;
    CGFloat screenHeight = _areaView.bounds.size.height;

    NSArray *colors = @[
            [DFIColor colorWithFormat:@"#1f77b4"],
            [DFIColor colorWithFormat:@"#ff7f0e"],
            [DFIColor colorWithFormat:@"#2ca02c"],
            [DFIColor colorWithFormat:@"#d62728"],
            [DFIColor colorWithFormat:@"#9467bd"],
            [DFIColor colorWithFormat:@"#8c564b"],
            [DFIColor colorWithFormat:@"#e377c2"],
            [DFIColor colorWithFormat:@"#7f7f7f"],
    ];

    [browserAreas enumerateObjectsUsingBlock:^(DFIShapeStackRecord *obj, NSUInteger idx, BOOL *stop) {
        DFIShapeArea *curArea = [[DFIShapeArea alloc] init];
        curArea.x0 = ^CGFloat (NSArray *data) {
            NSString *xDate = [data lastObject];
            NSDate *curDate = [DFITimeHelper dateFromString:xDate andFormat:@"yyyy MMM d"];
            CGFloat curWidth = [curDate timeIntervalSinceDate:startTime];
            CGFloat x = screenWidth * 0.1 + curWidth / width * screenWidth * 0.8;
            return x;
        };
        curArea.y0 = ^CGFloat (NSArray *data) {
            CGFloat y = screenHeight * 0.9 - [[data firstObject] floatValue] / 100.0f * 0.8 * screenHeight;
            return y;
        };
        curArea.y1 = ^CGFloat (NSArray *data) {
            CGFloat y = screenHeight * 0.9 - [[data objectAtIndex:1] floatValue] / 100.0f * 0.8 * screenHeight;
            return y;
        };

        [curArea loadAreaWithData:obj.data];

        DFIBaseModel *curModel = [[DFIBaseModel alloc] init];
        [curModel loadOriginalData:@{
                @"name": obj.key
        }];

        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        curLayer.originalPosition = CGPointZero;
        curLayer.dfiPath = curArea.context;
        curLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
        curLayer.dfiFillColor = [colors objectAtIndex:idx];
        curLayer.d3Model = curModel;

        [_areaView addDFILayer:curLayer];
    }];
}

- (void)viewDidLayoutSubviews {
    self.navigationController.navigationBar.translucent = NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)p_setupButton {
    UIBarButtonItem *resetButton = [[UIBarButtonItem alloc] initWithTitle:@"Reset" style:UIBarButtonItemStylePlain target:self action:@selector(resetView)];
    self.navigationItem.rightBarButtonItem = resetButton;
}

- (void)resetView {
    if (_type == 1) {
        [_stackView reset];
    } else {
        [_areaView reset];
    }
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

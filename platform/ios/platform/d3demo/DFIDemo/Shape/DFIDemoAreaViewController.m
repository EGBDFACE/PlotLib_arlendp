//
//  DFIDemoAreaViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoAreaViewController.h"
#import "DFIShapeArea.h"
#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"
#import "DFIColor.h"

@interface DFIDemoAreaViewController ()

@end

@implementation DFIDemoAreaViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    DFIGL2BaseView *areaView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    [self.view addSubview:areaView];

    NSMutableArray *lineData = [NSMutableArray arrayWithCapacity:40];
    for (int i = 0; i < 40; ++i) {
        if (i % 5 == 0) {
            [lineData addObject:[NSNull null]];
        } else {
            CGFloat x = i / 39.0f;
            CGFloat y = (sin(i / 3.0f) + 2) / 4;
            NSArray *obj = @[@(x), @(y)];
            [lineData addObject:obj];
        }
    }

    DFIShapeArea *area = [[DFIShapeArea alloc] init];
    CGFloat height = areaView.bounds.size.height;
    CGFloat width = areaView.bounds.size.width;

    area.x0 = ^CGFloat (NSArray *data) {
        CGFloat curX = [[data firstObject] floatValue];
        CGFloat x = 0.1 * width + curX * width * 0.8;
        return x;
    };
    area.y1 = ^CGFloat(NSArray *data) {
        CGFloat curY = [[data objectAtIndex:1] floatValue];
        CGFloat y = height - curY * height;
        return y;
    };
    area.y0 = ^CGFloat(id data) {
        return 0.9 * height;
    };

    area.defined = ^BOOL(id data) {
        if (data == [NSNull null]) {
            return NO;
        } else {
            return YES;
        }
    };
    [area loadAreaWithData:lineData];

    DFIGL2BaseLayer *areaLayer = [DFIGL2BaseLayer layer];
    areaLayer.dfiPath = area.context;
    areaLayer.dfiFillColor = [DFIColor colorWithFormat:@"darkgrey"];
    areaLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];

    [areaView addDFILayer:areaLayer];

    self.navigationItem.title = @"iD3 - Area";
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

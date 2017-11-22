//
//  DFIDemoPieViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoPieViewController.h"
#import "DFIShapePie.h"
#import "DFIDSV.h"
#import "DFIGL2BaseView.h"
#import "DFIShapeArc.h"
#import "DFIGL2BaseLayer.h"
#import "DFIColor.h"

@interface DFIDemoPieViewController ()
@property (nonatomic, strong) DFIShapePie *pie;
@property (nonatomic, strong) NSArray *colors;
@property (nonatomic, strong) DFIGL2BaseView *pieView;
@end

@implementation DFIDemoPieViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    [self p_setupPieData];
    [self p_setupPieColor];
    [self p_setupPieView];

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - Pie";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLayoutSubviews {
    self.navigationController.navigationBar.translucent = NO;
}

- (void)p_setupButton {
    UIBarButtonItem *resetButton = [[UIBarButtonItem alloc] initWithTitle:@"Reset" style:UIBarButtonItemStylePlain target:self action:@selector(resetView)];
    self.navigationItem.rightBarButtonItem = resetButton;
}

- (void)resetView {
    [_pieView reset];
}

- (void)p_setupPieData {
    _pie = [[DFIShapePie alloc] init];
    _pie.value = ^float (NSDictionary *partPie) {
        return [partPie objectForKey:@"population"] ? [[partPie objectForKey:@"population"] floatValue] : 0.0f;
    };
    DFIDSV *dsv = [[DFIDSV alloc] initWithDelimiter:@"\t"];
    [dsv parseWithTextFileName:@"data" andFileSuffix:@"tsv"];
    [_pie loadPieWithDSVParseResult:dsv.result];
}

- (void)p_setupPieColor {
    _colors = @[
            @"#98abc5",
            @"#8a89a6",
            @"#7b6888",
            @"#6b486b",
            @"#a05d56",
            @"#d0743c",
            @"#ff8c00",
    ];
}

- (void)p_setupPieView {
    _pieView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _pieView.isOrderedView = YES;
    //_pieView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height)];
    [self.view addSubview:_pieView];

    NSArray *arcs = _pie.arcs;
    [arcs enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
        DFIShapeArc *curArc = [[DFIShapeArc alloc] init];
        curArc.outerRadius = MIN(_pieView.bounds.size.height, _pieView.bounds.size.width) / 2 - 40.0f;
        curArc.innerRadius = 20.0f;
        [curArc loadArcWithData:obj];

        NSDictionary *originalData = @{
                @"name": [[obj objectForKey:@"data"] objectForKey:@"age"],
                @"value": [[obj objectForKey:@"data"] objectForKey:@"population"]
        };
        [curArc loadOriginalData:originalData];

        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        curLayer.originalPosition = _pieView.center;
        curLayer.dfiPath = curArc.path;
        curLayer.dfiFillColor = [DFIColor colorWithFormat:(NSString *) [_colors objectAtIndex:idx]];
        curLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"#234567"];
        curLayer.d3Model = curArc;

        [_pieView addDFILayer:curLayer];
    }];
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

//
//  DFIDemoPackViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoPackViewController.h"
#import "DFIScaleOrdinal.h"
#import "DFIInterPolateRGB.h"
#import "DFIHierarchyPack.h"

#import "DFIDSV.h"
#import "DFIHierarchyStratify.h"
#import "DFIHierarchyNode+Treemap.h"

#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"
#import "DFIPath.h"
#import "DFIColor.h"

@interface DFIDemoPackViewController ()
@property (nonatomic, strong) DFIScaleOrdinal *ordinal;
@property (nonatomic, strong) DFIHierarchyPack *pack;
@property (nonatomic, strong) DFIGL2BaseView *packView;
@end

@implementation DFIDemoPackViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    [self p_setupPackData];
    [self p_setupPackColor];
    [self p_setupPackView];

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - Pack";
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
    [_packView reset];
}

- (void)p_setupPackColor {
    NSArray *c10 = @[
            @"#b73779",
            @"#e75263",
            @"#fc8961",
            @"#fec488",
            @"#fcfdbf",
    ];
    NSMutableArray *colors = [NSMutableArray arrayWithCapacity:10];
    [c10 enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL *stop) {
        DFIInterPolateRGB *curInterpolate = [[DFIInterPolateRGB alloc] initWithStart:obj andEnd:@"#fff"];
        DFIColor *curColor = [curInterpolate interpolate:0.2f];
        [colors addObject:curColor];
    }];
    _ordinal = [[DFIScaleOrdinal alloc] initWithRange:colors];
}

- (void)p_setupPackData {
    DFIDSV *parseCSV = [[DFIDSV alloc] initWithDelimiter:@","];
    [parseCSV parseWithTextFileName:@"cluster" andFileSuffix:@"csv"];
    DFIDSVParseResult *result = parseCSV.result;
    DFIHierarchyStratify *stratify = [[DFIHierarchyStratify alloc] init];
    stratify.parentID = ^NSString *(DFIHierarchyNode *node) {
        NSString *nodeID = node.id;
        NSRange range = [nodeID rangeOfString:@"." options:NSBackwardsSearch];
        if (range.length <= 0) {
            return nil;
        } else {
            return [nodeID substringToIndex:range.location];
        }
    };
    [stratify loadDSVData:result];
    [stratify.root sum:^float(NSMutableDictionary *dictionary) {
        return [[dictionary objectForKey:@"value"] floatValue];
    }];
    [stratify.root sort:^BOOL(DFIHierarchyNode *a, DFIHierarchyNode *b) {
        if (a.value < b.value) {
            return YES;
        } else {
            return NO;
        }
    }];

    _pack = [[DFIHierarchyPack alloc] init];
    [_pack size:CGSizeMake(self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _pack.padding = 3.0f;
    [_pack loadRootData:stratify.root];
}

- (void)p_setupPackView {
    _packView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    [self.view addSubview:_packView];

    NSArray *nodes = [_pack.root descendants];
    [nodes enumerateObjectsUsingBlock:^(DFIHierarchyNode *obj, NSUInteger idx, BOOL *stop) {
        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        curLayer.dfiFillColor = [_ordinal scale:@(obj.depth)];
        DFIPath *path = [[DFIPath alloc] init];
        [path arcWithCenter:CGPointMake(obj.x, obj.y) startAngle:0 endAngle:2 * M_PI andRadius:obj.radius clockwise:YES];
        curLayer.dfiPath = path;
        curLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"#234567"];
        curLayer.d3Model = obj;

        [_packView addDFILayer:curLayer];
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

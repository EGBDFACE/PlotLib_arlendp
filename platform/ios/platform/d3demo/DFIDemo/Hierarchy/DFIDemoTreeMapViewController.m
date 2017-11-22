//
//  DFIDemoTreeMapViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoTreeMapViewController.h"
#import "DFIHelperJSON.h"
#import "DFIHierarchyTreemap.h"
#import "DFIHierarchy.h"
#import "DFIHierarchyNode+Treemap.h"

#import "DFIScaleOrdinal.h"
#import "DFIScaleHelper.h"
#import "DFIInterPolateRGB.h"

#import "DFIColor.h"
#import "DFIPath.h"
#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"

@interface DFIDemoTreeMapViewController ()
@property (nonatomic, strong) DFIHierarchyTreemap *treemap;
@property (nonatomic, strong) DFIScaleOrdinal *ordinal;
@property (nonatomic, strong) DFIGL2BaseView *treemapView;
@end

@implementation DFIDemoTreeMapViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    [self p_setupTreemapData];
    [self p_setupTreemapColor];
    [self p_setupTreemapView];

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - TreeMap";
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
    [_treemapView reset];
}

- (void)p_setupTreemapColor {
    NSArray *c20 = [DFIScaleHelper category20];
    NSMutableArray *colors = [NSMutableArray arrayWithCapacity:20];
    [c20 enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL *stop) {
        DFIInterPolateRGB *curInterpolate = [[DFIInterPolateRGB alloc] initWithStart:obj andEnd:@"#fff"];
        DFIColor *curColor = [curInterpolate interpolate:0.2f];
        [colors addObject:curColor];
    }];
    _ordinal = [[DFIScaleOrdinal alloc] initWithRange:colors];
}

- (void)p_setupTreemapData {
    NSMutableDictionary *treemapJSON = [DFIHelperJSON readJSONDictFromFile:@"treemap"];
    _treemap = [[DFIHierarchyTreemap alloc] init];
    [_treemap size:CGSizeMake(self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    //[_treemap size:self.view.bounds.size];
    _treemap.paddingInner = 1.0f;

    DFIHierarchy *hierarchy = [[DFIHierarchy alloc] init];
    [hierarchy createHierarchyWithData:treemapJSON];
    [hierarchy.root eachBefore:^(DFIHierarchyNode *node) {
        NSString *pName = (node.parent == nil) ? @"" : [NSString stringWithFormat:@"%@.", node.parent.id];
        node.id = [NSString stringWithFormat:@"%@%@", pName, [node.data objectForKey:@"name"]];
    }];
    [hierarchy.root sum:^float(NSMutableDictionary *dictionary) {
        if ([dictionary objectForKey:@"children"]) {
            return 0.0f;
        } else {
            return 1.0f;
        }
    }];

    [_treemap loadRootNode:hierarchy.root];
}

- (void)p_setupTreemapView {
    _treemapView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _treemapView.isOrderedView = YES;
    [self.view addSubview:_treemapView];

    NSArray *leaves = [_treemap.root leaves];
    [leaves enumerateObjectsUsingBlock:^(DFIHierarchyNode *leaf, NSUInteger idx, BOOL *stop) {
        DFIPath *dfiPath = [[DFIPath alloc] init];
        [dfiPath rectWithPoint:CGPointMake(leaf.x0, leaf.y0) width:leaf.x1 - leaf.x0 andHeight:leaf.y1 - leaf.y0];
        DFIColor *fillColor = [_ordinal scale:leaf.parent.id];

        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        //curLayer.originalPosition = CGPointMake(80.0f, 0.0f);
        curLayer.dfiPath = dfiPath;
        curLayer.dfiFillColor = fillColor;
        curLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"#FFFFFF"];
        curLayer.d3Model = leaf;

        [_treemapView addDFILayer:curLayer];
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

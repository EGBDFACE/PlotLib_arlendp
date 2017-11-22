//
//  DFIGLHierarchyTreemapViewController.m
//  DFI
//
//  Created by vanney on 2017/3/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyTreemapViewController.h"
#import "DFIHelperJSON.h"
#import "DFIHierarchyTreemap.h"
#import "DFIHierarchy.h"
#import "DFIHierarchyNode+Treemap.h"

#import "DFIGLHierarchyTreemapView.h"

#import "DFIScaleOrdinal.h"
#import "DFIScaleHelper.h"
#import "DFIInterPolateRGB.h"

#import "DFIColor.h"
#import "DFIPath.h"

@interface DFIGLHierarchyTreemapViewController ()
@property (nonatomic, strong) DFIGLHierarchyTreemapView *treemapView;
@end

@implementation DFIGLHierarchyTreemapViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    // deal with color
    NSArray *c20 = [DFIScaleHelper category20];
    NSMutableArray *colors = [NSMutableArray arrayWithCapacity:20];
    [c20 enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL *stop) {
        DFIInterPolateRGB *curInterpolate = [[DFIInterPolateRGB alloc] initWithStart:obj andEnd:@"#fff"];
        DFIColor *curColor = [curInterpolate interpolate:0.2f];
        [colors addObject:curColor];
    }];
    DFIScaleOrdinal *ordinal = [[DFIScaleOrdinal alloc] initWithRange:colors];

    NSMutableDictionary *treemapJSON = [DFIHelperJSON readJSONDictFromFile:@"treemap"];
    DFIHierarchyTreemap *treemap = [[DFIHierarchyTreemap alloc] init];
    [treemap size:self.view.bounds.size];
    treemap.paddingInner = 1.0f;

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

    [treemap loadRootNode:hierarchy.root];

    _treemapView = [[DFIGLHierarchyTreemapView alloc] initWithFrame:self.view.bounds andTree:treemap];
    [self.view addSubview:_treemapView];

    NSArray *leaves = [treemap.root leaves];
    [leaves enumerateObjectsUsingBlock:^(DFIHierarchyNode *leaf, NSUInteger idx, BOOL *stop) {
        DFIPath *dfiPath = [[DFIPath alloc] init];
        [dfiPath rectWithPoint:CGPointMake(leaf.x0, leaf.y0) width:leaf.x1 - leaf.x0 andHeight:leaf.y1 - leaf.y0];
        DFIColor *dfiColor = [ordinal scale:leaf.parent.id];
        [_treemapView addRectWithPath:dfiPath.path andFillColor:[dfiColor toUIColor]];
    }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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

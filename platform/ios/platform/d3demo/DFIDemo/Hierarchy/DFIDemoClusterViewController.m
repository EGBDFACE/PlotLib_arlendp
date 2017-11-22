//
//  DFIDemoClusterViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoClusterViewController.h"
#import "DFIHierarchyCluster.h"
#import "DFIHierarchyStratify.h"
#import "DFIDSV.h"
#import "DFIHierarchyNode.h"

#import "DFIGLHierarchyClusterView.h"

@interface DFIDemoClusterViewController ()
@property (nonatomic, strong) DFIHierarchyCluster *cluster;
@end

@implementation DFIDemoClusterViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

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

    _cluster = [[DFIHierarchyCluster alloc] init];
    [_cluster size:CGSizeMake(360, (self.view.bounds.size.height - 64.0f) / 2 - 40)];
    [_cluster loadRootNode:stratify.root];

    DFIGLHierarchyClusterView *clusterView = [[DFIGLHierarchyClusterView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f) andCluster:_cluster];
    [self.view addSubview:clusterView];

    self.navigationItem.title = @"iD3 - Cluster";
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

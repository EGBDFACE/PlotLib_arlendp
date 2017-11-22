//
//  DFIDemoTreeViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoTreeViewController.h"
#import "DFIHierarchyTree.h"
#import "DFIHierarchyStratify.h"
#import "DFIDSV.h"
#import "DFIHierarchyNode.h"

#import "DFIGLHierarchyTreeView.h"

@interface DFIDemoTreeViewController ()
@property (nonatomic, strong) DFIHierarchyTree *tree;
@end

@implementation DFIDemoTreeViewController

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

    _tree = [[DFIHierarchyTree alloc] init];
    [_tree size:CGSizeMake(self.view.bounds.size.width, self.view.bounds.size.height - 20 - 64.0f)];
    [_tree loadRootNode:stratify.root];

    DFIGLHierarchyTreeView *view = [[DFIGLHierarchyTreeView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f) andTree:_tree];
    [self.view addSubview:view];

    self.navigationItem.title = @"iD3 -Tree";
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

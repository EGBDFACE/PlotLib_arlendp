//
//  DFIGLHierarchyTreeViewController.m
//  DFI
//
//  Created by vanney on 2017/3/10.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLHierarchyTreeViewController.h"
#import "DFIHierarchyTree.h"
#import "DFIHierarchyStratify.h"
#import "DFIDSV.h"
#import "DFIHierarchyNode.h"

#import "DFIGLHierarchyTreeView.h"

@interface DFIGLHierarchyTreeViewController ()
@property (nonatomic, strong) DFIHierarchyTree *tree;
@end

@implementation DFIGLHierarchyTreeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    DFIDSV *parseCSV = [[DFIDSV alloc] initWithDelimiter:@","];
    [parseCSV parseWithTextFileName:_nodeFile andFileSuffix:_fileType];
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
    [_tree size:CGSizeMake(self.view.bounds.size.width, self.view.bounds.size.height - 20)];
    [_tree loadRootNode:stratify.root];

    DFIGLHierarchyTreeView *view = [[DFIGLHierarchyTreeView alloc] initWithFrame:self.view.bounds andTree:_tree];
    [self.view addSubview:view];
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

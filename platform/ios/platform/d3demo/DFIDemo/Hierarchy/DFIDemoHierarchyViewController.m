//
//  DFIDemoHierarchyViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoHierarchyViewController.h"
#import "DFIMenuCollectionViewCell.h"
#import "Colours.h"
#import <Masonry.h>

#import "DFIDemoClusterViewController.h"
#import "DFIDemoTreeViewController.h"
#import "DFIDemoTreeMapViewController.h"
#import "DFIDemoPackViewController.h"

static const NSString *kCellID = @"DFIMenuCell";

@interface DFIDemoHierarchyViewController () <UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout>
@property (nonatomic, strong) UICollectionView *collectionView;

@property (nonatomic, strong) DFIDemoClusterViewController *clusterViewController;
@property (nonatomic, strong) DFIDemoTreeViewController *treeViewController;
@property (nonatomic, strong) DFIDemoTreeMapViewController *treeMapViewController;
@property (nonatomic, strong) DFIDemoPackViewController *packViewController;
@end

@implementation DFIDemoHierarchyViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    self.view.backgroundColor = [UIColor colorFromHexString:@"#F3F3FA"];

    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    _collectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];
    _collectionView.backgroundColor = [UIColor clearColor];
    _collectionView.delegate = self;
    _collectionView.dataSource = self;
    [self.view addSubview:_collectionView];
    [_collectionView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.view);
    }];

    [_collectionView registerNib:[UINib nibWithNibName:@"DFIMenuCollectionViewCell" bundle:[NSBundle mainBundle]] forCellWithReuseIdentifier:kCellID];
    //[_collectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:@"test"];

    _clusterViewController = [[DFIDemoClusterViewController alloc] init];
    _treeViewController = [[DFIDemoTreeViewController alloc] init];
    _treeMapViewController = [[DFIDemoTreeMapViewController alloc] init];
    _packViewController = [[DFIDemoPackViewController alloc] init];

    self.navigationItem.title = @"iD3 - Hierarchy";

    // disable swipe back
    if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
        self.navigationController.interactivePopGestureRecognizer.enabled = NO;
    }
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


#pragma mark - UICollectionView Delegate && DataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return 4;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    return CGSizeMake(470, 210);
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {
    return UIEdgeInsetsMake(20, 140, 20, 140);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 40.0f;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
    return 40.0f;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    DFIMenuCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:kCellID forIndexPath:indexPath];
    cell.thumbnailView.backgroundColor = [UIColor steelBlueColor];
    switch (indexPath.row) {
        case 0:
            cell.menuLabel.text = @"Cluster";
            cell.thumbnailView.image = [UIImage imageNamed:@"cluster"];
            break;
        case 1:
            cell.menuLabel.text = @"Pack";
            cell.thumbnailView.image = [UIImage imageNamed:@"pack"];
            break;
        case 2:
            cell.menuLabel.text = @"Tree";
            cell.thumbnailView.image = [UIImage imageNamed:@"tree"];
            break;
        case 3:
            cell.menuLabel.text = @"Tree Map";
            cell.thumbnailView.image = [UIImage imageNamed:@"treemap"];
            break;
        default:
            break;
    }

    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    switch (indexPath.row) {
        case 0:
            [self.navigationController pushViewController:_clusterViewController animated:YES];
            break;
        case 1:
            [self.navigationController pushViewController:_packViewController animated:YES];
            break;
        case 2:
            [self.navigationController pushViewController:_treeViewController animated:YES];
            break;
        case 3:
            [self.navigationController pushViewController:_treeMapViewController animated:YES];
            break;
        default:
            break;
    }
}

@end

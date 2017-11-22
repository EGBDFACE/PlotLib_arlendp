//
//  DFIDemoShapeViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoShapeViewController.h"
#import <Masonry.h>
#import <Colours.h>
#import "DFIMenuCollectionViewCell.h"

#import "DFIDemoPieViewController.h"
#import "DFIDemoLineViewController.h"
#import "DFIDemoAreaViewController.h"
#import "DFIDemoBarStackViewController.h"
#import "DFIDemoSymbolViewController.h"

static const NSString *kCellID = @"DFIMenuCell";

@interface DFIDemoShapeViewController () <UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout>
@property (nonatomic, strong) UICollectionView *collectionView;

@property (nonatomic, strong) DFIDemoPieViewController *pieViewController;
@property (nonatomic, strong) DFIDemoLineViewController *lineViewController;
@property (nonatomic, strong) DFIDemoAreaViewController *areaViewController;
@property (nonatomic, strong) DFIDemoBarStackViewController *barStackViewController;
@property (nonatomic, strong) DFIDemoBarStackViewController *barStackViewController2;
@property (nonatomic, strong) DFIDemoSymbolViewController *symbolViewController;
@end

@implementation DFIDemoShapeViewController

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

    _pieViewController = [[DFIDemoPieViewController alloc] init];
    _lineViewController = [[DFIDemoLineViewController alloc] init];
    _areaViewController = [[DFIDemoAreaViewController alloc] init];
    _barStackViewController = [[DFIDemoBarStackViewController alloc] init];
    _barStackViewController.type = 1;
    _barStackViewController2 = [[DFIDemoBarStackViewController alloc] init];
    _barStackViewController2.type = 2;
    _symbolViewController = [[DFIDemoSymbolViewController alloc] init];

    self.navigationItem.title = @"iD3 - Shape";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLayoutSubviews {
    self.navigationController.navigationBar.translucent = NO;
}


#pragma mark - UICollectionView Delegate && DataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return 6;
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
            cell.menuLabel.text = @"Pie";
            cell.thumbnailView.image = [UIImage imageNamed:@"pie"];
            break;
        case 1:
            cell.menuLabel.text = @"Line";
            cell.thumbnailView.contentMode = UIViewContentModeScaleAspectFill;
            cell.thumbnailView.image = [UIImage imageNamed:@"line"];
            break;
        case 2:
            cell.menuLabel.text = @"Area";
            cell.thumbnailView.image = [UIImage imageNamed:@"area"];
            break;
        case 3:
            cell.menuLabel.text = @"Bar Stack One";
            cell.thumbnailView.contentMode = UIViewContentModeScaleAspectFill;
            cell.thumbnailView.image = [UIImage imageNamed:@"stack1"];
            break;
        case 4:
            cell.menuLabel.text = @"Bar Stack Two";
            cell.thumbnailView.image = [UIImage imageNamed:@"stack2"];
            break;
        case 5:
            cell.menuLabel.text = @"Symbol";
            cell.thumbnailView.image = [UIImage imageNamed:@"symbol"];
            break;
        default:
            break;
    }

    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    switch (indexPath.row) {
        case 0:
            [self.navigationController pushViewController:_pieViewController animated:YES];
            break;
        case 1:
            [self.navigationController pushViewController:_lineViewController animated:YES];
            break;
        case 2:
            [self.navigationController pushViewController:_areaViewController animated:YES];
            break;
        case 3:
            [self.navigationController pushViewController:_barStackViewController animated:YES];
            break;
        case 4:
            [self.navigationController pushViewController:_barStackViewController2 animated:YES];
            break;
        case 5:
            [self.navigationController pushViewController:_symbolViewController animated:YES];
            break;
        default:
            break;
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

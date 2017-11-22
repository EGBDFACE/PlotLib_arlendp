//
//  DFIMenuCollectionViewCell.m
//  DFI
//
//  Created by vanney on 2017/5/8.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIMenuCollectionViewCell.h"

@implementation DFIMenuCollectionViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code

    self.layer.masksToBounds = NO;
    //self.contentView.layer.masksToBounds = YES;
    self.layer.cornerRadius = 5.0f;
    //self.contentView.backgroundColor = [UIColor whiteColor];

    self.contentView.layer.shadowColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:1.0].CGColor;
    //self.layer.shadowColor = [UIColor redColor].CGColor;
    self.layer.shadowOpacity = 0.1f;
    self.layer.shadowOffset = CGSizeMake(1.0f, 0.0f);
    self.layer.shadowRadius = 1.0f;

    self.thumbnailView.layer.masksToBounds = YES;
    self.thumbnailView.layer.cornerRadius = 5.0f;
    self.thumbnailView.contentMode = UIViewContentModeCenter;
}

@end

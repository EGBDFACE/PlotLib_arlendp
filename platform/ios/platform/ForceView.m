//
//  ForceView.m
//  platform
//
//  Created by arlendp on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ForceView.h"
#import "DFIDemoForceViewController.h"

@implementation ForceView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    DFIDemoForceViewController *vc = [DFIDemoForceViewController new];
    [self addSubview:vc.view];
  }
  
  return self;
}

@end

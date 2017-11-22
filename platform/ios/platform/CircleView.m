//
//  CircleView.m
//  platform
//
//  Created by arlendp on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CircleView.h"
#import "DFIDemoChordViewController.h"

@implementation CircleView

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    DFIDemoChordViewController *vc = [DFIDemoChordViewController new];
    [self addSubview:vc.view];
  }
  
  return self;
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end

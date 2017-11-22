//
//  CocosTestView.h
//  platform
//
//  Created by arlendp on 2017/11/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GameViewController.h"
@interface CocosTestView : UIView
@property (strong, nonatomic) GameViewController *gameView;
- (void)closeView;

@end

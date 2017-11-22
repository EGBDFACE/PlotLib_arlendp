//
//  CocosTestView.m
//  platform
//
//  Created by arlendp on 2017/11/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CocosTestView.h"

@implementation CocosTestView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
- (id)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if(self != nil){
    GameViewController *gameView = [[GameViewController alloc] init];
    gameView.presentationStyle = @"Modal";
    gameView.demoNum = 1;
    self.gameView = gameView;
    [self addSubview:gameView.view];
  }
  return self;
}

- (void)closeView{
  [self.gameView closeGameScene];
  [self.gameView cleanUp];
}
@end

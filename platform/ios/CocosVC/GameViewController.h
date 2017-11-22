//
//  GameViewController.h
//  LasAlitas
//
//  Created by Raul on 9/11/15.
//
//

#import <UIKit/UIKit.h>

@interface GameViewController : UIViewController
-(void)showCoupon;
-(void)hideCoupon;
-(void)closeGameScene;
-(void)cleanUp;
@property (strong,nonatomic) NSString* presentationStyle;
@property (assign, nonatomic) NSInteger demoNum;
@end

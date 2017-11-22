//
//  DFIGL2BaseView.h
//  DFI
//
//  Created by vanney on 2017/5/11.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/***************************************************
 * D3 visual base view                             *
 * 1. move layer z index when highlight            *
 * 2. add d3 layer                                 *
 * 3. detect gesture and find container layer      *
 * 4. pass gesture info to layer                   *
 * 5. pass d3 output data to layer (maybe)         *
 ***************************************************/

#import <UIKit/UIKit.h>

@interface DFIGL2BaseView : UIView

- (void)reset;

- (void)addDFILayer:(CALayer *)layer;

// 判断view的layer的zPosition是否可以变动
@property (nonatomic, assign) BOOL isOrderedView;

@end

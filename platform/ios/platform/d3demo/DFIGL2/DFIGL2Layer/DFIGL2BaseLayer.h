//
//  DFIGL2BaseLayer.h
//  DFI
//
//  Created by vanney on 2017/5/11.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/*********************************************
 * D3 visual base shape layer                *
 * Because bounds is zero, so anchorPoint has*
 * no effect with the origin of the shape    *
 * layer coordinate.(the origin point and the*
 * center point of the shapeLayer are the    *
 * same point, as known as the position)     *
 * !!! remember to set the position          *
 *********************************************/

#import <QuartzCore/QuartzCore.h>

@class DFIColor;
@class DFIPath;
@class UIView;

@interface DFIGL2BaseLayer : CAShapeLayer

@property (nonatomic, assign) CGPoint originalPosition;
@property (nonatomic, strong) DFIColor *dfiFillColor;
@property (nonatomic, strong) DFIColor *dfiStrokeColor;
@property (nonatomic, strong) DFIPath *dfiPath;
@property (nonatomic, assign) int zIndex; // may need record z index here

@property (nonatomic, strong) id d3Model;

/** 移动layer
 *  disable implict animation
 **/
- (void)moveToPoint:(CGPoint)dest;
- (void)translation:(CGPoint)translate;

/** 高亮，低暗 strokeColor **/
- (void)highLightLayer;
- (void)deEmphasizeLayer;
- (void)ordinaryLayer;

/**
 * check path contain point
 * @param point
 * @return
 */
- (BOOL)containerPoint:(CGPoint)point;


@end

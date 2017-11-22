//
//  DFIGLChordView.h
//  DFI
//
//  Created by vanney on 2017/5/3.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/*********************************************
 * D3 Chord View                             *
 * 外圈圆加内圈色带                           啊*
 *********************************************/

#import <UIKit/UIKit.h>

@class DFIShapeArc;
@class DFIChordRibbon;

@interface DFIGLChordView : UIView

- (void)addOuterArc:(DFIShapeArc *)arc withCenter:(CGPoint)center andFillColor:(UIColor *)color;
- (void)addOuterArc:(DFIShapeArc *)arc withCenter:(CGPoint)center andFillColorString:(NSString *)colorString;

- (void)addInnerRibbon:(DFIChordRibbon *)ribbon withCenter:(CGPoint)center andFillColor:(UIColor *)color;
- (void)addInnerRibbon:(DFIChordRibbon *)ribbon withCenter:(CGPoint)center andFillColorString:(NSString *)colorString;

@end

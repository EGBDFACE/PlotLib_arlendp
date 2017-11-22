//
//  DFIShapeAreaView.h
//  DFI
//
//  Created by vanney on 2017/4/26.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/*********************************************
 * area view                                 *
 * 和line view一样，感觉还得来一个类来单独存放啊   *
 * area layer                                *
 *********************************************/

#import <UIKit/UIKit.h>

@class DFIShapeArea;

@interface DFIShapeAreaView : UIView

- (void)addArea:(DFIShapeArea *)area;

- (void)addArea:(DFIShapeArea *)area withFillColor:(UIColor *)fillColor andStrokeColor:(UIColor *)strokeColor;

@end

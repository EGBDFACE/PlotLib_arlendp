//
//  DFIGLShapeLineView.h
//  DFI
//
//  Created by vanney on 2017/4/25.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/*********************************************
 * line view                                 *
 * 感觉还得有一个类来创建单独的line layer啊       *
 *********************************************/

#import <UIKit/UIKit.h>

@class DFIShapeLine;

@interface DFIGLShapeLineView : UIView

- (void)addLine:(DFIShapeLine *)line;

@end

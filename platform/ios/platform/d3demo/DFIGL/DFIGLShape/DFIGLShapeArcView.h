//
//  DFIGLShapeArcView.h
//  DFI
//
//  Created by vanney on 2017/3/23.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <UIKit/UIKit.h>

@class DFIPath;
@class DFIShapeArc;

@interface DFIGLShapeArcView : UIView

//- (void)addPathWith:(DFIPath *)newPath;
- (void)addArc:(DFIShapeArc *)arc;

@end

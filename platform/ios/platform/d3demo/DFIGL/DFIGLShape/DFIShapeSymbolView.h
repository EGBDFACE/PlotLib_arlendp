//
//  DFIShapeSymbolView.h
//  DFI
//
//  Created by vanney on 2017/4/28.
//  Copyright © 2017年 vanney9. All rights reserved.
//

/*********************************************
 * D3 Shape Symbol View                      *
 * 可以添加多个shape symbol                    *
 *********************************************/

#import <UIKit/UIKit.h>

@class DFIShapeSymbol;

@interface DFIShapeSymbolView : UIView

/**
 * 添加symbol，当然是作为sublayer来添加
 * @param symbol
 * @param center
 */
- (void)addSymbol:(DFIShapeSymbol *)symbol andCenter:(CGPoint)center;

@end

//
//  DFIGLForceViewController.h
//  DFI
//
//  Created by vanney on 2017/2/12.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <GLKit/GLKit.h>
#import "DFIForceSimulation.h"


@interface DFIGLForceViewController : UIViewController

@property (nonatomic, strong) NSString *nodeFile;
@property (nonatomic, strong) NSString *linkFile;

// TODO - custom add force, and node and link data
@end

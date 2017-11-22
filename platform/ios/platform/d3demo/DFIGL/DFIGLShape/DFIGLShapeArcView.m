//
//  DFIGLShapeArcView.m
//  DFI
//
//  Created by vanney on 2017/3/23.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLShapeArcView.h"
#import "DFIPath.h"
#import "DFIShapeArc.h"

@interface DFIGLShapeArcView()
@property (nonatomic, strong) UIBezierPath *path;
@property (nonatomic, strong) UIBezierPath *temp;
@end

@implementation DFIGLShapeArcView


// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
//- (void)drawRect:(CGRect)rect {
//
//    // Drawing code
//    //UIBezierPath *tempPath = _path;
//    //[tempPath applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
//    [_temp applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
//    [_temp stroke];
//    NSLog(@"vanney code log : draw %@", _temp);
//    //[tempPath stroke];
//}


- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        NSLog(@"vanney code log : then init?");
//        CAShapeLayer *layer = (CAShapeLayer *) self.layer;
//        layer.fillColor = [UIColor clearColor].CGColor;
//        layer.strokeColor = [UIColor yellowColor].CGColor;
//        layer.lineWidth = 1.0f;
//        _path = [UIBezierPath bezierPath];
        self.opaque = YES;
        self.backgroundColor = [UIColor whiteColor];
    }
    
    return self;
}

- (void)addArc:(DFIShapeArc *)arc {
    CALayer *superLayer = self.layer;
    CAShapeLayer *subLayer = [CAShapeLayer layer];
    UIBezierPath *temp = [arc.path.path copy];
    [temp applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
    subLayer.path = temp.CGPath;
    subLayer.strokeColor = [UIColor yellowColor].CGColor;
    subLayer.fillColor = [self p_randomColor].CGColor;
    [superLayer addSublayer:subLayer];
}

- (UIColor *)p_randomColor {
    NSInteger R = arc4random() % 256;
    NSInteger G = arc4random() % 256;
    NSInteger B = arc4random() % 256;
    UIColor *result = [UIColor colorWithRed:R / 255.0f green:G / 255.0f blue:B / 255.0f alpha:1.0f];
    return result;
}


//+ (CALayer *)layerClass {
//    NSLog(@"vanney code log : first layer");
//    return [CAShapeLayer class];
//}

//- (void)setPath:(UIBezierPath *)path {
//    _path = path;
//    CAShapeLayer *layer = (CAShapeLayer *) self.layer;
//
//    // 使用copy，避免transform多次应用到path上面
//    _temp = [_path copy];
//    [_temp applyTransform:CGAffineTransformMakeTranslation(self.bounds.size.width / 2, self.bounds.size.height / 2)];
//    layer.path = _temp.CGPath;
//}

//- (void)addPathWith:(DFIPath *)newPath {
//    [_path appendPath:newPath.path];
//    [self setPath:_path];
//}


@end

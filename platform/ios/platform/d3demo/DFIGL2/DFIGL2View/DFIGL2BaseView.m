//
//  DFIGL2BaseView.m
//  DFI
//
//  Created by vanney on 2017/5/11.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"
#import <Colours.h>
#import <Masonry.h>

@interface DFIGL2BaseView()
@property (nonatomic, strong) UITapGestureRecognizer *tapGestureRecognizer;
@property (nonatomic, strong) UIPanGestureRecognizer *panGestureRecognizer;
@property (nonatomic, strong) UILongPressGestureRecognizer *longPressGestureRecognizer;
// TODO - other gesture

@property (nonatomic, assign) int totalNumOfLayer;

@property (nonatomic, strong) CALayer *selectedLayer;

@property (nonatomic, strong) UIView *descriptionView;
@end

@implementation DFIGL2BaseView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor whiteColor];

        _totalNumOfLayer = 0;
        _isOrderedView = NO;

        _tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
        [self addGestureRecognizer:_tapGestureRecognizer];

        _panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
        [self addGestureRecognizer:_panGestureRecognizer];

//        _longPressGestureRecognizer = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPress:)];
//        [self addGestureRecognizer:_longPressGestureRecognizer];
    }

    return self;
}


/**
 * 将该layer移至最上层，并高亮
 * @param selectedLayer
 */
- (void)setSelectedLayer:(CALayer *)selectedLayer {
    if ([_selectedLayer isKindOfClass:[DFIGL2BaseLayer class]]) {
        [(DFIGL2BaseLayer *) _selectedLayer ordinaryLayer];
    }

    _selectedLayer = selectedLayer;
    if (selectedLayer == nil) {
        return;
    }
    if (_isOrderedView) {
        CGFloat curZPosition = selectedLayer.zPosition;
        if (curZPosition == 0) {
            NSLog(@"vanney log : zposition = 0");
        }
        NSArray *sublayers = self.layer.sublayers;
        [sublayers enumerateObjectsUsingBlock:^(CALayer *curLayer, NSUInteger idx, BOOL *stop) {
            if (curLayer.zPosition > curZPosition) {
                curLayer.zPosition = curLayer.zPosition - 1;
            }
        }];
        selectedLayer.zPosition = _totalNumOfLayer;
    }
    if ([_selectedLayer isKindOfClass:[DFIGL2BaseLayer class]]) {
        [(DFIGL2BaseLayer *) _selectedLayer highLightLayer];
    }
}





#pragma mark - deal with gesture

- (void)tap:(UITapGestureRecognizer *)gestureRecognizer {
    NSLog(@"vanney code log : tap gesture fired");
}

- (void)pan:(UIPanGestureRecognizer *)gestureRecognizer {
    //NSLog(@"vanney code log : pan gesture fired");
    if (gestureRecognizer.state == UIGestureRecognizerStateChanged) {
        if ([_selectedLayer isKindOfClass:[DFIGL2BaseLayer class]]) {
            //CGPoint dest = [_selectedLayer convertPoint:[gestureRecognizer locationInView:self] fromLayer:self.layer];
            //[(DFIGL2BaseLayer *) _selectedLayer moveToPoint:dest];
            CGPoint translate = [gestureRecognizer translationInView:self];
            [(DFIGL2BaseLayer *) _selectedLayer translation:translate];
            [gestureRecognizer setTranslation:CGPointZero inView:self];
        }
    } else if (gestureRecognizer.state == UIGestureRecognizerStateEnded || gestureRecognizer.state == UIGestureRecognizerStateCancelled) {
        // TODO - may need update
        self.selectedLayer = nil;
    }
}

- (void)longPress:(UILongPressGestureRecognizer *)gestureRecognizer {
    NSLog(@"vanney code log : long press fire");
    if (gestureRecognizer.state == UIGestureRecognizerStateBegan) {
        CGFloat width = self.bounds.size.width;
        CGPoint location = [gestureRecognizer locationInView:self];
        if (location.x > width / 2) {
            [self p_showDescriptionWithModel:((DFIGL2BaseLayer *) _selectedLayer).d3Model andPosition:YES];
        } else {
            [self p_showDescriptionWithModel:((DFIGL2BaseLayer *) _selectedLayer).d3Model andPosition:NO];
        }

    } else if (gestureRecognizer.state == UIGestureRecognizerStateEnded || gestureRecognizer.state == UIGestureRecognizerStateCancelled) {
        [self p_dismissDescription];
        self.selectedLayer = nil;
    }
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    //NSLog(@"vanney code log : touch begin");
    int fingerNum = event.allTouches.count;
    if (fingerNum > 1) {
        NSLog(@"vanney code log : fingers more than 1");
        return;
    }

    CGPoint touchPoint = [touches.anyObject locationInView:self];
    [self p_detectLayerWithPoint:touchPoint];
}


#pragma mark - Private method

/**
 * 检测手势开始的点属于哪个layer
 * @param point
 * @return
 */
- (void)p_detectLayerWithPoint:(CGPoint)point {
    NSArray *sublayers = self.layer.sublayers;
    __block CALayer *detectedLayer;
    __block CGFloat curZ = 0.0f;
    [sublayers enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(CALayer *obj, NSUInteger idx, BOOL *stop) {
        if ([obj isKindOfClass:[DFIGL2BaseLayer class]]) {
            CGPoint curPoint = [obj convertPoint:point fromLayer:self.layer];
            if ([(DFIGL2BaseLayer *) obj containerPoint:curPoint]) {
                if (obj.zPosition > curZ) {
                    curZ = obj.zPosition;
                    detectedLayer = obj;
                }
            }
        }
    }];
    
    if (detectedLayer.zPosition > 0) {
        self.selectedLayer = detectedLayer;
    } else {
        self.selectedLayer = nil;
    }
}


#pragma mark - Public method

- (void)reset {
    NSArray *sublayers = self.layer.sublayers;
    [sublayers enumerateObjectsUsingBlock:^(CALayer *obj, NSUInteger idx, BOOL *stop) {
        if ([obj isKindOfClass:[DFIGL2BaseLayer class]]) {
            DFIGL2BaseLayer *layer = (DFIGL2BaseLayer *) obj;
            layer.originalPosition = layer.originalPosition;
        }
    }];
}

- (void)addDFILayer:(CALayer *)layer {
    _totalNumOfLayer++;
    [self.layer addSublayer:layer];
    layer.zPosition = _totalNumOfLayer;
}


#pragma mark - show description

- (void)p_showDescriptionWithModel:(id)d3Model andPosition:(BOOL)position {
    if (d3Model && [d3Model respondsToSelector:@selector(dfiDescription)]) {
        if (_descriptionView) {
            return;
        }
        NSLog(@"vanney code log : show d3 model description");
        NSDictionary *data = [d3Model performSelector:@selector(dfiDescription)];
        int dataCount = data.count;
        CGFloat height = 44.0f * dataCount;
        CGFloat width = 1.618f * height;
        //_descriptionView = [[UIView alloc] initWithFrame:CGRectMake(10, 10, width, height)];
        _descriptionView = [[UIView alloc] init];
        _descriptionView.layer.zPosition = 1000;
        _descriptionView.layer.masksToBounds = YES;
        _descriptionView.layer.cornerRadius = 5.0f;
        //_descriptionView.backgroundColor = [UIColor warmGrayColor];

        __block UILabel *preLabel = nil;
        [data enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
            UILabel *curLabel = [UILabel new];
            curLabel.textColor = [UIColor antiqueWhiteColor];
            curLabel.font = [UIFont fontWithName:@"HelveticaNeue" size:20];
            if ([key containsString:@"Value"]) {
                curLabel.text = [NSString stringWithFormat:@"%@ : %.2f", key, [obj floatValue]];
            } else {
                curLabel.text = [NSString stringWithFormat:@"%@ : %@", key, obj];
            }
            [_descriptionView addSubview:curLabel];
            [curLabel mas_makeConstraints:^(MASConstraintMaker *make) {
                make.leading.equalTo(_descriptionView).offset(5);
                make.trailing.lessThanOrEqualTo(_descriptionView).offset(-5);
                if (preLabel) {
                    make.top.equalTo(preLabel.mas_bottom).offset(5);
                } else {
                    make.top.equalTo(_descriptionView);
                }
            }];
            //[curLabel setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
            //[curLabel setContentHuggingPriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
            preLabel = curLabel;
        }];

        [self addSubview:_descriptionView];
        [_descriptionView mas_makeConstraints:^(MASConstraintMaker *make) {
            if (position) {
                make.top.equalTo(self).offset(20);
                make.leading.equalTo(self).offset(50);
            } else {
                make.bottom.equalTo(self).offset(-20);
                make.trailing.equalTo(self).offset(-50);
            }
            if (preLabel) {
                make.bottom.equalTo(preLabel.mas_bottom).offset(5);
            }
        }];
    }
}

- (void)p_dismissDescription {
    if (_descriptionView) {
        [_descriptionView removeFromSuperview];
        _descriptionView = nil;
    }
}




/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end

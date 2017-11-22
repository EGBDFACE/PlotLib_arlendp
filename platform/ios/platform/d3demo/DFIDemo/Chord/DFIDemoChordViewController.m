//
//  DFIDemoChordViewController.m
//  DFI
//
//  Created by vanney on 2017/5/11.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoChordViewController.h"
#import "DFIChord.h"
#import "DFIColor.h"
#import "DFIScaleOrdinal.h"
#import "DFIArray.h"
#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"
#import "DFIShapeArc.h"
#import "DFIChordRibbon.h"


@interface DFIDemoChordViewController ()
@property (nonatomic, strong) DFIChord *chord;
@property (nonatomic, strong) DFIScaleOrdinal *ordinal;

@property (nonatomic, strong) DFIGL2BaseView *chordView;

@end

@implementation DFIDemoChordViewController

- (UIView *)createView {
  [self p_setupChordData];
  [self p_setupChordColor];
  [self p_setupChordView2];
  
  return _chordView;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    [self p_setupChordData];
    [self p_setupChordColor];
    [self p_setupChordView];

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - Chord";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLayoutSubviews {
    NSLog(@"vanney code log : did load subviews");
    self.navigationController.navigationBar.translucent = NO;
}

- (void)p_setupButton {
    UIBarButtonItem *resetButton = [[UIBarButtonItem alloc] initWithTitle:@"Reset" style:UIBarButtonItemStylePlain target:self action:@selector(resetView)];
    self.navigationItem.rightBarButtonItem = resetButton;
}

- (void)resetView {
    [_chordView reset];
}

- (void)p_setupChordData {
    NSArray *data1 = @[@(11975), @(5871), @(8916), @(2868)];
    NSArray *data2 = @[@(1951), @(10048), @(2060), @(6171)];
    NSArray *data3 = @[@(8010), @(16145), @(8090), @(8045)];
    NSArray *data4 = @[@(1013), @(990), @(940), @(6907)];

    NSArray *matrix = @[data1, data2, data3, data4];
    _chord = [[DFIChord alloc] init];
    _chord.padAngle = 0.05f;
    _chord.sortSubgroups = ^NSComparisonResult(id obj1, id obj2) {
        CGFloat f1 = [obj1 floatValue];
        CGFloat f2 = [obj2 floatValue];
        if (f1 < f2) {
            return NSOrderedAscending;
        } else {
            return NSOrderedDescending;
        }
    };
    [_chord loadChordWithMatrix:matrix];
}

- (void)p_setupChordColor {
    _ordinal = [[DFIScaleOrdinal alloc] initWithRange:@[
            @"#000000",
            @"#FFDD89",
            @"#957244",
            @"#F26223",
    ]];
    _ordinal.domain = [DFIArray rangeWithStart:0 stop:4 andStep:1];
}

- (void)p_setupChordView {
    _chordView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64)];
    _chordView.isOrderedView = YES;
    [self.view addSubview:_chordView];

    // add outer arcs
    CGFloat outerRadius = MIN(self.view.bounds.size.height - 64.0f, self.view.bounds.size.width) * 0.5f - 40.0f;
    CGFloat innerRadius = outerRadius - 30.0f;

    NSArray *groups = _chord.chords.groups;
    [groups enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
        DFIShapeArc *curGroup = [[DFIShapeArc alloc] init];
        curGroup.outerRadius = outerRadius;
        curGroup.innerRadius = innerRadius;
        [curGroup loadArcWithData:obj];
        [curGroup loadOriginalData:@{
                @"value": [obj objectForKey:@"value"]
        }];

        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        curLayer.originalPosition = _chordView.center;
        NSString *fillColorStr = [_ordinal scale:@(idx)];
        curLayer.dfiStrokeColor = curLayer.dfiFillColor = [DFIColor colorWithFormat:fillColorStr];
        curLayer.dfiPath = curGroup.path;
        curLayer.lineWidth = 1.0f;
        curLayer.d3Model = curGroup;

        [_chordView addDFILayer:curLayer];
    }];

    // add inner ribbons
    NSArray *chords = _chord.chords.data;
    [chords enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
        DFIChordRibbon *curRibbon = [[DFIChordRibbon alloc] init];
        curRibbon.radius = ^CGFloat(id data) {
            return innerRadius;
        };
        [curRibbon loadRibbonWithData:obj];
        [curRibbon loadOriginalData:@{
                @"from": [[obj objectForKey:@"target"] objectForKey:@"value"],
                @"to": [[obj objectForKey:@"source"] objectForKey:@"value"]
        }];

        DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
        curLayer.originalPosition = _chordView.center;
        NSDictionary *target = [obj objectForKey:@"target"];
        NSValue *tIndex = [target objectForKey:@"index"];
        curLayer.opacity = 0.67;
        NSString *fillColorStr = [_ordinal scale:tIndex];
        curLayer.dfiStrokeColor = curLayer.dfiFillColor = [DFIColor colorWithFormat:fillColorStr];
        curLayer.dfiPath = curRibbon.context;
        curLayer.lineWidth = 1.0f;
        curLayer.d3Model = curRibbon;

        [_chordView addDFILayer:curLayer];
    }];
}

- (void)p_setupChordView2 {
  _chordView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, 300, 300)];
  _chordView.isOrderedView = YES;
  //[self.view addSubview:_chordView];
  
  // add outer arcs
  //CGFloat outerRadius = MIN(self.view.bounds.size.height - 64.0f, self.view.bounds.size.width) * 0.5f - 40.0f;
  CGFloat outerRadius = 125.0f;
  CGFloat innerRadius = outerRadius - 15.0f;
  
  NSArray *groups = _chord.chords.groups;
  [groups enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
    DFIShapeArc *curGroup = [[DFIShapeArc alloc] init];
    curGroup.outerRadius = outerRadius;
    curGroup.innerRadius = innerRadius;
    [curGroup loadArcWithData:obj];
    [curGroup loadOriginalData:@{
                                 @"value": [obj objectForKey:@"value"]
                                 }];
    
    DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
    curLayer.originalPosition = _chordView.center;
    NSString *fillColorStr = [_ordinal scale:@(idx)];
    curLayer.dfiStrokeColor = curLayer.dfiFillColor = [DFIColor colorWithFormat:fillColorStr];
    curLayer.dfiPath = curGroup.path;
    curLayer.lineWidth = 1.0f;
    curLayer.d3Model = curGroup;
    
    [_chordView addDFILayer:curLayer];
    
    //*stop = YES;
  }];
  
  // add inner ribbons
  NSArray *chords = _chord.chords.data;
  [chords enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
    DFIChordRibbon *curRibbon = [[DFIChordRibbon alloc] init];
    curRibbon.radius = ^CGFloat(id data) {
      return innerRadius;
    };
    [curRibbon loadRibbonWithData:obj];
    [curRibbon loadOriginalData:@{
                                  @"from": [[obj objectForKey:@"target"] objectForKey:@"value"],
                                  @"to": [[obj objectForKey:@"source"] objectForKey:@"value"]
                                  }];
    
    DFIGL2BaseLayer *curLayer = [DFIGL2BaseLayer layer];
    curLayer.originalPosition = _chordView.center;
    NSDictionary *target = [obj objectForKey:@"target"];
    NSValue *tIndex = [target objectForKey:@"index"];
    curLayer.opacity = 0.67;
    NSString *fillColorStr = [_ordinal scale:tIndex];
    curLayer.dfiStrokeColor = curLayer.dfiFillColor = [DFIColor colorWithFormat:fillColorStr];
    curLayer.dfiPath = curRibbon.context;
    curLayer.lineWidth = 1.0f;
    curLayer.d3Model = curRibbon;
    
    [_chordView addDFILayer:curLayer];
    //*stop = YES;
  }];
}


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end

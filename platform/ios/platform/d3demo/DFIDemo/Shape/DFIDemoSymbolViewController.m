//
//  DFIDemoSymbolViewController.m
//  DFI
//
//  Created by vanney on 2017/5/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIDemoSymbolViewController.h"
#import "DFIShapeSymbol.h"
#import "DFIGL2BaseView.h"
#import "DFIGL2BaseLayer.h"
#import "DFIColor.h"

@interface DFIDemoSymbolViewController ()
@property (nonatomic, strong) DFIGL2BaseView *symbolView;
@end

@implementation DFIDemoSymbolViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    _symbolView = [[DFIGL2BaseView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64.0f)];
    _symbolView.isOrderedView = YES;
    [self.view addSubview:_symbolView];

    DFIShapeSymbol *circleSymbol = [[DFIShapeSymbol alloc] init];
    circleSymbol.size = M_PI * 50.0f * 50.0f;
    [circleSymbol loadSymbol];
    //[___symbolView.addSymbol:circleSymbol andCenter:self.view.center];
    DFIGL2BaseLayer *circleLayer = [DFIGL2BaseLayer layer];
    circleLayer.originalPosition = CGPointMake(_symbolView.center.x, _symbolView.center.y);
    circleLayer.dfiPath = circleSymbol.context;
    circleLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    circleLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:circleLayer];

    DFIShapeSymbol *crossSymbol = [[DFIShapeSymbol alloc] init];
    crossSymbol.type = DFIShapeSymbolTypeCross;
    crossSymbol.size = 5800.0f;
    [crossSymbol loadSymbol];
    //[_symbolView addSymbol:crossSymbol andCenter:CGPointMake(self.view.center.x - 120.0f, self.view.center.y)];
    DFIGL2BaseLayer *crossLayer = [DFIGL2BaseLayer layer];
    crossLayer.originalPosition = CGPointMake(_symbolView.center.x - 120.0f, _symbolView.center.y);
    crossLayer.dfiPath = crossSymbol.context;
    crossLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    crossLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:crossLayer];

    DFIShapeSymbol *diamondSymbol = [[DFIShapeSymbol alloc] init];
    diamondSymbol.type = DFIShapeSymbolTypeDiamond;
    diamondSymbol.size = 5400.0f;
    [diamondSymbol loadSymbol];
    //[_symbolView addSymbol:diamondSymbol andCenter:CGPointMake(self.view.center.x + 120.0f, self.view.center.y)];
    DFIGL2BaseLayer *diamondLayer = [DFIGL2BaseLayer layer];
    diamondLayer.originalPosition = CGPointMake(_symbolView.center.x + 120.0f, _symbolView.center.y);
    diamondLayer.dfiPath = diamondSymbol.context;
    diamondLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    diamondLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:diamondLayer];

    DFIShapeSymbol *squareSymbol = [[DFIShapeSymbol alloc] init];
    squareSymbol.type = DFIShapeSymbolTypeSquare;
    squareSymbol.size = 5000.0f;
    [squareSymbol loadSymbol];
    //[_symbolView addSymbol:squareSymbol andCenter:CGPointMake(self.view.center.x + 240.0f, self.view.center.y)];
    DFIGL2BaseLayer *squareLayer = [DFIGL2BaseLayer layer];
    squareLayer.originalPosition = CGPointMake(_symbolView.center.x + 240.0f, _symbolView.center.y);
    squareLayer.dfiPath = squareSymbol.context;
    squareLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    squareLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:squareLayer];

    DFIShapeSymbol *starSymbol = [[DFIShapeSymbol alloc] init];
    starSymbol.type = DFIShapeSymbolTypeStar;
    starSymbol.size = 4000.0f;
    [starSymbol loadSymbol];
    //[_symbolView addSymbol:starSymbol andCenter:CGPointMake(self.view.center.x - 240.0f, self.view.center.y)];
    DFIGL2BaseLayer *starLayer = [DFIGL2BaseLayer layer];
    starLayer.originalPosition = CGPointMake(_symbolView.center.x - 240.0f, _symbolView.center.y);
    starLayer.dfiPath = starSymbol.context;
    starLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    starLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:starLayer];

    DFIShapeSymbol *triangleSymbol = [[DFIShapeSymbol alloc] init];
    triangleSymbol.size = 4000.0f;
    triangleSymbol.type = DFIShapeSymbolTypeTriangle;
    [triangleSymbol loadSymbol];
    //[_symbolView addSymbol:triangleSymbol andCenter:CGPointMake(self.view.center.x + 360.0f, self.view.center.y)];
    DFIGL2BaseLayer *triangleLayer = [DFIGL2BaseLayer layer];
    triangleLayer.originalPosition = CGPointMake(_symbolView.center.x + 360.0f, _symbolView.center.y);
    triangleLayer.dfiPath = triangleSymbol.context;
    triangleLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    triangleLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:triangleLayer];

    DFIShapeSymbol *wyeSymbol = [[DFIShapeSymbol alloc] init];
    wyeSymbol.type = DFIShapeSymbolTypeWye;
    wyeSymbol.size = 4000.0f;
    [wyeSymbol loadSymbol];
    //[_symbolView addSymbol:wyeSymbol andCenter:CGPointMake(self.view.center.x - 360.0f, self.view.center.y)];
    DFIGL2BaseLayer *wyeLayer = [DFIGL2BaseLayer layer];
    wyeLayer.originalPosition = CGPointMake(_symbolView.center.x - 360.0f, _symbolView.center.y);
    wyeLayer.dfiPath = wyeSymbol.context;
    wyeLayer.dfiStrokeColor = [DFIColor colorWithFormat:@"steelblue"];
    wyeLayer.dfiFillColor = [DFIColor colorWithFormat:@"white"];
    [_symbolView addDFILayer:wyeLayer];

    [self p_setupButton];

    self.navigationItem.title = @"iD3 - Symbol";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLayoutSubviews {
    self.navigationController.navigationBar.translucent = NO;
}

- (void)p_setupButton {
    UIBarButtonItem *resetButton = [[UIBarButtonItem alloc] initWithTitle:@"Reset" style:UIBarButtonItemStylePlain target:self action:@selector(resetView)];
    self.navigationItem.rightBarButtonItem = resetButton;
}

- (void)resetView {
    [_symbolView reset];
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

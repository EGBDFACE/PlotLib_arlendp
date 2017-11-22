//
//  DFIDemoForceViewController.m
//  DFI
//
//  Created by vanney on 2017/5/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <Colours/Colours.h>
#import "DFIDemoForceViewController.h"
#import "DFIForceLink.h"
#import "DFIForceManybody.h"
#import "DFIForceCenter.h"
#import "DFIHelperJSON.h"
#import "DFIGLForceView.h"

#import <Masonry.h>

@interface DFIDemoForceViewController ()
@property (nonatomic, strong) DFIForceSimulation *simulation;
@property (nonatomic, strong) DFIForceLink *linkForce;
@property (nonatomic, strong) DFIForceManybody *manybodyForce;
@property (nonatomic, strong) DFIForceCenter *centerForce;

@property (nonatomic, strong) DFIGLForceView *forceView;

@property (nonatomic, strong) UITapGestureRecognizer *tapGestureRecognizer;
@property (nonatomic, strong) UIPanGestureRecognizer *panGestureRecognizer;
@property (nonatomic, strong) UILongPressGestureRecognizer *longPressGestureRecognizer;
@property (nonatomic, strong) DFIForceNode *paningNode;

@property (nonatomic, strong) UIView *innerView;

@property (nonatomic, strong) UILabel *descriptionView;

@end

@implementation DFIDemoForceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    _paningNode = nil;

    NSMutableArray *nodeArray = [DFIHelperJSON readJSONArrayFromFile:@"node"];
    NSMutableArray *linkArray = [DFIHelperJSON readJSONArrayFromFile:@"link"];
    _simulation = [[DFIForceSimulation alloc] initWithNodes:nodeArray];
    _linkForce = [[DFIForceLink alloc] initWithNodes:_simulation.nodes];
    [_linkForce linksInitialize:linkArray];
    _manybodyForce = [[DFIForceManybody alloc] initWithNodes:_simulation.nodes];
    _centerForce = [[DFIForceCenter alloc] initWithNodes:_simulation.nodes];
    //[_centerForce centerInitializeWithX:0.0f andY:0.0f];
    [_centerForce centerInitializeWithX:self.view.bounds.size.width / 2 andY:self.view.bounds.size.height / 2];
    //NSLog(@"vanney code log : width is %f and height is %f", self.view.bounds.size.width, self.view.bounds.size.height);

    [_simulation addForce:_linkForce];
    [_simulation addForce:_manybodyForce];
    [_simulation addForce:_centerForce];

    NSLog(@"vanney code log : view width is %f, and height is %f", self.view.bounds.size.width, self.view.bounds.size.height);
    self.forceView = [[DFIGLForceView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 64)];
    self.forceView.nodes = _simulation.nodes;
    self.forceView.links = _linkForce.links;
    self.forceView.simulation = _simulation;
    // TODO - deal with view delegate
    _simulation.delegate = self.forceView;
    [self.view addSubview:self.forceView];

    // add gesture
    self.tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
    self.tapGestureRecognizer.numberOfTapsRequired = 1;
    //[self.forceView addGestureRecognizer:self.tapGestureRecognizer];

    self.panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:_forceView action:@selector(pan:)];
    self.panGestureRecognizer.delegate = _forceView;
    [self.forceView addGestureRecognizer:self.panGestureRecognizer];

//    _longPressGestureRecognizer = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPress:)];
//    [_forceView addGestureRecognizer:_longPressGestureRecognizer];

    [_simulation forceStart];

    self.navigationItem.title = @"iD3 - Force";

    //[self p_setupButton];
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
    //[_chordView reset];
    // TODO - reset force view
    [_simulation reset];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/


#pragma mark - Gesture Recognizer

- (void)tap:(UITapGestureRecognizer *)recognizer {
    CGPoint location = [recognizer locationInView:self.forceView];
    //NSLog(@"vanney code log : gesture location : x - %f, y - %f", location.x, location.y);

    DFIForceNode *tapNode = [_simulation findNodeWithinRadius:_forceView.radiusInPoint + 1.0f pointX:location.x andPointY:_forceView.bounds.size.height - location.y];
    if (tapNode == nil) {
        NSLog(@"vanney code log : not tap anything");
    } else {
        NSLog(@"vanney code log : tap in node : %@, and x is %f y is %f", tapNode.id, tapNode.x, tapNode.y);
    }
}

- (void)longPress:(UILongPressGestureRecognizer *)gestureRecognizer {
    if (gestureRecognizer.state == UIGestureRecognizerStateBegan) {
        CGPoint location = [gestureRecognizer locationInView:self.forceView];
        DFIForceNode *node = [_simulation findNodeWithinRadius:_forceView.radiusInPoint + 3.0f pointX:_forceView.touchLocation.x andPointY:_forceView.bounds.size.height - _forceView.touchLocation.y];
        [self p_showDescriptionWithNode:node];
    } else if (gestureRecognizer.state == UIGestureRecognizerStateEnded || gestureRecognizer.state == UIGestureRecognizerStateCancelled) {
        [self p_dismissDescription];
    }
}

- (void)pan:(UIPanGestureRecognizer *)recognizer {
    //NSLog(@"vanney code log : pan start");
    CGPoint location = [recognizer locationInView:self.forceView];
    CGPoint curPoint = [self.forceView transformPointInScrollViewWithPoint:location];
    //NSLog(@"vanney code log : location x : %f y : %f", location.x, location.y);
    if (recognizer.state == UIGestureRecognizerStateBegan) {
        if (_simulation.status == DFIForceSimulationStatusNormal) {
            NSLog(@"vanney code log : hallo");
            //CGPoint firstPoint = [self.forceView transformPointInScrollViewWithPoint:self.forceView.touchLocation];
            _paningNode = [_simulation findNodeWithinRadius:_forceView.radiusInPoint + 3.0f pointX:_forceView.touchLocation.x andPointY:_forceView.bounds.size.height - _forceView.touchLocation.y];
            if (_paningNode != nil) {
                self.forceView.scrollEnabled = NO;
                NSLog(@"vanney code log : start pan node");
                _simulation.status = DFIForceSimulationStatusStartPan;
                _simulation.alphaTarget = 0.3f;
                [_simulation restart];
                _paningNode.fx = curPoint.x;
                _paningNode.fy = _forceView.bounds.size.height - curPoint.y;
            }
        }
    } else if (recognizer.state == UIGestureRecognizerStateChanged) {
        _paningNode.fx = curPoint.x;
        _paningNode.fy = _forceView.bounds.size.height - curPoint.y;
    } else if (recognizer.state == UIGestureRecognizerStateEnded || recognizer.state == UIGestureRecognizerStateCancelled) {
        _simulation.alphaTarget = 0.0f;
        _paningNode.fx = NAN;
        _paningNode.fy = NAN;
        _paningNode = nil;
        _simulation.status = DFIForceSimulationStatusNormal;
        self.forceView.scrollEnabled = YES;
    }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
    return YES;
}


- (void)p_showDescriptionWithNode:(DFIForceNode *)node {
    if (_descriptionView) {
        return;
    }

    _descriptionView = [UILabel new];
    _descriptionView.text = node.id;
    _descriptionView.font = [UIFont fontWithName:@"HelveticaNeue" size:20];
    _descriptionView.textColor = [UIColor warmGrayColor];

    [self.view addSubview:_descriptionView];
    [_descriptionView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.equalTo(self.view).offset(50);
        make.top.equalTo(self.view).offset(20);
    }];
}

- (void)p_dismissDescription {
    if (_descriptionView) {
        [_descriptionView removeFromSuperview];
        _descriptionView = nil;
    }
}

@end

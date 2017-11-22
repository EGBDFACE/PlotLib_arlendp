//
//  DFIGLForceViewController.m
//  DFI
//
//  Created by vanney on 2017/2/12.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLForceViewController.h"
#import "DFIForceLink.h"
#import "DFIForceManybody.h"
#import "DFIForceCenter.h"
#import "DFIHelperJSON.h"
#import "DFIGLForceView.h"

@interface DFIGLForceViewController() <UIScrollViewDelegate, UIGestureRecognizerDelegate>
// TODO - deal with link property
@property (nonatomic, strong) DFIForceSimulation *simulation;
@property (nonatomic, strong) DFIForceLink *linkForce;
@property (nonatomic, strong) DFIForceManybody *manybodyForce;
@property (nonatomic, strong) DFIForceCenter *centerForce;

@property (nonatomic, strong) DFIGLForceView *forceView;

@property (nonatomic, strong) UITapGestureRecognizer *tapGestureRecognizer;
@property (nonatomic, strong) UIPanGestureRecognizer *panGestureRecognizer;
@property (nonatomic, strong) DFIForceNode *paningNode;

@property (nonatomic, strong) UIView *innerView;
@end

@implementation DFIGLForceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    _paningNode = nil;

//    NSMutableArray *nodeArray = [DFIHelperJSON readJSONArrayFromFile:_nodeFile];
//    NSMutableArray *linkArray = [DFIHelperJSON readJSONArrayFromFile:_linkFile];
    NSMutableArray *nodeArray = [DFIHelperJSON readJSONArrayFromFile:_nodeFile];
    NSMutableArray *linkArray = [DFIHelperJSON readJSONArrayFromFile:_linkFile];
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
    self.forceView = [[DFIGLForceView alloc] initWithFrame:self.view.bounds];
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

    self.panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
    self.panGestureRecognizer.delegate = self;
    [self.forceView addGestureRecognizer:self.panGestureRecognizer];

    [_simulation forceStart];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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

@end

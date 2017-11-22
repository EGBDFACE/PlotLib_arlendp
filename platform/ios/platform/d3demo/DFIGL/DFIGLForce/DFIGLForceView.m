//
//  DFIGLForceView.m
//  DFI
//
//  Created by vanney on 2017/2/14.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIGLForceView.h"
#import <GLKit/GLKit.h>
#import "DFIGLShader.h"

@interface DFIGLForceView () <UIScrollViewDelegate> {
    CAEAGLLayer *_eaglLayer;
    EAGLContext *_context;
    GLuint _colorRenderBuffer;
    GLuint _depthRenderBuffer;

    float _radius;
    float _z;
    float _vertices[12];
    GLubyte _indices[6];
    GLuint _VAO, _VBO, _VEO, _VAO1, _VBO1;

    float _scale;

}

@property (nonatomic, strong) DFIGLShader *shader;
@property (nonatomic, strong) CADisplayLink *displayLink;

@property (nonatomic, strong) UIView *innerView;

@end

@implementation DFIGLForceView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        // other initialize
        _touchLocation = CGPointMake(0, 0);

        [self setupScrollViewAbout];
        [self setupLayer];
        [self setupContext];
        // 先绑定depthBuffer，再绑定renderBuffer，不然的话之后会输出depthBuffer的内容。。
        [self setupDepthBuffer];
        [self setupRenderBuffer];
        [self setupFrameBuffer];
        [self dataInitialize];
        [self changeInitData];
        [self viewPortInitialize];
        //self.delegate = self;

        // 添加后会加快渲染？
        //[self setupDisplayLink];
    }

    return self;
}

- (void)setupScrollViewAbout {
    CGSize content = CGSizeMake(2 * self.bounds.size.width, 2 * self.bounds.size.height);
    _innerView = [[UIView alloc] initWithFrame:CGRectMake(0.0f, 0.0f, content.width, content.height)];
    _innerView.backgroundColor = [UIColor clearColor];
    [self addSubview:_innerView];
    self.contentSize = content;
    self.maximumZoomScale = 2.0f;
    self.minimumZoomScale = 0.5f;
    self.contentOffset = CGPointMake(self.bounds.size.width / 2, self.bounds.size.height / 2);
    //NSLog(@"vanney code log : frame is %f : %f", self.bounds.size.width, self.bounds.size.height);
    //NSLog(@"vanney code log : content size is %f : %f", self.contentSize.width, self.contentSize.height);
    self.delegate = self;
    //self.userInteractionEnabled = NO;

    /*
     * 立刻执行touchBegan
     * 很急很关键
     */
    self.delaysContentTouches = NO;

    // deal with first touch
//    UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapDetect:)];
//    tapGestureRecognizer.numberOfTouchesRequired = 1;
//    [self addGestureRecognizer:tapGestureRecognizer];
}

- (void)setupDisplayLink {
    self.displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(forceViewShowPerFrame)];
    [self.displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSRunLoopCommonModes];
}

+ (Class)layerClass {
    return [CAEAGLLayer class];
}

- (void)setupLayer {
    _scale = [UIScreen mainScreen].scale;
    // to fit my own mac scale, not simulator...
    //_scale = 1.0f;
    self.contentScaleFactor = _scale;
    _eaglLayer = (CAEAGLLayer *) self.layer;
    _eaglLayer.opaque = true;
}

- (void)setupContext {
    EAGLRenderingAPI api = kEAGLRenderingAPIOpenGLES3;
    _context = [[EAGLContext alloc] initWithAPI:api];
    if (!_context) {
        NSLog(@"vanney code log : failed to initialize OpenGLES 3.0 context");
        exit(1);
    }

    if (![EAGLContext setCurrentContext:_context]) {
        NSLog(@"vanney code log : failed to set current OpenGL context");
        exit(1);
    }
}

- (void)setupRenderBuffer {
    GLfloat view[2];
    glGetFloatv(GL_MAX_VIEWPORT_DIMS, view);
    NSLog(@"vanney code log : view port max is %f, %f", view[0], view[1]);
    glGenRenderbuffers(1, &_colorRenderBuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, _colorRenderBuffer);
    [_context renderbufferStorage:GL_RENDERBUFFER fromDrawable:_eaglLayer];
}

- (void)setupDepthBuffer {
    glGenRenderbuffers(1, &_depthRenderBuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, _depthRenderBuffer);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16, self.frame.size.width * _scale, self.frame.size.height * _scale);
}

- (void)setupFrameBuffer {
    GLuint framebuffer;
    glGenFramebuffers(1, &framebuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, framebuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _colorRenderBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _depthRenderBuffer);
}

- (void)viewPortInitialize {
    // set background to white
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    // enable blend
//    glEnable(GL_BLEND);
//    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    //glViewport(0, 0, self.frame.size.width * _scale, self.frame.size.height * _scale);
    //glViewport(0, 0, self.contentSize.width * _scale, self.contentSize.height * _scale);

    [_context presentRenderbuffer:GL_RENDERBUFFER];
}

- (void)dataInitialize {
    _indices[0] = 0;
    _indices[1] = 1;
    _indices[2] = 2;
    _indices[3] = 2;
    _indices[4] = 3;
    _indices[5] = 0;

    // load shader
    self.shader = [[DFIGLShader alloc] initWithVertexPath:@"DFIGLForceNodeVertex" andFragmentPaht:@"DFIGLForceNodeFragment"];
    //NSLog(@"vanney code log : node program is %d", self.nodeShader.program);
    if (!self.shader) {
        NSLog(@"vanney code log : error with DFIGLForce node shader");
        exit(1);
    }

    // TODO - maybe need load texture ?

    // bind OpenGL data
    glGenVertexArrays(1, &_VAO);
    glGenBuffers(1, &_VBO);
    glGenBuffers(1, &_VEO);

    glBindVertexArray(_VAO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _VEO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(_indices), _indices, GL_STATIC_DRAW);
    glBindVertexArray(0);

    glGenVertexArrays(1, &_VAO1);
    glGenBuffers(1, &_VBO1);
}

- (void)changeInitData {
    _radiusInPoint = 10.0f;
    _radius = _radiusInPoint / self.bounds.size.width;
    //_radius = _radiusInPoint / self.contentSize.width;
    _z = 0.0f;

    _vertices[0] = _radius;
    _vertices[1] = -_radius;
//    _vertices[0] = -1.0f;
//    _vertices[1] = 0.0f;
    _vertices[2] = _z;
    _vertices[3] = _radius;
    _vertices[4] = _radius;
//    _vertices[3] = -0.5f;
//    _vertices[4] = 0.5f;
    _vertices[5] = _z;
//    _vertices[6] = -0.5f;
//    _vertices[7] = 0.5f;
    _vertices[6] = -_radius;
    _vertices[7] = _radius;
    _vertices[8] = _z;
    _vertices[9] = -_radius;
    _vertices[10] = -_radius;
//    _vertices[9] = 0.0f;
//    _vertices[10] = 0.0f;
    _vertices[11] = _z;

    glBindVertexArray(_VAO);
    glBindBuffer(GL_ARRAY_BUFFER, _VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(_vertices), _vertices, GL_STATIC_DRAW);
    glVertexAttribPointer(GLKVertexAttribPosition, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid *) 0);
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    glBindVertexArray(0);
}

- (void)forceViewShowPerFrame {
    /* start drawing openGL context per fragment */

    glFlush();
    //NSLog(@"vanney code log : content size width is %f, and width is %f", self.contentSize.width, self.contentSize.height);
    //glViewport(0, 0, self.contentSize.width * _scale, self.contentSize.height * _scale);
    //glViewport(0.25f * self.contentSize.width - self.contentOffset.x, self.contentOffset.y + self.bounds.size.height - 0.75f * self.contentSize.height, self.contentSize.width, self.contentSize.height);
    //glViewport(-self.contentOffset.x, -(self.contentSize.height - self.bounds.size.height - self.contentOffset.y), self.contentSize.width, self.contentSize.height);
    glViewport(-self.contentOffset.x * _scale, -(self.contentSize.height - self.bounds.size.height - self.contentOffset.y) * _scale, self.contentSize.width * _scale, self.contentSize.height * _scale);
    //NSLog(@"vanney code log : frame size is w -> %f, h -> %f", self.frame.size.width, self.frame.size.height);
    //glViewport(0, 0, self.frame.size.width * _scale, self.frame.size.height * _scale);

    // set background to white
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    // enable blend
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    //[self changeInitData];

    // set screen size -> content size
//    float screenWidth = self.contentSize.width;
//    float screenHeight = self.contentSize.height;
    float screenWidth = self.frame.size.width;
    float screenHeight = self.frame.size.height;
    // set projection
    float aspectRatio = screenHeight / screenWidth;

    GLKMatrix4 projectionMatrix = GLKMatrix4MakeOrtho(-2.0f * _scale, 2.0f * _scale, -2.0f * aspectRatio * _scale, 2.0f * aspectRatio * _scale, 0.0f, 100.0f);
    glUniformMatrix4fv(glGetUniformLocation(self.shader.program, "projection"), 1, GL_FALSE, projectionMatrix.m);
    // set radius
    //NSLog(@"vanney code log : radius is %f", _radius);
    glUniform2f(glGetUniformLocation(self.shader.program, "radius"), _radius * _scale, aspectRatio);
    // set scale
    glUniform1f(glGetUniformLocation(self.shader.program, "scale"), _scale);

    float halfScreenWidth = screenWidth / 2;
    float halfScreenHeight = screenHeight / 2;

    [self.shader use];

    // start draw link 先画link，因为它的depth更深
    int m = _links.count;
    float linkData[6 * m];
    // prepare link data
    for (int j = 0; j < m; ++j) {
        DFIForceLinkElement *curLink = [_links objectAtIndex:j];
        DFIForceNode *sourceNode = curLink.sourceNode;
        DFIForceNode *targetNode = curLink.targetNode;
        // TODO - can set a node array to store node coord
        float dxsource = (sourceNode.x - halfScreenWidth) / halfScreenWidth;
        float dysource = (sourceNode.y - halfScreenHeight) / halfScreenWidth;
        float dxtarget = (targetNode.x - halfScreenWidth) / halfScreenWidth;
        float dytarget = (targetNode.y - halfScreenHeight) / halfScreenWidth;
        linkData[6 * j] = dxsource;
        linkData[6 * j + 1] = dysource;
        linkData[6 * j + 2] = -1.0f;
        linkData[6 * j + 3] = dxtarget;
        linkData[6 * j + 4] = dytarget;
        linkData[6 * j + 5] = -1.0f;
    }
    //NSLog(@"vanney code log : link num is %d and size of linkdata is %d", m, sizeof(linkData));

    glBindVertexArray(_VAO1);
    glBindBuffer(GL_ARRAY_BUFFER, _VBO1);
    glBufferData(GL_ARRAY_BUFFER, sizeof(linkData), linkData, GL_STATIC_DRAW);
    glVertexAttribPointer(GLKVertexAttribPosition, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid *) 0);
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    glLineWidth(_scale);
    glDrawArrays(GL_LINES, 0, 2 * m);
    glBindVertexArray(0);

    // start draw node
    int n = _nodes.count;
    int i = 0;
    int index = 0;
    for (; index < n; ++index) {
        DFIForceNode *curNode = [_nodes objectAtIndex:index];
        float dx = (curNode.x - halfScreenWidth) / halfScreenWidth;
        float dy = (curNode.y - halfScreenHeight) / halfScreenWidth;
        GLint centersLocation = glGetUniformLocation(self.shader.program, [[NSString stringWithFormat:@"centers[%d]", i] UTF8String]);
        glUniform3f(centersLocation, dx, dy, curNode.group);
        if (i == 99) {
            glBindVertexArray(_VAO);
            glDrawElementsInstanced(GL_TRIANGLES, sizeof(_indices) / sizeof(_indices[0]), GL_UNSIGNED_BYTE, 0, i + 1);
            glBindVertexArray(0);
            i = 0;
        } else {
            ++i;
        }
    }

    glBindVertexArray(_VAO);
    glDrawElementsInstanced(GL_TRIANGLES, sizeof(_indices) / sizeof(_indices[0]), GL_UNSIGNED_BYTE, 0, i);
    //glDrawElements(GL_TRIANGLES, sizeof(_indices) / sizeof(_indices[0]), GL_UNSIGNED_BYTE, 0);
    glBindVertexArray(0);

    //[NSThread sleepForTimeInterval:1];

    [_context presentRenderbuffer:GL_RENDERBUFFER];
}


#pragma mark - DFIForceSimulationDelegate

- (void)simulationTickFinished {
    [self forceViewShowPerFrame];
}


#pragma mark - Gesture Recognizer

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    int fingerNum = event.allTouches.count;
    //NSLog(@"vanney code log : fingers num is %d", event.allTouches.count);
    if (fingerNum > 1) {
        return;
    }
    CGPoint tempPoint = [touches.anyObject locationInView:self];
    _touchLocation = [self transformPointInScrollViewWithPoint:tempPoint];
    NSLog(@"vanney code log : start location is x : %f Y : %f", _touchLocation.x, _touchLocation.y);
}


#pragma mark - UIScrollView Delegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    //NSLog(@"vanney code log : offset is %f : %f", self.contentOffset.x, self.contentOffset.y);
    //NSLog(@"vanney code log : scrolled");
    [self forceViewShowPerFrame];
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView {
    return _innerView;
}

- (void)scrollViewDidZoom:(UIScrollView *)scrollView {
    //NSLog(@"vanney code log : current scale is %f", self.zoomScale);
    //NSLog(@"vanney code log : zoomed");
    if (self.zoomScale >= self.maximumZoomScale || self.zoomScale <= self.minimumZoomScale) {

    } else {
        [self forceViewShowPerFrame];
    }
}

- (CGPoint)transformPointInScrollViewWithPoint:(CGPoint)point {
    CGPoint normalizePoint = CGPointMake((point.x - self.contentSize.width / 4.0f) / self.contentSize.width * 2.0f, (point.y - self.contentSize.height / 4.0f) / self.contentSize.height * 2.0f);
    CGPoint transformedPoint = CGPointMake(normalizePoint.x * self.bounds.size.width, normalizePoint.y * self.bounds.size.height);
    return transformedPoint;
}


#pragma other

- (void)pan:(UIPanGestureRecognizer *)recognizer {
  //NSLog(@"vanney code log : pan start");
  CGPoint location = [recognizer locationInView:self];
  CGPoint curPoint = [self transformPointInScrollViewWithPoint:location];
  //NSLog(@"vanney code log : location x : %f y : %f", location.x, location.y);
  if (recognizer.state == UIGestureRecognizerStateBegan) {
    if (_simulation.status == DFIForceSimulationStatusNormal) {
      NSLog(@"vanney code log : hallo");
      //CGPoint firstPoint = [self.forceView transformPointInScrollViewWithPoint:self.forceView.touchLocation];
      _paningNode = [_simulation findNodeWithinRadius:self.radiusInPoint + 3.0f pointX:self.touchLocation.x andPointY:self.bounds.size.height - self.touchLocation.y];
      if (_paningNode != nil) {
        self.scrollEnabled = NO;
        NSLog(@"vanney code log : start pan node");
        _simulation.status = DFIForceSimulationStatusStartPan;
        _simulation.alphaTarget = 0.3f;
        [_simulation restart];
        _paningNode.fx = curPoint.x;
        _paningNode.fy = self.bounds.size.height - curPoint.y;
      }
    }
  } else if (recognizer.state == UIGestureRecognizerStateChanged) {
    _paningNode.fx = curPoint.x;
    _paningNode.fy = self.bounds.size.height - curPoint.y;
  } else if (recognizer.state == UIGestureRecognizerStateEnded || recognizer.state == UIGestureRecognizerStateCancelled) {
    _simulation.alphaTarget = 0.0f;
    _paningNode.fx = NAN;
    _paningNode.fy = NAN;
    _paningNode = nil;
    _simulation.status = DFIForceSimulationStatusNormal;
    self.scrollEnabled = YES;
  }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  return YES;
}

@end

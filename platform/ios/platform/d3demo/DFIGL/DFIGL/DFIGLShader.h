//
//  DFIGLShader.h
//  DFI
//
//  Created by vanney on 2017/2/12.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import <Foundation/Foundation.h>
#include <OpenGLES/ES3/gl.h>
#include <OpenGLES/ES3/glext.h>

@interface DFIGLShader : NSObject

@property(nonatomic, assign) GLuint program;

- (instancetype)initWithVertexPath:(NSString *)vertexPath andFragmentPaht:(NSString *)fragmentPath;
- (void)use;

@end

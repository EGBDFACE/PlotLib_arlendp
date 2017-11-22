//
//  DFIHierarchyTreemapTile.m
//  DFI
//
//  Created by vanney on 2017/3/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyTreemapTile.h"
#import "DFIHierarchyNode.h"
#import "DFIHierarchyNode+Treemap.h"
#import "DFIHelperStack.h"

@implementation DFIHierarchyTreemapTile

static DFIHierarchyTreemapTile *_instance = nil;

+ (instancetype)defaultManager {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DFIHierarchyTreemapTile alloc] init];
        _instance.ratio = (1 + sqrtf(5)) / 2;
    });

    return _instance;
}

- (void)dice:(DFIHierarchyNode *)parent x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    NSMutableArray *children = parent.children;
    int childrenCount = children.count;
    float k = parent.value ? (x1 - x0) / parent.value : parent.value;

    for (int i = 0; i < childrenCount; ++i) {
        DFIHierarchyNode *curNode = [children objectAtIndex:i];
        curNode.y0 = y0;
        curNode.y1 = y1;
        curNode.x0 = x0;
        curNode.x1 = x0 += curNode.value * k;
    }
}

- (void)slice:(DFIHierarchyNode *)parent x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    NSMutableArray *children = parent.children;
    int childrenCount = children.count;
    float k = parent.value ? (y1 - y0) / parent.value : parent.value;

    for (int i = 0; i < childrenCount; ++i) {
        DFIHierarchyNode *curNode = [children objectAtIndex:i];
        curNode.x0 = x0;
        curNode.x1 = x1;
        curNode.y0 = y0;
        curNode.y1 = y0 += curNode.value * k;
    }
}

- (DFIHelperStack *)squarify:(DFIHierarchyNode *)parent x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    NSMutableArray *children = parent.children;
    DFIHelperStack *stack = [[DFIHelperStack alloc] init];
    int childrenCount = children.count;
    float value = parent.value, nodeValue;
    float sumValue, minValue, maxValue, newRatio, minRatio, alpha, beta, dx, dy;
    int i = 0, j = 0;
    while (i < childrenCount) {
        dx = x1 - x0;
        dy = y1 - y0;

        DFIHierarchyNode *curChild;
        do {
            curChild = [children objectAtIndex:j++];
            sumValue = curChild.value;
        } while (!sumValue && j < childrenCount);
        minValue = maxValue = sumValue;
        alpha = MAX(dy / dx, dx / dy) / (value * _ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = MAX(maxValue / beta, beta / minValue);

        for (; j < childrenCount; ++j) {
            curChild = [children objectAtIndex:j];
            sumValue += nodeValue = curChild.value;
            if (nodeValue < minValue) {
                minValue = nodeValue;
            }
            if (nodeValue > maxValue) {
                maxValue = nodeValue;
            }

            beta = sumValue * sumValue * alpha;
            newRatio = MAX(maxValue / beta, beta / minRatio);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }

            minRatio = newRatio;
        }

        // 脱离于root树之外的node
        DFIHierarchyNode *specialNode = [[DFIHierarchyNode alloc] init];
        specialNode.value = sumValue;
        specialNode.children = [children subarrayWithRange:NSMakeRange(i, j - i)];
        [stack push:specialNode];
        if (dx < dy) {
            [self dice:specialNode x0:x0 y0:y0 x1:x1 andY1:value ? y0 += dy * sumValue / value : y1];
        } else {
            [self slice:specialNode x0:x0 y0:y0 x1:value ? x0 += dx * sumValue / value : x1 andY1:y1];
        }
        value -= sumValue;
        i = j;
    }

    return stack;
}

- (void)resquarify:(DFIHierarchyNode *)parent x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {

}


- (void)setRatio:(float)ratio {
    if (ratio > 1.0f) {
        _ratio = ratio;
    } else {
        _ratio = 1.0f;
    }
}

@end

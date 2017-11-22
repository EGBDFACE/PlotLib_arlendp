//
//  DFIHierarchyNode+Treemap.m
//  DFI
//
//  Created by vanney on 2017/3/13.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyNode+Treemap.h"
#import <objc/runtime.h>

NSString *const kValueKey = @"value";
NSString *const kX0Key = @"x0";
NSString *const kX1Key = @"x1";
NSString *const kY0Key = @"y0";
NSString *const kY1Key = @"y1";
NSString *const kRadiusKey = @"radius";

@implementation DFIHierarchyNode (Treemap)

- (void)sum:(float (^)(NSMutableDictionary *))block {
    [self eachAfter:^(DFIHierarchyNode *node) {
        float sum = block(node.data);
        NSMutableArray *children = node.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            for (int i = 0; i < childrenCount; ++i) {
                DFIHierarchyNode *curChild = [children objectAtIndex:i];
                sum += curChild.value;
            }
        }
        node.value = sum;
    }];
}

- (void)sort:(BOOL (^)(DFIHierarchyNode *, DFIHierarchyNode *))block {
    [self eachBefore:^(DFIHierarchyNode *node) {
        if (node.children.count > 0) {
            NSArray *sortedArray;
            sortedArray = [node.children sortedArrayUsingComparator:^NSComparisonResult(DFIHierarchyNode *obj1, DFIHierarchyNode *obj2) {
                if (block(obj1, obj2)) {
                    return NSOrderedDescending;
                } else {
                    return NSOrderedAscending;
                }
            }];
            node.children = [sortedArray mutableCopy];
        }
    }];
}


//- (void)setValue:(float)value {
//    objc_setAssociatedObject(self, &kValueKey, @(value), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
//}
//
//- (float)value {
//    return [objc_getAssociatedObject(self, &kValueKey) floatValue];
//}

- (void)setX0:(float)x0 {
    objc_setAssociatedObject(self, &kX0Key, @(x0), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (float)x0 {
    return [objc_getAssociatedObject(self, &kX0Key) floatValue];
}

- (void)setX1:(float)x1 {
    objc_setAssociatedObject(self, &kX1Key, @(x1), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (float)x1 {
    return [objc_getAssociatedObject(self, &kX1Key) floatValue];
}

- (void)setY0:(float)y0 {
    objc_setAssociatedObject(self, &kY0Key, @(y0), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (float)y0 {
    return [objc_getAssociatedObject(self, &kY0Key) floatValue];
}

- (void)setY1:(float)y1 {
    objc_setAssociatedObject(self, &kY1Key, @(y1), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (float)y1 {
    return [objc_getAssociatedObject(self, &kY1Key) floatValue];
}

//- (void)setRadius:(float)radius {
//    objc_setAssociatedObject(self, &kRadiusKey, @(radius), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
//}
//
//- (float)radius {
//    return [objc_getAssociatedObject(self, &kRadiusKey) floatValue];
//}



@end

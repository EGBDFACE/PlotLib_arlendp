//
//  DFIHierarchyPack.m
//  DFI
//
//  Created by vanney on 2017/3/15.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyPack.h"
#import "DFIHierarchyNode+Treemap.h"
#import "DFIHelperStack.h"


@interface DFIHierarchyPackNode : NSObject
@property (nonatomic, strong) DFIHierarchyNode *data;
@property (nonatomic, strong) DFIHierarchyPackNode *previous;
@property (nonatomic, strong) DFIHierarchyPackNode *next;
@end

@implementation DFIHierarchyPackNode
- (instancetype)initWithData:(DFIHierarchyNode *)data {
    if (self = [super init]) {
        _data = data;
        _previous = _next = nil;
    }

    return self;
}
@end



@interface DFIHierarchyPack()
@property (nonatomic, assign) float dx;
@property (nonatomic, assign) float dy;
@end

@implementation DFIHierarchyPack

- (instancetype)init {
    if (self = [super init]) {
        // 初始化设置
        _dx = _dy = 1.0f;
        _radius = NAN;
        _padding = 0.0f;
    }

    return self;
}

- (void)loadRootData:(DFIHierarchyNode *)root {
    _root = root;
    _root.x = _dx / 2;
    _root.y = _dy / 2;
    __weak DFIHierarchyPack *weafSelf = self;
    if (isnan(_radius)) {
        [_root eachBefore:^(DFIHierarchyNode *node) {
            [weafSelf pRadiusLeaf:node];
        }];
        [_root eachAfter:^(DFIHierarchyNode *node) {
            //NSLog(@"node id is %@", [node.data objectForKey:@"id"]);
            [weafSelf pPackChildren:node withPadding:0.0f andK:1.0f];
        }];
        [_root eachAfter:^(DFIHierarchyNode *node) {
            [weafSelf pPackChildren:node withPadding:weafSelf.padding andK:weafSelf.root.radius / MIN(weafSelf.dx, weafSelf.dy)];
        }];
        float remainK = MIN(_dx, _dy) / (2 * _root.radius);
        [_root eachBefore:^(DFIHierarchyNode *node) {
            [weafSelf pTranslateChildWithNode:node andK:remainK];
        }];
    } else {
        // TODO - deal with setting radius
    }
}

- (DFIHierarchyPack *)size:(CGSize)size {
    _dx = size.width;
    _dy = size.height;
    return self;
}


#pragma mark - Private Method

/*
 * 叶子节点的半径就是他的value值
 */
- (void)pRadiusLeaf:(DFIHierarchyNode *)node {
    if (node.children.count <= 0) {
        node.radius = MAX(0, [self pDefaultRadius:node]);
    }
}

- (float)pDefaultRadius:(DFIHierarchyNode *)node {
    return sqrtf(node.value);
}

/*
 * pack children
 */
- (void)pPackChildren:(DFIHierarchyNode *)node withPadding:(float)padding andK:(float)k {
    NSMutableArray *children = node.children;
    int childrenCount = children.count;
    if (childrenCount > 0) {
        DFIHierarchyNode *curChild;
        float radius = padding * k;
        if (radius != 0.0f) {
            for (int i = 0; i < childrenCount; ++i) {
                curChild = [children objectAtIndex:i];
                curChild.radius += radius;
            }
        }
        float e = [self pPackEnclose:children];
        if (radius != 0.0f) {
            for (int i = 0; i < childrenCount; ++i) {
                curChild = [children objectAtIndex:i];
                curChild.radius -= radius;
            }
        }
        node.radius = e + radius;
    }
}

/*
 *
 */
- (void)pTranslateChildWithNode:(DFIHierarchyNode *)node andK:(float)k {
    DFIHierarchyNode *parent = node.parent;
    node.radius *= k;
    if (parent) {
        node.x = parent.x + k * node.x;
        node.y = parent.y + k * node.y;
    }
}


#pragma mark - Siblings

- (float)pPackEnclose:(NSMutableArray *)children {
    int childrenCount = children.count;
    if (childrenCount <= 0) {
        return 0;
    }

    // 放置第一个圆
    DFIHierarchyNode *a = [children firstObject];
    a.x = a.y = 0.0f;
    if (childrenCount <= 1) {
        // 只有一个就直接返回这一个圆的半径
        return a.radius;
    }

    // 放置第二个圆
    DFIHierarchyNode *b = [children objectAtIndex:1];
    a.x = -b.radius;
    b.x = a.radius;
    b.y = 0;
    if (childrenCount <= 2) {
        return a.radius + b.radius;
    }

    // 放置第三个圆
    DFIHierarchyNode *c = [children objectAtIndex:2];
    [self pPlaceA:b b:a andC:c];

    // 求出中心的坐标
    float aa = a.radius * a.radius;
    float ba = b.radius * b.radius;
    float ca = c.radius * c.radius;
    float oa = aa + ba + ca;
    float ox = aa * a.x + ba * b.x + ca * c.x;
    float oy = aa * a.y + ba * b.y + ca * c.y;
    float cx, cy;

    // 初始化 front-chain
    DFIHierarchyPackNode *packA = [[DFIHierarchyPackNode alloc] initWithData:a];
    DFIHierarchyPackNode *packB = [[DFIHierarchyPackNode alloc] initWithData:b];
    DFIHierarchyPackNode *packC = [[DFIHierarchyPackNode alloc] initWithData:c];
    packA.next = packC.previous = packB;
    packB.next = packA.previous = packC;
    packC.next = packB.previous = packA;

    // 继续插入剩余的圆
    //int count = 0;
    for (int i = 3; i < childrenCount; ++i) {
        BOOL flag = NO;
        DFIHierarchyNode *curChild = [children objectAtIndex:i];
        DFIHierarchyPackNode *curPack = [[DFIHierarchyPackNode alloc] initWithData:curChild];
        [self pPlaceA:packA.data b:packB.data andC:curChild];

        DFIHierarchyPackNode *j = packB.next;
        DFIHierarchyPackNode *k = packA.previous;
        float sj = packB.data.radius;
        float sk = packA.data.radius;

        // 插入一个，要遍历整个front-chain
        do {
            //NSLog(@"count is %d", ++count);
            if (sj <= sk) {
                if ([self pIntersectsBetweenA:j.data andB:curPack.data]) {
                    flag = YES;
                    if (sj + packA.data.radius + packB.data.radius > [self pDistanceBetweenA:j andB:packB]) {
                        packA = j;
                    } else {
                        packB = j;
                    }
                    packA.next = packB;
                    packB.previous = packA;
                    --i;

                    break;
                }
                sj += j.data.radius;
                j = j.next;
            } else {
                if ([self pIntersectsBetweenA:k.data andB:curPack.data]) {
                    flag = YES;
                    if ([self pDistanceBetweenA:packA andB:k] > sk + packA.data.radius + packB.data.radius) {
                        packA = k;
                    } else {
                        packB = k;
                    }
                    packA.next = packB;
                    packB.previous = packA;
                    --i;

                    break;
                }
                sk += k.data.radius;
                k = k.previous;
            }
        } while (j != k.next);

        // 插入不成功,重新插入
        if (flag) {
            continue;
        }

        // 插入成功，更新front-chain
        curPack.previous = packA;
        curPack.next = packB;
        packA.next = packB.previous = curPack;
        packB = curPack;

        // 更新中心的位置
        oa += ca = curPack.data.radius * curPack.data.radius;
        ox += ca * curPack.data.x;
        oy += ca * curPack.data.y;

        // 计算距离中心最近的圆
        aa = [self pDistanceForCircle:packA.data x:cx = ox / oa andY:cy = oy / oa];
        while ((curPack = curPack.next) != packB) {
            if ((ca = [self pDistanceForCircle:curPack.data x:cx andY:cy]) < aa) {
                packA = curPack;
                aa = ca;
            }
        }
        packB = packA.next;
    }


    // 以上：将圆全部插入。即将开始计算包含所有这些圆的大圆(enclose)
    NSMutableArray *frontChainChildren = [NSMutableArray new];
    [frontChainChildren addObject:packB.data];
    DFIHierarchyPackNode *curPack = packB;
    while ((curPack = curPack.next) != packB) {
        [frontChainChildren addObject:curPack.data];
    }

    NSDictionary *encloseCircle = [self pEncloseWithFrontChainNodes:frontChainChildren];

    for (int l = 0; l < childrenCount; ++l) {
        DFIHierarchyNode *curNode = [children objectAtIndex:l];
        curNode.x -= [[encloseCircle objectForKey:@"x"] floatValue];
        curNode.y -= [[encloseCircle objectForKey:@"y"] floatValue];
    }

    return [[encloseCircle objectForKey:@"r"] floatValue];
}

/*
 * 放置三个圆，互相相切
 */
- (void)pPlaceA:(DFIHierarchyNode *)a b:(DFIHierarchyNode *)b andC:(DFIHierarchyNode *)c {
    float ax = a.x;
    float ay = a.y;
    float da = b.radius + c.radius;
    float db = a.radius + c.radius;
    float dx = b.x - ax;
    float dy = b.y - ay;
    float dc = dx * dx + dy * dy;
    if (dc) {
        float x = 0.5f + ((db *= db) - (da *= da)) / (2 * dc);
        float y = sqrtf(MAX(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);

        c.x = ax + x * dx + y * dy;
        c.y = ay + x * dy - y * dx;
    } else {
        c.x = ax + db;
        c.y = ay;
    }
}

/*
 * 判断两圆是否相交
 */
- (BOOL)pIntersectsBetweenA:(DFIHierarchyNode *)a andB:(DFIHierarchyNode *)b {
    float dx = b.x - a.x;
    float dy = b.y - a.y;
    float dr = a.radius + b.radius;
    if ((dr * dr - 1e-6) > (dx * dx + dy * dy)) {
        return YES;
    } else {
        return NO;
    }
}

/*
 * 根据距离判断前圆和后圆
 */
- (float)pDistanceBetweenA:(DFIHierarchyPackNode *)a andB:(DFIHierarchyPackNode *)b {
    float l = a.data.radius;
    while (a != b) {
        l += 2 * (a = a.next).data.radius;
    }
    return l - b.data.radius;
}

/*
 * 计算圆和中心的距离
 */
- (float)pDistanceForCircle:(DFIHierarchyNode *)node x:(float)x andY:(float)y {
    float dx = node.x - x;
    float dy = node.y - y;
    return dx * dx + dy * dy;
}


#pragma mark - Enclose

- (NSDictionary *)pEncloseWithFrontChainNodes:(NSMutableArray *)nodes {
    DFIHelperStack *B = [[DFIHelperStack alloc] init];
    return [self pEncloseNWithL:[self pShuffle:nodes] andB:B];
}


/*
 * 将nodes构成链表
 */
- (NSMutableDictionary *)pShuffle:(NSMutableArray *)array {
    NSMutableArray *arrayCopy = [array mutableCopy];
    int n = arrayCopy.count;
    DFIHierarchyPackNode *head = nil, *node = nil;

    while (n) {
        DFIHierarchyPackNode *next = [[DFIHierarchyPackNode alloc] initWithData:[arrayCopy objectAtIndex:n - 1]];
        if (node) {
            node.next = next;
            node = next;
        } else {
            head = next;
            node = next;
        }

        n--;
    }

    // 返回链表的形式： {head: head, tail: node}
    NSMutableDictionary *result = [NSMutableDictionary new];
    if (head) {
        [result setObject:head forKey:@"head"];
    }
    if (node) {
        [result setObject:node forKey:@"tail"];
    }
    return result;
}

/*
 * 求出包含L和B的最小圆，（B在最小圆的边界）
 */
- (NSDictionary *)pEncloseNWithL:(NSMutableDictionary *)L andB:(DFIHelperStack *)B {
    NSDictionary *circle = nil;
    DFIHierarchyPackNode *l0 = nil, *l1 = [L objectForKey:@"head"], *l2 = nil;
    DFIHierarchyNode *p1 = nil;

    // B的长度不会超过3
    int BLength = [B length];
    switch (BLength) {
        case 1:
            circle = [self pEncloseWithNode:[B.contents firstObject]];
            break;
        case 2:
            circle = [self pEncloseWithNodeA:[B.contents firstObject] andNodeB:[B.contents lastObject]];
            break;
        case 3:
            circle = [self pEncloseWithNodeA:[B.contents firstObject] nodeB:[B.contents objectAtIndex:1] andNodeC:[B.contents lastObject]];
            break;
        default:
            break;
    }

    while (l1 != nil) {
        p1 = l1.data;
        l2 = l1.next;

        if (!circle || ![self pEnclosesWithCircle:circle andNode:p1]) {
            // 新来的圆和之前算的最小圆冲突了，得扩大最小圆

            if (l0) {
                [L setObject:l0 forKey:@"tail"];
                l0.next = nil;
            } else {
                [L removeAllObjects];
            }

            [B push:p1];
            circle = [self pEncloseNWithL:L andB:B];
            [B pop];

            if ([L objectForKey:@"head"]) {
                l1.next = [L objectForKey:@"head"];
                [L setObject:l1 forKey:@"head"];
            } else {
                l1.next = nil;
                [L setObject:l1 forKey:@"head"];
                [L setObject:l1 forKey:@"tail"];

            }

            l0 = [L objectForKey:@"tail"];
            l0.next = l2;

        } else {
            // 新来的圆在最小圆内部，忽略
            l0 = l1;
        }
        l1 = l2;
    }

    if (l0) {
        [L setObject:l0 forKey:@"tail"];
    } else {
        [L removeObjectForKey:@"tail"];
    }

    return circle;
}

/*
 * B中包含一个圆的时候，求外包圆
 */
- (NSDictionary *)pEncloseWithNode:(DFIHierarchyNode *)node {
    NSDictionary *result = [NSDictionary dictionaryWithObjectsAndKeys:@(node.x), @"x", @(node.y), @"y", @(node.radius), @"r", nil];
    return result;
}

/*
 * B中包含2个圆的时候，求外包圆
 */
- (NSDictionary *)pEncloseWithNodeA:(DFIHierarchyNode *)a andNodeB:(DFIHierarchyNode *)b {
    float x1 = a.x, y1 = a.y, r1 = a.radius;
    float x2 = b.x, y2 = b.y, r2 = b.radius;
    float x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1;
    float l = sqrtf(x21 * x21 + y21 * y21);

    float x = (x1 + x2 + x21 / l * r21) / 2;
    float y = (y1 + y2 + y21 / l * r21) / 2;
    float r = (l + r1 + r2) / 2;

    NSDictionary *result = [NSDictionary dictionaryWithObjectsAndKeys:@(x), @"x", @(y), @"y", @(r), @"r", nil];
    return result;
}

/*
 * B中包含3个圆的时候，求外包圆
 */
- (NSDictionary *)pEncloseWithNodeA:(DFIHierarchyNode *)a nodeB:(DFIHierarchyNode *)b andNodeC:(DFIHierarchyNode *)c {
    float x1 = a.x, y1 = a.y, r1 = a.radius;
    float x2 = b.x, y2 = b.y, r2 = b.radius;
    float x3 = c.x, y3 = c.y, r3 = c.radius;
    float a2 = 2 * (x1 - x2);
    float b2 = 2 * (y1 - y2);
    float c2 = 2 * (r2 - r1);
    float d2 = x1 * x1 + y1 * y1 - r1 * r1 - x2 * x2 - y2 * y2 + r2 * r2;
    float a3 = 2 * (x1 - x3);
    float b3 = 2 * (y1 - y3);
    float c3 = 2 * (r3 - r1);
    float d3 = x1 * x1 + y1 * y1 - r1 * r1 - x3 * x3 - y3 * y3 + r3 * r3;
    float ab = a3 * b2 - a2 * b3;
    float xa = (b2 * d3 - b3 * d2) / ab - x1;
    float xb = (b3 * c2 - b2 * c3) / ab;
    float ya = (a3 * d2 - a2 * d3) / ab - y1;
    float yb = (a2 * c3 - a3 * c2) / ab;
    float A = xb * xb + yb * yb - 1;
    float B = 2 * (xa * xb + ya * yb + r1);
    float C = xa * xa + ya * ya - r1 * r1;
    float r = (-B - sqrtf(B * B - 4 * A * C)) / (2 * A);
    float x = xa + xb * r + x1;
    float y = ya + yb * r + y1;

    NSDictionary *result = [NSDictionary dictionaryWithObjectsAndKeys:@(x), @"x", @(y), @"y", @(r), @"r", nil];
    return result;
}

/*
 * 判断新来的圆是否在外包圆内部
 */
- (BOOL)pEnclosesWithCircle:(NSDictionary *)circle andNode:(DFIHierarchyNode *)node {
    float dx = node.x - [[circle objectForKey:@"x"] floatValue];
    float dy = node.y - [[circle objectForKey:@"y"] floatValue];
    float dr = [[circle objectForKey:@"r"] floatValue] - node.radius;
    if (dr * dr - 1e-6 > dx * dx + dy * dy) {
        return YES;
    } else {
        return NO;
    }
}


@end

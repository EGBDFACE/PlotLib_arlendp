//
//  DFIQuadtree.m
//  DFI
//
//  Created by vanney on 2017/2/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIQuadtree.h"
#import "DFIHelperStack.h"

@implementation DFIQuadtreeQuad

- (instancetype)initWithItem:(DFIQuadtreeItem *)item x0:(float)x0 y0:(float)y0 x1:(float)x1 andY1:(float)y1 {
    if (self = [super init]) {
        _item = item;
        _x0 = x0;
        _x1 = x1;
        _y0 = y0;
        _y1 = y1;
    }

    return self;
}

@end



@interface DFIQuadtree()
// (x0, y0) 左下角 (x1, y1) 右上角
@property(nonatomic, assign) float x0;
@property(nonatomic, assign) float y0;
@property(nonatomic, assign) float x1;
@property(nonatomic, assign) float y1;
//@property(nonatomic, assign) float x;
//@property(nonatomic, assign) float y;
@property (nonatomic, strong) DFIQuadtreeItem *root;
@end


@implementation DFIQuadtree

#pragma mark - public method

- (instancetype)init {
    if (self = [super init]) {
        _root = [[DFIQuadtreeItem alloc] init];
        _x0 = _y0 = _x1 = _y1 = NAN;
    }

    return self;
}

- (void)addAll:(NSMutableArray *)nodes {
    int n = nodes.count;
    float  x0, y0, x1, y1;
    x0 = y0 = INFINITY;
    x1 = y1 = -INFINITY;


    // TODO - change other temp array from NSNumber to float
    //float xz[n], yz[n];


    // 计算四叉树边界
    for (int i = 0; i < n; ++i) {
        DFIForceNode *curNode = [nodes objectAtIndex:i];
        if (isnan(curNode.x) || isnan(curNode.y)) {
            continue;
        }
        float x, y;
        x = curNode.x;
        y = curNode.y;
        //xz[i] = x;
        //yz[i] = y;
        if (x < x0) { x0 = x; }
        if (x > x1) { x1 = x; }
        if (y < y0) { y0 = y; }
        if (y > y1) { y1 = y; }
    }

    // 如果边界不符要求 还原
    if (x1 < x0) {
        x0 = _x0;
        x1 = _x1;
    }
    if (y1 < y0) {
        y0 = _y0;
        y1 = _y1;
    }

    // 重新定义边界，并重构节点等等
    [self coverWithX:x0 andY:y0];
    [self coverWithX:x1 andY:y1];

    // 添加node
    for (int j = 0; j < n; ++j) {
        DFIForceNode *curNode = [nodes objectAtIndex:j];
        [self addNode:curNode];
    }
}

- (void)coverWithX:(float)x andY:(float)y {
    // ignore invalid point
    if (isnan(x) || isnan(y)) {
        return;
    }

    float x0, y0, x1, y1;
    x0 = _x0;
    y0 = _y0;
    x1 = _x1;
    y1 = _y1;

    // TODO - 判断item的状态为empty，不过不知道有没有这个必要
    // 如果都没定义的话，初始化边界为 1x1的正方形
    if (isnan(x0)) {
        x0 = floorf(x);
        y0 = floorf(y);
        x1 = x0 + 1;
        y1 = y0 + 1;
    } else if (x0 > x || x > x1 || y0 > y || y > y1) {  // 如果超过原有区域，2倍扩大，直到包含该点
        float step = x1 - x0;
        DFIQuadtreeItem *item = _root;
        DFIQuadtreeItem *parent;
        int left = 0, bottom = 0;
        if (y < (y0 + y1) / 2) {
            bottom = 1;
        }
        if (x < (x0 + x1) / 2) {
            left = 1;
        }

        int quadrant = bottom << 1 | left;


        switch (quadrant) {
            case 0: {
                do {
                    if ([item itemStatus] != DFIQuadtreeItemStatusEmpty) {
                        parent = [[DFIQuadtreeItem alloc] init];
                        [parent.items replaceObjectAtIndex:quadrant withObject:item];
                        item = parent;
                    }

                    // 2倍增加
                    step *= 2;
                    x1 = x0 + step;
                    y1 = y0 + step;
                } while (x > x1 || y > y1);
                break;
            }
            case 1: {
                do {
                    if ([item itemStatus] != DFIQuadtreeItemStatusEmpty) {
                        parent = [[DFIQuadtreeItem alloc] init];
                        [parent.items replaceObjectAtIndex:quadrant withObject:item];
                        item = parent;
                    }

                    // 2倍增加
                    step *= 2;
                    x0 = x1 - step;
                    y1 = y0 + step;
                } while (x > x1 || y > y1);
                break;
            }
            case 2: {
                do {
                    if ([item itemStatus] != DFIQuadtreeItemStatusEmpty) {
                        parent = [[DFIQuadtreeItem alloc] init];
                        [parent.items replaceObjectAtIndex:quadrant withObject:item];
                        item = parent;
                    }

                    // 2倍增加
                    step *= 2;
                    x1 = x0 + step;
                    y0 = y1 - step;
                } while (x > x1 || y > y1);
                break;
            }
            case 3: {
                do {
                    if ([item itemStatus] != DFIQuadtreeItemStatusEmpty) {
                        parent = [[DFIQuadtreeItem alloc] init];
                        [parent.items replaceObjectAtIndex:quadrant withObject:item];
                        item = parent;
                    }

                    // 2倍增加
                    step *= 2;
                    x0 = x1 - step;
                    y0 = y1 - step;
                } while (x > x1 || y > y1);
                break;
            }
            default:
                break;
        }

        if (_root != nil) {
            _root = item;
        }

    } else { // 原有区域包含该点，直接返回
        return;
    }

    _x0 = x0;
    _y0 = y0;
    _x1 = x1;
    _y1 = y1;
}

- (void)addNode:(DFIForceNode *)node {
    // ignore invalid node
    if (isnan(node.x) || isnan(node.y)) {
        return;
    }


    // initialize variable
    DFIQuadtreeItem *curItem = _root;
    DFIQuadtreeItem *parentItem = nil;
    //DFIForceNode *leaf;
    float x0, y0, x1, y1, xm, ym, xp, yp;
    int right, top, quadrant, quadrant1;
    x0 = _x0;
    y0 = _y0;
    x1 = _x1;
    y1 = _y1;

    // 第一次进来，没有任何的节点的时候（empty）
    if ([curItem itemStatus] == DFIQuadtreeItemStatusEmpty) {
        _root = [[DFIQuadtreeItem alloc] initWithLeaf:node];
        return;
    }

    // 当前处于四叉树的非叶子节点时（branch）
    while ([curItem itemStatus] == DFIQuadtreeItemStatusBranch) {
        xm = (x0 + x1) / 2;
        ym = (y0 + y1) / 2;
        if (node.x >= xm) {
            right = 1;
            x0 = xm;
        } else {
            right = 0;
            x1 = xm;
        }
        if (node.y >= ym) {
            top = 1;
            y0 = ym;
        } else {
            top = 0;
            y1 = ym;
        }

        quadrant = top << 1 | right;

        parentItem = curItem;
        curItem = [parentItem.items objectAtIndex:quadrant];
        if (curItem == [NSNull null]) {
            DFIQuadtreeItem *newItem = [[DFIQuadtreeItem alloc] initWithLeaf:node];
            [parentItem.items replaceObjectAtIndex:quadrant withObject:newItem];
            return;
        }
    }

    // 当前处于叶子节点时（leaf）
    xp = curItem.node.x;
    yp = curItem.node.y;
    // 如果要添加的leaf和当前的leaf相同的话
    if (node.x == xp && node.y == yp) {
        // TODO - add leaf next property
        return;
    }

    // 和当前leaf不是同一个leaf时，添加四叉树结构
    //leaf = curItem.node;
    do {
        if (parentItem == nil) {
            parentItem = [[DFIQuadtreeItem alloc] init];
            _root = parentItem;
        } else {
            DFIQuadtreeItem *newItem = [[DFIQuadtreeItem alloc] init];
            [parentItem.items replaceObjectAtIndex:quadrant withObject:newItem];
            parentItem = newItem;
        }

        xm = (x0 + x1) / 2;
        ym = (y0 + y1) / 2;

        // 求要插入点的象限
        if (node.x >= xm) {
            right = 1;
            x0 = xm;
        } else {
            right = 0;
            x1 = xm;
        }
        if (node.y >= ym) {
            top = 1;
            y0 = ym;
        } else {
            top = 0;
            y1 = ym;
        }
        quadrant = top << 1 | right;

        // 求相冲突点的象限
        int right1 = 0, top1 = 0;
        if (xp >= xm) {
            right1 = 1;
        }
        if (yp >= ym) {
            top1 = 1;
        }
        quadrant1 = top1 << 1 | right1;
    } while (quadrant == quadrant1);

    DFIQuadtreeItem *targetItem = [[DFIQuadtreeItem alloc] initWithLeaf:node];
    DFIQuadtreeItem *originItem = [[DFIQuadtreeItem alloc] initWithLeaf:curItem.node];
    [parentItem.items replaceObjectAtIndex:quadrant withObject:targetItem];
    [parentItem.items replaceObjectAtIndex:quadrant1 withObject:originItem];
}


// 前序遍历
- (void)visit {
    DFIHelperStack *quadStack = [[DFIHelperStack alloc] init];

    if ([_root itemStatus] != DFIQuadtreeItemStatusEmpty) {
        [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:_root x0:_x0 y0:_y0 x1:_x1 andY1:_y1]];
    }

    BOOL responseFlag = [self.delegate respondsToSelector:@selector(quadtree: visitItem: x0: y0: x1: andY1:)];

    DFIQuadtreeQuad *curQuad = nil;
    while ((curQuad = [quadStack pop]) != nil) {
        if (responseFlag) {
            DFIQuadtreeItem *curItem = curQuad.item;
            BOOL callbackFlag = [self.delegate quadtree:self visitItem:curQuad.item x0:curQuad.x0 y0:curQuad.y0 x1:curQuad.x1 andY1:curQuad.y1];
            if (!callbackFlag && [curItem itemStatus] == DFIQuadtreeItemStatusBranch) {
                float x0 = curQuad.x0, y0 = curQuad.y0, x1 = curQuad.x1, y1 = curQuad.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
                for (int i = 3; i >= 0; --i) {
                    DFIQuadtreeItem *subItem = [curItem.items objectAtIndex:i];
                    if (subItem != [NSNull null]) {
                        switch (i) {
                            case 0:
                                [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:x0 y0:y0 x1:xm andY1:ym]];
                                break;
                            case 1:
                                [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:xm y0:y0 x1:x1 andY1:ym]];
                                break;
                            case 2:
                                [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:x0 y0:ym x1:xm andY1:y1]];
                                break;
                            case 3:
                                [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:xm y0:ym x1:x1 andY1:y1]];
                                break;
                            default:
                                break;
                        }

                    }
                }
            }
        } else {
            return;
        }
    }

    /* release backend */
    DFIHelperStack *tmp = quadStack;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        [tmp class];
    });
}


// 后序遍历
- (void)visitAfter {
    DFIHelperStack *quadStack = [[DFIHelperStack alloc] init];
    DFIHelperStack *resultStack = [[DFIHelperStack alloc] init];

    if ([_root itemStatus] != DFIQuadtreeItemStatusEmpty) {
        [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:_root x0:_x0 y0:_y0 x1:_x1 andY1:_y1]];
    }

    DFIQuadtreeQuad *curQuad = nil;
    while ((curQuad = [quadStack pop]) != nil) {
        DFIQuadtreeItem *curItem = curQuad.item;
        if ([curItem itemStatus] == DFIQuadtreeItemStatusBranch) {
            float x0 = curQuad.x0, y0 = curQuad.y0, x1 = curQuad.x1, y1 = curQuad.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            for (int i = 0; i < 4; ++i) {
                DFIQuadtreeItem *subItem = [curItem.items objectAtIndex:i];
                if (subItem != [NSNull null]) {
                    switch (i) {
                        case 0:
                            [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:x0 y0:y0 x1:xm andY1:ym]];
                            break;
                        case 1:
                            [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:xm y0:y0 x1:x1 andY1:ym]];
                            break;
                        case 2:
                            [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:x0 y0:ym x1:xm andY1:y1]];
                            break;
                        case 3:
                            [quadStack push:[[DFIQuadtreeQuad alloc] initWithItem:subItem x0:xm y0:ym x1:x1 andY1:y1]];
                            break;
                        default:
                            break;
                    }

                }
            }
        }
        [resultStack push:curQuad];
    }

    // 一个一个执行回调函数
    while ((curQuad = [resultStack pop]) != nil) {
        if([self.delegate respondsToSelector:@selector(quadtree: visitAfterItem: x0: y0: x1: andY1:)]) {
            [self.delegate quadtree:self visitAfterItem:curQuad.item x0:curQuad.x0 y0:curQuad.y0 x1:curQuad.x1 andY1:curQuad.y1];
        }
    }
}

@end

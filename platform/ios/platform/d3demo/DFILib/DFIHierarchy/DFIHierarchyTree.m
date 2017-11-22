//
//  DFIHierarchyTree.m
//  DFI
//
//  Created by vanney on 2017/3/9.
//  Copyright © 2017年 vanney9. All rights reserved.
//

#import "DFIHierarchyTree.h"
#import "DFIHierarchyNode.h"

#import "DFIHelperQueue.h"

@interface DFIHierarchyTreeNode : DFIHierarchyNode
@property (nonatomic, strong) DFIHierarchyNode *baseNode;
@property (nonatomic, strong) DFIHierarchyTreeNode *parent;
@property (nonatomic, strong) NSMutableArray *children;
@property (nonatomic, assign) int index;

@property (nonatomic, strong) DFIHierarchyTreeNode *A;
@property (nonatomic, weak) DFIHierarchyTreeNode *an;
@property (nonatomic, strong) DFIHierarchyTreeNode *t; // pointer to its thread

@property (nonatomic, assign) float z;
@property (nonatomic, assign) float m;
@property (nonatomic, assign) float c;
@property (nonatomic, assign) float s;
/*
 * 使用 hierarchy node 初始化 tree node
 */
- (instancetype)initWithHierarchyNode:(DFIHierarchyNode *)hierarchyNode andIndex:(int)index;
@end

@implementation DFIHierarchyTreeNode
- (instancetype)initWithHierarchyNode:(DFIHierarchyNode *)hierarchyNode andIndex:(int)index {
    if (self = [super init]) {
        _baseNode = hierarchyNode;
        self.parent = nil;
        self.children = [NSMutableArray new];
        _index = index;
        _an = self;
        _A = nil;
        _t = nil;
        _z = _m = _c = _s = 0;
    }

    return self;
}
@end



@interface DFIHierarchyTree()
@property (nonatomic, copy) int (^defaultSeparation)(DFIHierarchyNode *, DFIHierarchyNode *);
@property (nonatomic, assign) float dx;
@property (nonatomic, assign) float dy;
@property (nonatomic, assign) BOOL nodeSize;

@property (nonatomic, strong) DFIHierarchyTreeNode *treeRoot;
@end

@implementation DFIHierarchyTree

- (instancetype)init {
    if (self = [super init]) {
        _dx = 1.0f;
        _dy = 1.0f;
        _nodeSize = NO;
        _defaultSeparation = ^int(DFIHierarchyNode *a, DFIHierarchyNode *b) {
            if (a.parent == b.parent) {
                return 1;
            } else {
                return 2;
            }
        };
        _separation = _defaultSeparation;
    }

    return self;
}

- (void)loadRootNode:(DFIHierarchyNode *)root {
    _root = root;
    _treeRoot = [self pTreeRoot:root];

    __weak DFIHierarchyTree *weakSelf = self;
    [_treeRoot eachAfter:^(DFIHierarchyNode *node) {
        DFIHierarchyTreeNode *v = (DFIHierarchyTreeNode *)node;
        NSMutableArray *children = v.children;
        NSMutableArray *siblings = v.parent.children;
        DFIHierarchyTreeNode *w = v.index ? [siblings objectAtIndex:v.index - 1] : nil;

        int childrenCount = children.count;
        if (childrenCount > 0) {
            [self pExcuteShifts:v];
            DFIHierarchyTreeNode *firstChild = [children firstObject];
            DFIHierarchyTreeNode *lastChild = [children lastObject];
            float midPoint = (firstChild.z + lastChild.z) / 2;
            if (w) {
                v.z = w.z + weakSelf.separation(v.baseNode, w.baseNode);
                v.m = v.z - midPoint;
            } else {
                v.z = midPoint;
            }
        } else if (w) {
            v.z = w.z + weakSelf.separation(v.baseNode, w.baseNode);
        }
        v.parent.A = [weakSelf pApportionWithV:v w:w andAncestor:v.parent.A != nil ? v.parent.A : [siblings firstObject]];
        DFIHierarchyTreeNode *testP = v.parent;
        NSLog(@"pause");
    }];

    _treeRoot.parent.m = -_treeRoot.z;

    [_treeRoot eachBefore:^(DFIHierarchyNode *node) {
        DFIHierarchyTreeNode *v = (DFIHierarchyTreeNode *) node;
        v.baseNode.x = v.z + v.parent.m;
        v.m += v.parent.m;
    }];

    if (_nodeSize) {

    } else {
        __block DFIHierarchyNode *left = _root, *right = _root, *bottom = _root;
        [_root eachBefore:^(DFIHierarchyNode *node) {
            if (node.x < left.x) {
                left = node;
            }
            if (node.x > right.x) {
                right = node;
            }
            if (node.depth > bottom.depth) {
                bottom = node;
            }
        }];

        float s = (left == right) ? 1 : _separation(left, right) / 2;
        float tx = s - left.x;
        float kx = _dx / (right.x + s + tx);
        float ky = _dy / (bottom.depth != 0 ? bottom.depth : 1);

        [_root eachBefore:^(DFIHierarchyNode *node) {
            node.x = (node.x + tx) * kx;
            node.y = node.depth * ky;
        }];
    }
}

- (DFIHierarchyTree *)size:(CGSize)size {
    // TODO - deal with nodeSize
    _dx += size.width;
    _dy += size.height;
    return self;
}


#pragma mark - Private Method

- (DFIHierarchyTreeNode *)pTreeRoot:(DFIHierarchyNode *)root {
    DFIHierarchyTreeNode *treeRoot = [[DFIHierarchyTreeNode alloc] initWithHierarchyNode:root andIndex:0];

    DFIHelperQueue *queue = [[DFIHelperQueue alloc] init];
    [queue enqueue:treeRoot];

    DFIHierarchyTreeNode *curTreeNode;
    while (curTreeNode = [queue dequeue]) {
        DFIHierarchyNode *curNode = curTreeNode.baseNode;
        NSMutableArray *children = curNode.children;
        int childrenCount = children.count;
        if (childrenCount > 0) {
            for (int i = 0; i < childrenCount; ++i) {
                DFIHierarchyTreeNode *curChildrenTreeNode = [[DFIHierarchyTreeNode alloc] initWithHierarchyNode:[children objectAtIndex:i] andIndex:i];
                [curTreeNode.children addObject:curChildrenTreeNode];
                curChildrenTreeNode.parent = curTreeNode;
                [queue enqueue:curChildrenTreeNode];
            }
        }
    }

    DFIHierarchyTreeNode *originalTreeNode = [[DFIHierarchyTreeNode alloc] initWithHierarchyNode:nil andIndex:0];
    treeRoot.parent = originalTreeNode;
    [originalTreeNode.children addObject:treeRoot];

    return treeRoot;
}

/*
 *
 */
- (void)pExcuteShifts:(DFIHierarchyTreeNode *)treeNode {
    int shift = 0, change = 0;
    NSMutableArray *children = treeNode.children;
    int childrenCount = children.count;
    int i = childrenCount;
    while (--i >= 0) {
        DFIHierarchyTreeNode *curChildren = [children objectAtIndex:i];
        curChildren.z += shift;
        curChildren.m += shift;
        shift += curChildren.s + (change += curChildren.c);
    }
}

/*
 * 算法的核心
 */
- (DFIHierarchyTreeNode *)pApportionWithV:(DFIHierarchyTreeNode *)v w:(DFIHierarchyTreeNode *)w andAncestor:(DFIHierarchyTreeNode *)ancestor {
    if (w) {
        DFIHierarchyTreeNode *vip = v;
        DFIHierarchyTreeNode *vop = v;
        DFIHierarchyTreeNode *vim = w;
        DFIHierarchyTreeNode *vom = [vip.parent.children objectAtIndex:0];
        float sip = vip.m;
        float sop = vop.m;
        float sim = vim.m;
        float som = vom.m;
        float shift;

        while (vim = [self nextRight:vim], vip = [self nextLeft:vip], vim && vip) {
            vom = [self nextLeft:vom];
            vop = [self nextRight:vop];
            vop.an = v;
            shift = vim.z + sim - vip.z - sip + _separation(vim.baseNode, vip.baseNode);
            if (shift > 0) {
                [self pMoveSubtreeWithWm:[self pNextAncestorWithVim:vim v:v andAncestor:ancestor] wp:v andShift:shift];
                sip += shift;
                sop += shift;
            }
            sim += vim.m;
            sip += vip.m;
            som += vom.m;
            sop += vop.m;
        }

        if (vim && ![self nextRight:vop]) {
            vop.t = vim;
            vop.m += sim - sop;
        }
        if (vip && ![self nextLeft:vom]) {
            vom.t = vip;
            vom.m += sip - som;
            ancestor = v;
        }
    }

    return ancestor;
}

/*
 * 返回左边的轮廓
 */
- (DFIHierarchyTreeNode *)nextLeft:(DFIHierarchyTreeNode *)treeNode {
    NSMutableArray *children = treeNode.children;
    if (children.count > 0) {
        return [children objectAtIndex:0];
    } else {
        return treeNode.t;
    }
}

/*
 * 返回右边的轮廓
 */
- (DFIHierarchyTreeNode *)nextRight:(DFIHierarchyTreeNode *)treeNode {
    NSMutableArray *children = treeNode.children;
    if (children.count > 0) {
        return [children lastObject];
    } else {
        return treeNode.t;
    }
}

/*
 * 向右移动整个子树
 */
- (void)pMoveSubtreeWithWm:(DFIHierarchyTreeNode *)wm wp:(DFIHierarchyTreeNode *)wp andShift:(float)shift {
    float change = shift / (wp.index - wm.index);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
}

/*
 * 
 */
- (DFIHierarchyTreeNode *)pNextAncestorWithVim:(DFIHierarchyTreeNode *)vim v:(DFIHierarchyTreeNode *)v andAncestor:(DFIHierarchyTreeNode *)ancestor {
    return (vim.an.parent == v.parent) ? vim.an : ancestor;
}

@end

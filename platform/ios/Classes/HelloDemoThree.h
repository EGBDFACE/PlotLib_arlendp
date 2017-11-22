//
//  HelloDemoThree.h
//  Cocos2dx-UIKit
//
//  Created by Shaoxiang Zhou on 2017/11/10.
//

#ifndef HelloDemoThree_h
#define HelloDemoThree_h
#include "cocos2d.h"
#include "cocos-ext.h"
USING_NS_CC_EXT;
USING_NS_CC;

class HelloDemoThreeScene : public cocos2d::Layer, public ScrollViewDelegate {
public:
    static cocos2d::Scene* createScene();
    
    virtual bool init();
    
    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);
    
    // implement the "static create()" method manually
    CREATE_FUNC(HelloDemoThreeScene);
    
    void onTouchesBegan(const std::vector<Touch*>&touches, Event* event);
    void onTouchesMoved(const std::vector<Touch*>&touches, Event* event);
    void onTouchesEnded(const std::vector<Touch*>&touches, Event* event);
    void onTouchesCancelled(const std::vector<Touch*>&touches, Event* event);
    
private:
    virtual void scrollViewDidScroll(ScrollView *view);
    virtual void scrollViewDidZoom(ScrollView *view);
    
    // tap control
    double _distance;// 两点间距离
    double _deltax; // 目标x轴的改变值
    double _deltay;
    Sprite *_bgSprite;
    double _mscale; //初始缩放距离
    
    
    ScrollView *scrollView;
};

#endif /* HelloDemoThree_h */

//
//  HelloDemoTwo.cpp
//  Cocos2dx-UIKit-mobile
//
//  Created by Shaoxiang Zhou on 2017/11/10.
//
#include "HelloDemoTwo.h"
#include "SimpleAudioEngine.h"
#include <stdio.h>
#include <time.h>
using namespace std;

using namespace ui;

Scene* HelloDemoTwoScene::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloDemoTwoScene::create();
    
    // add layer as a child to scene
    scene->addChild(layer);
    
    // return the scene
    return scene;
}

bool HelloDemoTwoScene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    
    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();
    
    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(HelloDemoTwoScene::menuCloseCallback, this));
    
    closeItem->setPosition(Vec2(origin.x + visibleSize.width - closeItem->getContentSize().width/2 ,
                                origin.y + closeItem->getContentSize().height/2));
    
    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);
    
    // 设置容器
    Layer *containerLayer = Layer::create();
    containerLayer->setContentSize(Size(2500, 2500));
    containerLayer->setPosition(Point(0,0));
    
    srand((unsigned)time(NULL));
    
    SpriteBatchNode *batchNode1 = SpriteBatchNode::create("Group 6.png", 50000);
    batchNode1->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNode1);
    
    for(int i = 0; i < 5000; i++){
        int x1 = rand() % 2500;
        int y1 = rand() % 2500;
        
        
        Sprite *testNormal = Sprite::createWithTexture(batchNode1->getTexture());
        testNormal->setPosition(Vec2(x1, y1));
        batchNode1->addChild(testNormal);
    }
    
    scrollView = ScrollView::create();
    scrollView->setViewSize(Size(400,300));
    scrollView->setPosition(0,0);
    scrollView->setContainer(containerLayer);
    scrollView->setDirection(ScrollView::Direction::BOTH);
    scrollView->setDelegate(this);
    this->addChild(scrollView);
    
    scrollView->setMaxScale(1.01);
    scrollView->setMinScale(0.1);
    
    // 创建多点触摸监听器
    auto listener = EventListenerTouchAllAtOnce::create();
    // 绑定事件处理函数
    listener->onTouchesBegan = CC_CALLBACK_2(HelloDemoTwoScene::onTouchesBegan, this);
    listener->onTouchesMoved = CC_CALLBACK_2(HelloDemoTwoScene::onTouchesMoved, this);
    listener->onTouchesEnded = CC_CALLBACK_2(HelloDemoTwoScene::onTouchesEnded, this);
    listener->onTouchesCancelled = CC_CALLBACK_2(HelloDemoTwoScene::onTouchesCancelled, this);
    // 添加场景优先事件监听器
    _eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
    return true;
}

#pragma mark - touches
void HelloDemoTwoScene::onTouchesBegan(const std::vector<Touch*> &touches, cocos2d::Event *event){
    // 如果移动时触摸点的个数不少于两个
    if(touches.size() >= 2){
        // 获得第一个接触点
        auto touch1 = touches.at(0);
        Vec2 mPoint1 = Director::getInstance()->convertToGL(touch1->getLocation());
        // 获得第二个接触点
        auto touch2 = touches.at(1);
        Vec2 mPoint2 = Director::getInstance()->convertToGL(touch2->getLocation());
        // 计算距离
        _distance = sqrt((mPoint2.x - mPoint1.x) *(mPoint2.x - mPoint1.x) + (mPoint2.y - mPoint1.y) * (mPoint2.y - mPoint1.y));
    }
}

void HelloDemoTwoScene::onTouchesMoved(const std::vector<Touch *> &touches, cocos2d::Event *event){
    // 如果移动时的触摸点不少于两个
    if(touches.size() >= 2){
        // 获得第一个接触点
        auto touch1 = touches.at(0);
        Vec2 mPoint1 = Director::getInstance()->convertToGL(touch1->getLocation());
        // 获得第二个接触点
        auto touch2 = touches.at(1);
        Vec2 mPoint2 = Director::getInstance()->convertToGL(touch2->getLocation());
        // 计算现在的距离
        double mdistance = sqrt((mPoint2.x - mPoint1.x) *(mPoint2.x - mPoint1.x) + (mPoint2.y - mPoint1.y) * (mPoint2.y - mPoint1.y));
        _mscale = _mscale * mdistance / _distance;
        _distance = mdistance;
        // 设置新的缩放比例
        scrollView->setScale(_mscale);
    }
}

void HelloDemoTwoScene::onTouchesEnded(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

void HelloDemoTwoScene::onTouchesCancelled(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

#pragma mark - scrollview
void HelloDemoTwoScene::scrollViewDidZoom(ScrollView *view){
    return;
}

void HelloDemoTwoScene::scrollViewDidScroll(ScrollView *view){
    return;
}

void HelloDemoTwoScene::menuCloseCallback(Ref* pSender)
{
    //Close the cocos2d-x game scene and quit the application
    Director::getInstance()->end();
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
    
    /*To navigate back to native iOS screen(if present) without quitting the application  ,do not use Director::getInstance()->end() and exit(0) as given above,instead trigger a custom event created in RootViewController.mm as below*/
    
    //EventCustom customEndEvent("game_scene_close_event");
    //_eventDispatcher->dispatchEvent(&customEndEvent);
    
    
}

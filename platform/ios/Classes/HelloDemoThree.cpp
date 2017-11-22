//
//  HelloDemoThree.cpp
//  Cocos2dx-UIKit
//
//  Created by Shaoxiang Zhou on 2017/11/10.
//
#include "HelloDemoThree.h"
#include "SimpleAudioEngine.h"
#include <stdio.h>
#include <time.h>
using namespace std;

using namespace ui;

Scene* HelloDemoThreeScene::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloDemoThreeScene::create();
    
    // add layer as a child to scene
    scene->addChild(layer);
    
    // return the scene
    return scene;
}

bool HelloDemoThreeScene::init()
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
                                           CC_CALLBACK_1(HelloDemoThreeScene::menuCloseCallback, this));
    
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
    
    
    // 方块数据
    SpriteBatchNode *batchNodeWhite = SpriteBatchNode::create("Rectangle1.png", 10000);
    batchNodeWhite->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodeWhite);
    SpriteBatchNode *batchNodeClear = SpriteBatchNode::create("Rectangle2.png", 10000);
    batchNodeClear->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodeClear);
    SpriteBatchNode *batchNodeBlue = SpriteBatchNode::create("Rectangle3.png", 10000);
    batchNodeBlue->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodeBlue);
    SpriteBatchNode *batchNodeGreen = SpriteBatchNode::create("Rectangle4.png", 10000);
    batchNodeGreen->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodeGreen);
    SpriteBatchNode *batchNodePink = SpriteBatchNode::create("Rectangle5.png", 10000);
    batchNodePink->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodePink);
    SpriteBatchNode *batchNodeOrange = SpriteBatchNode::create("Rectangle6.png", 10000);
    batchNodeOrange->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodeOrange);
    SpriteBatchNode *batchNodePurple = SpriteBatchNode::create("Rectangle7.png", 10000);
    batchNodePurple->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNodePurple);
    
    
    float width = 8.0;
    float height = 8.0;
    
    for(int i = 0; i < 200; i++){
        for(int j = 0; j < 200; j++){
            int temp = rand() % 7;

            if(temp == 0){
                Sprite *testTemp = Sprite::createWithTexture(batchNodeWhite->getTexture());
                
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodeWhite->addChild(testTemp);
            }else if (temp == 1){
                Sprite *testTemp = Sprite::createWithTexture(batchNodeClear->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodeClear->addChild(testTemp);
            }else if(temp == 2){
                Sprite *testTemp = Sprite::createWithTexture(batchNodeBlue->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodeBlue->addChild(testTemp);
            }else if(temp == 3){
                Sprite *testTemp = Sprite::createWithTexture(batchNodeGreen->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodeGreen->addChild(testTemp);
            }else if (temp == 4){
                Sprite *testTemp = Sprite::createWithTexture(batchNodePink->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodePink->addChild(testTemp);
            }else if(temp == 5){
                Sprite *testTemp = Sprite::createWithTexture(batchNodeOrange->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodeOrange->addChild(testTemp);
            }else {
                Sprite *testTemp = Sprite::createWithTexture(batchNodePurple->getTexture());
                testTemp->setPosition(Vec2(i * width, j  * height));
                batchNodePurple->addChild(testTemp);
            }

        }
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
    listener->onTouchesBegan = CC_CALLBACK_2(HelloDemoThreeScene::onTouchesBegan, this);
    listener->onTouchesMoved = CC_CALLBACK_2(HelloDemoThreeScene::onTouchesMoved, this);
    listener->onTouchesEnded = CC_CALLBACK_2(HelloDemoThreeScene::onTouchesEnded, this);
    listener->onTouchesCancelled = CC_CALLBACK_2(HelloDemoThreeScene::onTouchesCancelled, this);
    // 添加场景优先事件监听器
    _eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
    return true;
}

#pragma mark - touches
void HelloDemoThreeScene::onTouchesBegan(const std::vector<Touch*> &touches, cocos2d::Event *event){
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

void HelloDemoThreeScene::onTouchesMoved(const std::vector<Touch *> &touches, cocos2d::Event *event){
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

void HelloDemoThreeScene::onTouchesEnded(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

void HelloDemoThreeScene::onTouchesCancelled(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

#pragma mark - scrollview
void HelloDemoThreeScene::scrollViewDidZoom(ScrollView *view){
    return;
}

void HelloDemoThreeScene::scrollViewDidScroll(ScrollView *view){
    return;
}

void HelloDemoThreeScene::menuCloseCallback(Ref* pSender)
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

//
//  HelloWorldModalScene.cpp
//  Cocos2dx-UIKit
//
//  Created by Alwyn Savio Concessao on 25/05/16.
//
//

#include "HelloWorldModalScene.h"

USING_NS_CC;

Scene* HelloWorldModalScene::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloWorldModalScene::create();
    
    // add layer as a child to scene
    scene->addChild(layer);
    
    // return the scene
    return scene;
}

// on "init" you need to initialize your instance
bool HelloWorldModalScene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    
    Size visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();
    
    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.
    
    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(HelloWorldModalScene::menuCloseCallback, this));
    
    closeItem->setPosition(Vec2(origin.x + visibleSize.width/2,
                                origin.y + closeItem->getContentSize().height/2));
    
    
    // 设置容器
    Layer *containerLayer = Layer::create();
    containerLayer->setContentSize(Size(2500,2500));
    containerLayer->setPosition(Point(0,0));
    
    srand((unsigned)time(NULL));
    
    
    // 添加批量渲染
    SpriteBatchNode *batchNode1 = SpriteBatchNode::create("Oval 5-1.png", 50000);
    SpriteBatchNode *batchNode2 = SpriteBatchNode::create("Oval 5-2.png", 50000);
    SpriteBatchNode *batchNode3 = SpriteBatchNode::create("Oval 5-3.png", 50000);
    batchNode1->setPosition(Vec2(0,0));
    batchNode2->setPosition(Vec2(0,0));
    batchNode3->setPosition(Vec2(0,0));
    containerLayer->addChild(batchNode1);
    containerLayer->addChild(batchNode2);
    containerLayer->addChild(batchNode3);
    
    for(int i = 0; i < 50000; i++){
        int x1 = rand() % 2500;
        int y1 = rand() % 2500;
        int x2 = rand() % 2500;
        int y2 = rand() % 2500;
        int x3 = rand() % 2500;
        int y3 = rand() % 2500;
        
        Sprite *testOvalOne = Sprite::createWithTexture(batchNode1->getTexture());
        Sprite *testOvalTwo = Sprite::createWithTexture(batchNode2->getTexture());
        Sprite *testOvalThree = Sprite::createWithTexture(batchNode3->getTexture());
        testOvalOne->setPosition(Vec2(x1, y1));
        testOvalTwo->setPosition(Vec2(x2,y2));
        testOvalThree->setPosition(Vec2(x3,y3));
        batchNode1->addChild(testOvalOne);
        batchNode2->addChild(testOvalTwo);
        batchNode3->addChild(testOvalThree);
    }
    
    // 创建单点触摸监听器
    auto tapListener = EventListenerTouchOneByOne::create();
    tapListener->setSwallowTouches(true);
    
    // 单点触摸的回调方法
    tapListener->onTouchBegan = [](Touch *touch, Event *event){
        auto target = static_cast<Sprite*>(event->getCurrentTarget());
        
        Point locationInNode = target->convertToNodeSpace(touch->getLocation());
        Size s = target->getContentSize();
        Rect rect = Rect(0, 0, s.width, s.height);
        
        if(rect.containsPoint(locationInNode)){
            log("sprite began... x = %, y = %f", locationInNode.x, locationInNode.y);
            target->setOpacity(180);
            return true;
        }
        return false;
    };
    
    tapListener->onTouchEnded = [=](Touch *touch, Event *event){
        auto target = static_cast<Sprite*>(event->getCurrentTarget());
        log("sprite onTouchEnded..");
        target->setOpacity(255);
    };
    
    _eventDispatcher->addEventListenerWithSceneGraphPriority(tapListener, this);
    
    //设置scrollview
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
    listener->onTouchesBegan = CC_CALLBACK_2(HelloWorldModalScene::onTouchesBegan, this);
    listener->onTouchesMoved = CC_CALLBACK_2(HelloWorldModalScene::onTouchesMoved, this);
    listener->onTouchesEnded = CC_CALLBACK_2(HelloWorldModalScene::onTouchesEnded, this);
    listener->onTouchesCancelled = CC_CALLBACK_2(HelloWorldModalScene::onTouchesCancelled, this);
    // 添加场景优先事件监听器
    _eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
    return true;
}
#pragma mark - touches
void HelloWorldModalScene::onTouchesBegan(const std::vector<Touch*> &touches, cocos2d::Event *event){
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

void HelloWorldModalScene::onTouchesMoved(const std::vector<Touch *> &touches, cocos2d::Event *event){
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

void HelloWorldModalScene::onTouchesEnded(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

void HelloWorldModalScene::onTouchesCancelled(const std::vector<Touch *> &touches, cocos2d::Event *event){
    return;
}

#pragma mark - scrollview
void HelloWorldModalScene::scrollViewDidZoom(ScrollView *view){
    // 缩放之后确保如果过于小则出现在视图居中的地方
    
    
    return;
}

void HelloWorldModalScene::scrollViewDidScroll(ScrollView *view){
    return;
}

//@see http://www.cocos2d-x.org/wiki/EventDispatcher_Mechanism
void HelloWorldModalScene::menuCloseCallback(Ref* pSender)
{
    EventCustom event("game_custom_event2");
    _eventDispatcher->dispatchEvent(&event);

}

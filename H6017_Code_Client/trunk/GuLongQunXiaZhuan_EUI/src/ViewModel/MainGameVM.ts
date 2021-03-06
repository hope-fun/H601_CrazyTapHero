module ViewModel {
	/**
	 * @author: zhu_jun.
	 * @date: 2015.12.25.
	 */
    export enum Camp {
        Player,
        Opponent
    }

    export class MainGameVM extends eui.Component {
    	/**
    	 * @舞台父节点.
    	 */
        private uiLayer: eui.UILayer;
        /**
         * @回调方法.
         */
        private onCallBack: Function;
        /**
         * @金币和飘字父节点.
         */
        private goldAndTextGroup: eui.Group;
        /**
         * @场景信息控件.
         */
        public sceneInfo: SceneInfoVM;
        /**
         * @核心点击控件，重要!
         */
        public clickBtn: eui.Button;
        /**
         * @背景图片
         */
        public bg: eui.Image;
        /**
         * @孟珏父节点.
         */
        public mengjueGroup: eui.Group;
        /**
         * @孟珏升级特效
         */
        public mengjueLevelUp: eui.Group;
        /**
         * @刘弗陵父节点.
         */
        public liufulingGroup: eui.Group;
        /**
         * @刘弗陵升级特效.
         */
        public liufulingLevelUp: eui.Group;
        /**
         * @病已父节点.
         */
        public bingyiGroup: eui.Group;
        /**
         * @病已升级特效.
         */
        public bingyiLevelUp: eui.Group;
        /**
         * @许平君父节点.
         */
        public xupingjunGroup: eui.Group;
        /**
         * @许平君升级特效.
         */
        public xupingjunLevelUp: eui.Group;
        /**
         * @云歌父节点.
         */
        public yungeGroup: eui.Group;
        /**
         * @云歌升级特效.
         */
        public yungeLevelUp: eui.Group;
        /**
         * @云歌点击特效父节点.
         */
        public yungeClickEffectGroup: eui.Group;
        /**
         * @云歌前排技能
         */
        public yungeFrontSkill: eui.Group;
        /**
         * @云歌后排技能0
         */
        public yungeSkill0: eui.Group;
        /**
         * @云歌后排技能1
         */
        public yungeSkill1: eui.Group;
        /**
         * @百合父节点.
         */
        private baiheGroup: eui.Group;
        /**
         * @百合升级特效.
         */
        public baiheLevelUp: eui.Group;
        /**
         * @敌人父节点.
         */
        public enemyGroup: eui.Group;
        /**
         * @敌人待机对象.
         */
        public enemy: HeroItemVM = null;
        /**
         * @点击效果图
         * @by cai_haotian
         */
        private tapEffect: eui.Image;
        
        /**
         * @抖动方法
         * @by cai_haotian.
         */
        private shockTool: Model.ShockTools;
        
        /**
         * @扣血标示
         * @by cai_haotian 2016.3.8
         */ 
        private cutFlag:boolean=true;
        
        /**
         * @作弊标示
         * @by cai_haotian 2016.3.9
         */ 
        private cheatFlag:boolean=true;
        
        /**
         * @点击频率计数
         * @by cai_haotian 2016.3.8
         */ 
        private clickFrequence:number=0;
        
        /**
         * @挚友的播放帧率
         */ 
        public friendFrameRate:number=0;
        
        /**
         * @自动提交数据标示
         * @by cai_haotian 2016.3.30
         */ 
        public commitFlag:number=0;
        
        /**
         * @升级光特效
         * @by cai_haotian 2016.3.14
         */ 
        public levelUpLight:eui.Group;
        /**
         * @挑战结束之后胜利失败的图片.
         */ 
        public challengeFinishTitle:eui.Image;
        
        public constructor(_uiLayer: eui.UILayer,_onCallBack: Function) {
            super();
            this.skinName = View.MainGameView;
            this.uiLayer = _uiLayer;
            this.onCallBack = _onCallBack;
            this.uiLayer.addChildAt(this,0);
        }

        protected createChildren() {
            super.createChildren();
//            var audio: Model.AudioService = new Model.AudioService("bgm-003_mp3",() => { },-1);
            Model.AudioService.Shared().PlayBGM("bgm-003_mp3");
            egret.Ticker.getInstance().register(function(advanceTime) {//心跳时钟开启
                dragonBones.WorldClock.clock.advanceTime(advanceTime / 1000);
            },this);
            this.initSceneInfo();
            this.initPlayer();
            this.initFriend();
            this.initEnemy();
            this.initCheatingDetection();
            this.shockTool = new Model.ShockTools();
            this.clickBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtn,this);
        }
        
        /**
         * @初始化监听是否作弊
         * @by cai_haotian 2016.3.9.
         */ 
        private initCheatingDetection(){
            var detection=egret.setInterval(()=>{
                if(Model.MainLocalService.cheatingDetection(this.clickFrequence)){
                    Main.singleton.mainMenuVM.offLineGroup.visible=true;
                    this.cheatFlag=false;
                    egret.clearInterval(detection);
                }
                this.clickFrequence=0;
                },this,1000);
        }
        
        /**
         * @初始化场景信息界面.
         */
        public initSceneInfo() {
            this.sceneInfo.giftBag.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
                alert("此功能2016.1.8.之后开发!");
            },this);
            this.changeScene();
        }
        
        /**
         * @初始化玩家角色.
         */
        public initPlayer() {
            this.initPlayerIdle();
        }
        
        /**
         * @初始挚友.
         */
        public initFriend() {
            var fDatas: Model.FriendData[] = Model.FriendLocalService.FriendList;
            var hadFDatas: Model.FriendData[] = Enumerable.From(fDatas).Select((x) => {
                if(x.dy != null) {
                    this.switchFriend(x);
                    return x;
                }
            }).ToArray();
            this.onDpsEvent();
        }
            
        /**
         * @初始化敌人角色.
         */
        public initEnemy() {
            this.enemy = new HeroItemVM(this.enemyGroup);
            this.enemy.initMovieClip(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].IdleJson,Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].IdlePng,Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].Idle);
        }
        
        /**
         * @点击按钮事件.
         */
        private onClickBtn(evt?: egret.TouchEvent): void {
            this.clickFrequence++;
            this.clickEffect(evt);
            /*NOTE: 如果需要改成只出一个云歌点击特效，则解开注释.
            for(var i = this.yungeClickEffectGroup.numChildren ; i > 0 ; i--){
                this.yungeClickEffectGroup.getChildAt(i-1).visible = false;
            }*/
            if(this.yungeGroup.numChildren > 1) {//销毁index要从后往前，先销毁>=2号位的攻击特效，再销毁1号位的攻击动画.
                this.yungeGroup.removeChildAt(1);//强制删除1号位云歌攻击动画.movieClip被移除，正常回调的事件监听也就没有了.
//                console.log("zhujun: force remove attack anim ! ");
            }
            this.initPlayerAttack();//主角攻击,隐藏待机,回调关攻击,显示待机.
//            var audio: Model.AudioService = new Model.AudioService(Model.PlayerLocalService.PlayerData.st.playerAttackAudio);//主角音效
//            Model.AudioService.Shared().SoundSource = Model.PlayerLocalService.PlayerData.st.playerAttackAudio;
            Model.AudioService.Shared().PlaySound(Model.PlayerLocalService.PlayerData.st.playerAttackAudio);
            this.cutHp(true);
        }
        
        /**
         * @减血事件.
         * @触发点击伤害.
         * @减血.
         * @更新UI
         */
        public cutHp(_isClick: boolean = false) {
            if(this.cutFlag&&this.cheatFlag){
                this.cutHpAnim(_isClick,(damage: number) => {
                    
                    //by cai_haotian 2016.4.15
                    //设置为false进入正常打怪环节 注：默认就为false
                    if(Model.PlayerLocalService.PlayerData.isChallenge){
                        //这段作为活动扣血
                        Model.ChallengeLoaclService.challengeBossData.AddHp = -damage;
                        this.sceneInfo.setChallengeBoss();
                        if(Model.ChallengeLoaclService.challengeBossData.hp<=0){
                            this.enemyKilled(() => {
                                this.sceneInfo.cBossEvent();
                                
                                //调用挑战成功函数
                                Model.ChallengeLoaclService.successBack(Model.ChallengeLoaclService.challengeBossData);
                            })
                        }
                    }else{
                        //此段作为正常扣血
                        Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].AddHp = -damage;//model层扣血.
                        this.sceneInfo.setMonsterHp();
                        if(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].hp <= 0) {//当前怪的血够小于零，说明怪物已经死亡.                    
                            this.enemyKilled(() => {
                                if(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].MonsterType == Model.MonsterType.MONSTER_TYPE_BOSS) {//如果是boss死了，切换整组怪物数据.
                                    this.sceneInfo.bossDeathEvent();
                                    Model.SceneLocalService.setNextSceneData();//更新关卡数据.
                                    this.sceneInfo.setSceneIndex();
                                    this.changeScene();
                                    Model.MonsterLocalService.setMonsterData();
                                    //保护挚友 by cai_haotian 2016.3.21
                                    if(!Model.PlayerLocalService.PlayerData.protectFriend) {
                                        Model.FriendLocalService.sealFriendAndSkills();//判断是否触发挚友技能锁定。
                                    }
                                    
                                } else {
                                    Model.SceneLocalService.SceneData.currentMonster++;
                                }
                            });//先死后加index.
                        } else {
                            if(Model.WebServiceBase.isDebug){
                                console.log("zhujun: monster have been alive ! ");
                            }
                            
                        }
                    }
                    
                });
            }
        }
        
        /**
         * @改变场景.
         */ 
        private changeScene(){
//            //判断当前关卡号.
//            if(parseInt(Model.SceneLocalService.SceneData.sceneId.sceneId) >= Model.PlayerLocalService.PlayerData.st.startScene){
//                //TODO:在这里改。
////                Model.SceneLocalService.
//            }
                if(Model.SceneLocalService.SceneData.st.sceneName) {
                    var titleMsg: ScrollMsgVM = new ScrollMsgVM(this.uiLayer,(_bUILayer) => {
                        _bUILayer.removeChild(titleMsg);
                    },Model.SceneLocalService.SceneData.st.sceneName);
                }
                if(Model.SceneLocalService.SceneData.st.scenePic) {
                    this.bg.source = Model.SceneLocalService.SceneData.st.scenePic;
                }else{
                    var scenePid = Math.ceil(Model.SceneLocalService.SceneData.st.id / 5);
                    this.bg.source = "scene_pic_"+scenePid;
                }
        }
        
        /**
         * @扣血动画.
         */
        private cutHpAnim(_isClick: boolean,_onAnimFinish: Function) {
            //飘血动画.
            var cutHpItem: ViewModel.CutHpItemVM = new ViewModel.CutHpItemVM(this);
            var critFactor: number = Model.Mathf.random(0,100);
            var damage: number = 0;
            if(_isClick) {
                if(critFactor <= Model.PlayerLocalService.PlayerData.CritRate) {//暴击.
                    cutHpItem.y = 230;
                    damage = Model.PlayerLocalService.PlayerData.CritDamage;
                    var damgeUnit = Model.MainLocalService.toUnitConversion(Number(damage));
                    Model.PlayerLocalService.setPerSecondTapDamage(Number(damage));
                    cutHpItem.setCriticalAttack(damgeUnit,damage);//暴击显示
                    this.shockTool.shock(this,3);
                } else {
                    cutHpItem.y = 300;
                    damage = Model.PlayerLocalService.PlayerData.dy.clickDamage;
                    var damgeUnit = Model.MainLocalService.toUnitConversion(Number(damage));
                    Model.PlayerLocalService.setPerSecondTapDamage(Number(damage));
                    cutHpItem.setNoramlAttack(damgeUnit,damage);//普通攻击
                }
                cutHpItem.x = 480 - cutHpItem.width / 2;
            } else {
                cutHpItem.y = 300;
                damage = Model.PlayerLocalService.PlayerData.dy.friendDamage;
            }
            _onAnimFinish(damage);
        }
        
        /**
         * 点击特效
         */
        private clickEffect(evt: egret.TouchEvent): void {
            this.tapEffect.x = evt.stageX - this.tapEffect.width / 2;
            this.tapEffect.y = evt.stageY - this.tapEffect.height / 2;
            this.tapEffect.visible = true;
            egret.setTimeout(() => {
                this.tapEffect.visible = false;
            },this,80);
        }
        
        /**
         * @秒伤监听事件.(初始化完挚友执行.)
         */
        private onDpsEvent() {
            this.cutHp(false);
            egret.setTimeout(() => {//触发秒伤伤害.
                this.onDpsEvent();
            },this,1000-Model.PlayerLocalService.PlayerData.friendFrameRate);
        }
        
        /**
         * @主角待机动画.
         */
        private initPlayerIdle() {
            var yunge: HeroItemVM = new HeroItemVM(this.yungeGroup);
            yunge.initMovieClip(Model.PlayerLocalService.PlayerData.IdleJson,Model.PlayerLocalService.PlayerData.IdlePng,Model.PlayerLocalService.PlayerData.st.playerIdle);
        }
        
        /**
         * @主角攻击动画.
         */
        private initPlayerAttack() {
            this.onAttackAnim(this.yungeGroup,[Model.PlayerLocalService.PlayerData.AttackJson,Model.PlayerLocalService.PlayerData.AttackPng,Model.PlayerLocalService.PlayerData.st.playerAttack]);
            this.onAttackEffect(this.yungeClickEffectGroup,[Model.PlayerLocalService.PlayerData.EffectJson,Model.PlayerLocalService.PlayerData.EffectPng,Model.PlayerLocalService.PlayerData.Effect]);
        }
        
        /**
         * @选择挚友动画
         */
        public switchFriend(_data: Model.FriendData) {
            switch(_data.dy.friendId) {
                case 1:
                    var baihe: HeroItemVM = new HeroItemVM(this.baiheGroup);
                    this.friendAnimal(baihe,this.baiheGroup,_data);
                    break;
                case 7:
                    var bingyi: HeroItemVM = new HeroItemVM(this.bingyiGroup);
                    this.friendAnimal(bingyi,this.bingyiGroup,_data);
                    break;
                case 13:
                    var xupingjun: HeroItemVM = new HeroItemVM(this.xupingjunGroup);
                    this.friendAnimal(xupingjun,this.xupingjunGroup,_data);
                    break;
                case 19:
                    var mengjue: HeroItemVM = new HeroItemVM(this.mengjueGroup);
                    this.friendAnimal(mengjue,this.mengjueGroup,_data);
                    break;
                case 25:
                    var liufuling: HeroItemVM = new HeroItemVM(this.liufulingGroup);
                    this.friendAnimal(liufuling,this.liufulingGroup,_data);
                    break;
                default: ;
            }
        }
        
        /**
         * @初始化单个挚友动画.
         */
        private friendAnimal(_item: HeroItemVM,_uiGroup: eui.Group,_data: Model.FriendData) {    
            if(_data.dy.sealCD > 0) {//无论有没有对象，都要判断是否已经封印,初始化的时候是没有对象的.
                _uiGroup.visible = false;
            } else {
                _uiGroup.visible = true;
            }
            if(_uiGroup.numChildren > 0){//大于0则显示隐藏之后直接return.
                if(Model.WebServiceBase.isDebug){
                    console.log("zhujun: 大于0则是更新挚友，挚友挚友更新的时候才存在现实隐藏 ! ");
                }
                return;   
            }
            _item.initMovieClip(_data.IdleJson,_data.IdlePng,_data.st.idle);//待机动画
            egret.setInterval(() => {//攻击动画
                this.onAttackAnim(_uiGroup,[_data.AttackJson,_data.AttackPng,_data.st.attack],() => {
                    this.onAttackEffect(_uiGroup,[_data.EffectJson,_data.EffectPng,_data.Effect],() => {
                    });
                });
                Model.AudioService.Shared().PlaySound(_data.st.attackAudio);
            },this,Model.Mathf.random(Model.PlayerLocalService.PlayerData.st.effectTimeMin * 1000,Model.PlayerLocalService.PlayerData.st.effectTimeMax * 1000));
        
        }
        
        /**
         * @播放攻击动画.
         */
        private onAttackAnim(_uiGroup: eui.Group,_data: string[],_onCallBack?: Function) {
            _uiGroup.getChildAt(0).visible = false;//重新播放,无论是不是点击,0号位都需要隐藏.
            var item: HeroItemVM = new HeroItemVM(_uiGroup);
            var mc = item.initMovieClip(_data[0],_data[1],_data[2],1,() => {
                _uiGroup.getChildAt(0).visible = true;
                _uiGroup.removeChild(item.movieClip);
                if(Model.WebServiceBase.isDebug) {
                    console.log("zhujun: once movie clip call back successed ! ");
                }
                
            });
            
            if(Model.PlayerLocalService.PlayerData.friendFrameRate!=0){
                mc.frameRate = 24+Model.PlayerLocalService.PlayerData.friendFrameRate;
            }
            mc.once(egret.MovieClipEvent.FRAME_LABEL,() => {//根据序列帧动画中的事件触发特效动画
                if(_onCallBack) {
                    _onCallBack();
                }
            },this);
        }
        
        /**
         * @攻击特效.
         */
        private onAttackEffect(_uiGroup: eui.Group,_data: string[],_onCallBack?: Function) {
            if(Model.WebServiceBase.isDebug) {
                console.log("zhujun: on attack effect start !  " + JSON.stringify(_data));
            }
           
            var item: EffectSkillVM = new EffectSkillVM(_uiGroup,() => {
                if(_onCallBack) {
                    _onCallBack();
                }
                if(Model.WebServiceBase.isDebug) {
                    console.log("zhujun: attack effect play finished ! ");
                }
                
            });
            item.initDragonBone(_data[0],_data[1],_data[2]);
        }
        
        /**
         * @改变敌人.
         */
        public changeEnemy(_index: number) {
            if(Model.WebServiceBase.isDebug) {
                console.log("zhujun: change Enemy " + _index);
            }
            
            this.enemy.changeMovieClip(Model.MonsterLocalService.MonsterList[_index].IdleJson,Model.MonsterLocalService.MonsterList[_index].IdlePng,Model.MonsterLocalService.MonsterList[_index].Idle);
        }
        
        /**
         * @金币掉落.
         */ 
        private goldDrop(){
            var dropMoney = Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].dropMoney;
            var dropMoneyAndUnit = Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].DropMoneyAndUnit;
            this.goldAnimel(dropMoney,dropMoneyAndUnit);
        }
        
        /**
         * @灵石掉落.
         */ 
        private jewelDrop(){
            if(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].MonsterType == Model.MonsterType.MONSTER_TYPE_BOSS) {//判断当前怪是不是boss.
                var bossDropJewelProbability = Model.Mathf.random(0,10000);
                if(bossDropJewelProbability < Model.PlayerLocalService.PlayerData.st.bossDropJewelProbability) {
                    this.jewelAnimel(Model.PlayerLocalService.PlayerData.st.bossDropJewelCount,Model.PlayerLocalService.PlayerData.st.bossDropJewelCount + "");
                };
            }
        }
        
        /**
         * @敌人死亡时动画
         */
        public enemyKilled(_onKilled: Function) {
            //by cai_haotian 2016.4.15
            if(Model.PlayerLocalService.PlayerData.isChallenge){
                //这段作为活动boss死亡时的效果调用
                var effect: HeroItemVM = new HeroItemVM(this.enemyGroup);
                _onKilled();
                effect.initMovieClip("tx_siwang_json","tx_siwang_png","Tx_siwang",1,() => {
                    this.enemyGroup.removeChild(effect.movieClip);
                },false);
                this.challengeFinishTitle.visible = true;
                
                if(Model.WebValue.isTraditional){
                    this.challengeFinishTitle.source = "icon_zhandoushengli_tw_png";
                }else{
                    this.challengeFinishTitle.source = "icon_zhandoushengli_png";
                }
                
                
                egret.setTimeout(()=>{
                    this.challengeFinishTitle.visible = false;
                    },this,1000);
                this.commitAuto();//自动提交数据
            }else{
                //这段作为正常游戏流程的调用
                //调用成就方法 by cai_haotian 
                this.achievement();
                if(Model.WebServiceBase.isDebug) {
                    console.log("zhujun: enemy killed ! ");
                }
                
                this.cutFlag = false;//先停止点击事件 by cai_haotian 2016.3.8.
                this.goldDrop();//要在怪物死亡后，切换index之前调用金币模块.
                this.jewelDrop();//如果为Boss则有几率掉落灵石.
                var effect: HeroItemVM = new HeroItemVM(this.enemyGroup);
                effect.initMovieClip("tx_siwang_json","tx_siwang_png","Tx_siwang",1,() => {
                    this.enemyGroup.removeChild(effect.movieClip);
                    _onKilled();
                    if(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].MonsterType == Model.MonsterType.MONSTER_TYPE_BOSS) {//判断当前怪是不是boss.
                        this.sceneInfo.swardIcon.visible = false;//关小剑.
                        this.sceneInfo.bossInfoGroup.visible = true;//显示倒计时，逃跑按钮，进度条
                        this.sceneInfo.countTimeImage.visible = true;//显示倒计时 by cai_haotian 2016.4.18
                        this.sceneInfo.countTimeLabel.visible=true;//显示进度条 by cai_haotian 2016.4.18
                        this.sceneInfo.bossBtn.currentState="down";//设置按钮显示 by cai_haotian 2016.4.18
                        
                        //倒计时初始化.                    
                        this.sceneInfo.setCountDown(() => {
                            if(Model.WebServiceBase.isDebug) {
                                console.log("zhujun: boss倒计时结束,进入刷怪模式 ! ");
                            }
                            
                            Model.MonsterLocalService.setFarmMonsterData();
                            Model.SceneLocalService.SceneData.currentMonster = 0;//强制切换怪物.
                            this.changeEnemy(Model.SceneLocalService.SceneData.currentMonster);//怪物死后调用
                            this.sceneInfo.setMonsterHp();//倒计时到了,强制切换怪物数据，更新UIhp.
                            
                            Model.WebService.commitData(Model.WebValue.dataDyModel,() => {
                                if(Model.WebServiceBase.isDebug) {
                                    console.log("cai_haotian: commitAuto success ! " + JSON.stringify(Model.WebValue.dataDyModel));
                                }
                            },() => {
                                Main.singleton.mainMenuVM.offLineGroup.visible = true;
                                if(Model.WebValue.isTraditional) {
                                    alert("數據提交失敗請聯繫管理員！！！！");
                                } else {
                                    alert("数据提交失败请联系管理员！！！！");
                                }
                            }
                            );
                        });
                    } else {
                        if(Model.SceneLocalService.SceneData.currentMonster == Model.SceneLocalService.SceneData.monsterCount - 1) {//如果最后一位非boss,则是循环模式.
                            Model.MonsterLocalService.setFarmMonsterData();
                            Model.SceneLocalService.SceneData.currentMonster = 0;//强制切换怪物.
                        } else {
                            
                            if(Model.WebServiceBase.isDebug) {
                                console.log("zhujun: 这边进入了循环战斗,UI应该不变,等点击按钮时,修改数据,切换回挑战boss ! ");
                            }
                            
                        }
                    }
                    this.sceneInfo.setMonsterHp();//普通怪物死亡更新UIhp.
                    this.changeEnemy(Model.SceneLocalService.SceneData.currentMonster);//怪物死后调用
                    this.sceneInfo.setMonsterIndex();
                    this.cutFlag = true;//重新开始扣血事件 by cai_haotian 2016.3.8.
                    this.commitAuto();//自动提交数据
                },false);
            }
        }
        
        /**
         * @敌人被攻击时动画
         */
        public enemyHit() {
            console.log("zhujun： enemy Hit " + Model.SceneLocalService.SceneData.currentMonster);
            this.enemy.changeMovieClip(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].HitJson,Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].HitPng,Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].Hit,1,() => {
                this.changeEnemy(Model.SceneLocalService.SceneData.currentMonster);
            });
            
            //敌人受到攻击时的动画
            //by cai_haotian 2016.3.16.
            var enemyHit=new HeroItemVM(this.levelUpLight);
            var enemyHitMc=enemyHit.initMovieClip("Tx_shouji_json","Tx_shouji_png","Tx_shouji",1,()=>{
                this.levelUpLight.removeChild(enemyHitMc);
                });
        }
        
        /**
         * @金币动画.
         */
        public goldAnimel(_goldAdd: number,_goldAddAndUnit: string) {
            var max = Model.Mathf.random(1,5);
            for(var i = 0;i < max;i++) {//控制掉过个数
                var coin: eui.Image = new eui.Image();
                coin.source = "icon_jinbi";
                coin.x = 500;
                coin.y = 300;
                var endRandomX = Model.Mathf.random(0,600);//掉落终点的x坐标
                var bezierP1X = endRandomX + Model.Mathf.random(-100,100);//返回时贝塞尔曲线的P1点x坐标 Y坐标在TweenCustom中固定
                var startPos: Model.Vector2 = new Model.Vector2(300,300);//设置出现点的起始坐标
                var endPos: Model.Vector2 = new Model.Vector2(endRandomX,Model.Mathf.random(530,550));//设置掉落点的终点坐标
                var finalPos:Model.Vector2=new Model.Vector2(225,155);//金币最终飞到的坐标
                var tween = new Model.TweenCustom(coin,this.goldAndTextGroup,startPos,endPos,finalPos);//进行掉落返回曲线的函数   
                tween.sAnimTime = Model.Mathf.random(1200,1400);//总时长
                tween.bezierP1X = bezierP1X;//设置回收动画，贝塞尔曲线的P1点x坐标
                var recycleCallBack = (_bTween: Model.TweenCustom) => {
                    _bTween.obj.touchEnabled = false;
                    this.addHpText(_bTween,_goldAddAndUnit);
                    _bTween.GoldRecycleAnim(() => {
                        this.sceneInfo.goldAnimelStart();//点击后播放呼吸动画
                        Model.PlayerLocalService.PlayerData.AddGold = _goldAdd; //收到钱后更新金币数量
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_GET_COIN,_goldAdd);
                    });
                }
                tween.GoldProductionAnim((_bTween: Model.TweenCustom) => {
                    var waitBackAnim = egret.setTimeout(() => {
                        recycleCallBack(_bTween);
                        egret.clearTimeout(waitBackAnim);
                    },this,_bTween.goldWaitTime);

                    _bTween.obj.once(egret.TouchEvent.TOUCH_TAP,() => {
                        recycleCallBack(_bTween);
                        egret.clearTimeout(waitBackAnim);
                    },this);
                });//开启掉落曲线.
            }
        }
        
        /**
         * @处理显示钱币
         */
        private addHpText(_tween: Model.TweenCustom,_goldAddAndUnit: string) {
            var label = new eui.BitmapLabel();
            label.font = RES.getRes("gold-font_fnt");
            label.text = _goldAddAndUnit;
            label.x = _tween.ePos.x - label.textWidth / 2;
            label.y = _tween.ePos.y - _tween.obj.height;
            Main.singleton.mainMenuVM.addChild(label);
            egret.Tween.get(label).to({ y: 350,alpha: 0 },1200).call(() => {
                Main.singleton.mainMenuVM.removeChild(label);
            });
        }
        
        /**
         * @灵石动画.
         */
        public jewelAnimel(_jewelAdd: number,_jewelAddAndUnit: string) {
            var jewel: eui.Image = new eui.Image();
            jewel.source = "icon_lingshi";
            jewel.width = 23;
            jewel.height = 23;
            jewel.x = 500;
            jewel.y = 300;
            Main.singleton.mainMenuVM.addChild(jewel);
            var endRandomX = Model.Mathf.random(0,600);//掉落终点的x坐标
            var bezierP1X = endRandomX + Model.Mathf.random(-100,100);//返回时贝塞尔曲线的P1点x坐标 Y坐标在TweenCustom中固定
            var startPos: Model.Vector2 = new Model.Vector2(300,300);//设置出现点的起始坐标
            var endPos: Model.Vector2 = new Model.Vector2(endRandomX,Model.Mathf.random(530,550));//设置掉落点的终点坐标
            var finalPos:Model.Vector2=new Model.Vector2(266,387);//灵石最终飞入坐标
            var tween = new Model.TweenCustom(jewel,this.goldAndTextGroup,startPos,endPos,finalPos);//进行掉落返回曲线的函数      
            tween.sAnimTime = Model.Mathf.random(1200,1400);//总时长
            tween.bezierP1X = bezierP1X;//设置回收动画，贝塞尔曲线的P1点x坐标
            var recycleCallBack = (_bTween: Model.TweenCustom) => {
                _bTween.obj.touchEnabled = false;
                this.addJewelText(_bTween,_jewelAddAndUnit);
                _bTween.GoldRecycleAnim(() => {
                    Model.PlayerLocalService.PlayerData.AddJewel = Number(_jewelAdd); //收到钱后更新金币数量
                    //调用成就 2016.4.5
                    Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_GET_JEWEL,Number(_jewelAdd));
                });
            }
            tween.GoldProductionAnim((_bTween: Model.TweenCustom) => {
                var waitBackAnim = egret.setTimeout(() => {
                    recycleCallBack(_bTween);
                    egret.clearTimeout(waitBackAnim);
                },this,_bTween.goldWaitTime);

                _bTween.obj.once(egret.TouchEvent.TOUCH_TAP,() => {
                    recycleCallBack(_bTween);
                    egret.clearTimeout(waitBackAnim);
                },this);
            });//开启掉落曲线.
        }
        
        /**
         * @处理显示灵石
         */
        private addJewelText(_tween: Model.TweenCustom,_goldAddAndUnit: string) {
            var label = new eui.BitmapLabel();
            label.font = RES.getRes("gold-font_fnt");
            label.text = _goldAddAndUnit;
            label.x = _tween.ePos.x - label.textWidth / 2;
            label.y = _tween.ePos.y - _tween.obj.height;
            Main.singleton.mainMenuVM.addChild(label);
            egret.Tween.get(label).to({ y: 350,alpha: 0 },1200).call(() => {
                Main.singleton.mainMenuVM.removeChild(label);
            });
        }
        
        /**
         * @自动提交方法
         * @by cai_haotian 2016.3.30
         */ 
        private commitAuto(){
            this.commitFlag++;
            if(this.commitFlag==10){
                this.commitFlag=0;                
                Model.WebService.commitData(Model.WebValue.dataDyModel,() => {
                    if(Model.WebServiceBase.isDebug) {
                        console.log("cai_haotian: commitAuto success ! " + JSON.stringify(Model.WebValue.dataDyModel));
                    }
                },() => {
                    Main.singleton.mainMenuVM.offLineGroup.visible = true;
                    if(Model.WebValue.isTraditional) {
                        alert("數據提交失敗請聯繫管理員！！！！");
                    } else {
                        alert("数据提交失败请联系管理员！！！！");
                    }
                })
            }
        }
        
        /**
         * @怪物与成就相关数据
         * @by cai_haotian 2016.4.5
         */ 
        private achievement(){
            //调用成就 by cai_haotian 2016.4.5
            Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_KILL_ENEMY,1);
            switch(Model.MonsterLocalService.MonsterList[Model.SceneLocalService.SceneData.currentMonster].MonsterType){
                case Model.MonsterType.MONSTER_TYPE_BOSS:
                    //调用成就 by cai_haotian 2016.4.5
                    Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_KILL_BOSS,1);
                break;
                case Model.MonsterType.MONSTER_TYPE_BOX:
                    //调用成就 by cai_haotian 2016.4.5
                    Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_GET_BOX,1);
                    break;
                case Model.MonsterType.MONSTER_TYPE_PERSON:
                    break;
                    default:alert("怪物类型出错！请联系管理员！c");
            }
        }
    }
}
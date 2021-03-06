var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ViewModel;
(function (ViewModel) {
    /**
     * @author cai_haotian
     * @date 2015.12.28.
     */
    var MainInfoVM = (function (_super) {
        __extends(MainInfoVM, _super);
        function MainInfoVM(_uiLayer, _onCallBack) {
            var _this = _super.call(this) || this;
            /**
             * @主信息数据.
             */
            _this.mData = null;
            if (Model.WebValue.isTraditional) {
                _this.skinName = View.MainInfoView_tw;
            }
            else {
                _this.skinName = View.MainInfoView;
            }
            _this.uiLayer = _uiLayer;
            _this.onCallBack = _onCallBack;
            return _this;
        }
        MainInfoVM.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.initMainInfo();
        };
        /**
         * @设置主信息数据,并初始化.
         */
        MainInfoVM.prototype.initMainInfo = function () {
            this.tapDps.text = Model.PlayerLocalService.PlayerData.ClickDamageAndUnit;
            this.friendDps.text = Model.PlayerLocalService.PlayerData.FriendDamageAndUnit;
            this.currentDps.text = Model.PlayerLocalService.PlayerData.CurrentDpsAndUnit;
            //获得主角技能列表
            var pSDatas = Model.PlayerSkillLocalService.PlayerSkillList;
            this.setSkillItem(pSDatas);
        };
        /**
         * @设置当前dps.
         */
        MainInfoVM.prototype.setCurrentDps = function (_value) {
            this.currentDps.text = _value;
        };
        /**
         * @设置点击伤害.
         */
        MainInfoVM.prototype.setTapDamage = function (_value) {
            this.tapDps.text = _value;
        };
        MainInfoVM.prototype.setFriendDps = function (_value) {
            this.friendDps.text = _value;
        };
        /**
         * @设置主角6个技能
         * @by cai_haotian 2016.2.1.
         */
        MainInfoVM.prototype.setSkillItem = function (_data) {
            var _this = this;
            var skillItem;
            for (var i = 0; i < _data.length; i++) {
                skillItem = this.skillGroup.getChildAt(i);
                if (skillItem.currentState != "during" && skillItem.currentState != "disabled") {
                    //初始化技能
                    skillItem.onCallBack = function (_data, _item) {
                        Model.WebService.ReleaseSkillCD(_data.st.id, function () {
                            if (Model.WebServiceBase.isDebug) {
                                console.log("cai_haotian releaseSkill Success!!!!!");
                            }
                            //通过item的状态来实现不同函数
                            if (_item.currentState == "disabled" && _data.dy.cdTime != 0) {
                                _this.resetCD(_data, _item);
                            }
                            else if (_item.currentState == "enabled") {
                                _this.skillAnimel(_data, _item);
                            }
                        }, function () {
                            if (Model.WebValue.isTraditional) {
                                alert("釋放技能失敗！請聯繫管理員");
                            }
                            else {
                                alert("释放技能失败！请联系管理员！");
                            }
                            if (Model.WebServiceBase.isDebug) {
                                console.log("cai_haotian releaseSkill failed!!!!!!");
                            }
                        });
                    };
                }
                //初始化技能信息
                skillItem.initSkill(_data[i]);
            }
        };
        /**
         * @技能动画
         * @by cai_haotian 2016.3.15.
         */
        MainInfoVM.prototype.skillAnimel = function (_data, _item, _flag, _onCallBack) {
            var _this = this;
            if (_flag === void 0) { _flag = true; }
            var mc;
            var mcItem;
            var armature;
            var duringTime = _flag ? _data.continueTime : 15;
            var cd = null;
            //技能1的时候方法
            //            var skillOncAnimate = () => {
            //                mcItem = new ViewModel.HeroItemVM(Main.singleton.mainGameVM.yungeFrontSkill);
            //                mc = mcItem.initMovieClip("Tx_zhujue_0" + _data.st.id + "_json","Tx_zhujue_0" + _data.st.id + "_png","Tx_zhujue_0" + _data.st.id,1,() => {
            //                    Main.singleton.mainGameVM.yungeFrontSkill.removeChild(mcItem.movieClip);
            //                });
            //                duringTime = 0;
            //                Model.AudioService.Shared().PlaySound("YX-007_mp3");
            //            };
            var enemyHit = function () { Main.singleton.mainGameVM.enemyHit(); };
            if (_flag) {
                _item.touchEnabled = false;
                _item.currentState = "during";
                _item.counterCD.text = Model.PlayerSkillLocalService.timeDes(duringTime);
            }
            else {
                _item.touchEnabled = false;
                if (_item.currentState == "enabled") {
                    _item.currentState = "disabled";
                    egret.setTimeout(function () {
                        _item.currentState = "enabled";
                    }, this, duringTime);
                }
                if (_onCallBack) {
                    _onCallBack(_data, duringTime);
                }
            }
            //技能特效
            switch (_data.st.id) {
                case 1:
                    //技能1 是单次点击后直接播放 并且开始计时cd
                    //给主游戏添加点击动画
                    //                    Main.singleton.mainGameVM.clickBtn.once(egret.TouchEvent.TOUCH_TAP,skillOncAnimate,this);
                    //3秒后实现攻击
                    egret.setTimeout(function () {
                        mcItem = new ViewModel.HeroItemVM(Main.singleton.mainGameVM.yungeFrontSkill);
                        mc = mcItem.initMovieClip("Tx_zhujue_0" + _data.st.id + "_json", "Tx_zhujue_0" + _data.st.id + "_png", "Tx_zhujue_0" + _data.st.id, 1, function () {
                            Main.singleton.mainGameVM.yungeFrontSkill.removeChild(mcItem.movieClip);
                        });
                        duringTime = 0;
                        Model.AudioService.Shared().PlaySound("YX-007_mp3");
                        Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function () {
                            Main.singleton.mainGameVM.cutHp(true);
                        }, _flag);
                    }, this, duringTime * 1000);
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL1, 1);
                    }
                    //调用技能逻辑效果
                    break;
                case 2:
                    mcItem = new ViewModel.HeroItemVM(Main.singleton.mainGameVM.yungeFrontSkill);
                    mc = mcItem.initMovieClip("Tx_zhujue_0" + _data.st.id + "_json", "Tx_zhujue_0" + _data.st.id + "_png", "Tx_zhujue_0" + _data.st.id, -1, function () { });
                    mc.addEventListener(egret.Event.LOOP_COMPLETE, enemyHit, this);
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL2, 1);
                    }
                    //调用技能逻辑效果
                    Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function () {
                        Main.singleton.mainGameVM.cutHp(true);
                    }, _flag);
                    break;
                case 3:
                    var particleEffects = new Model.Particles(Main.singleton.mainGameVM.yungeFrontSkill, "Tx_zhujue_03_particle_png", "Tx_zhujue_03_particle_json");
                    var partcleObject = particleEffects.setParticlesPos(272, 280);
                    partcleObject.start();
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL3, 1);
                    }
                    var factory = Model.DragonBones.addArmatureToFactory("Tx_zhujue_03_json", "Tx_zhujue_03_part_json", "Tx_zhujue_03_part_png");
                    armature = Model.DragonBones.buildArmature(factory, "Tx_zhujue_03");
                    Model.DragonBones.play(Main.singleton.mainGameVM.yungeFrontSkill, armature, "Tx_zhujue_03", 300, 440);
                    //调用技能逻辑效果
                    Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function () {
                    }, _flag);
                    break;
                case 4:
                    //龙骨动画
                    mcItem = new ViewModel.HeroItemVM(Main.singleton.mainGameVM.yungeSkill0);
                    mc = mcItem.initMovieClip("Tx_zhujue_04_json", "Tx_zhujue_04_png", "Tx_zhujue_04", -1, function () { });
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL4, 1);
                    }
                    Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function () {
                    }, _flag);
                    break;
                case 5:
                    this.bufferAnimel(Main.singleton.mainGameVM.yungeFrontSkill, function () {
                        var factory = new ViewModel.EffectSkillVM(Main.singleton.mainGameVM.yungeSkill0, function () { });
                        armature = factory.initDragonBone("Tx_zhujue_05_part_json", "Tx_zhujue_05_part_png", "Tx_zhujue_05_json", 0);
                    });
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL5, 1);
                    }
                    //调用技能逻辑效果
                    Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function () {
                    }, _flag);
                    break;
                case 6:
                    //最后一个特效为粒子特效
                    var particleEffects = new Model.Particles(Main.singleton.mainGameVM.yungeFrontSkill, "Tx_zhujue_06_2_png", "Tx_zhujue_06_2_json");
                    var partcleObject = particleEffects.setParticlesPos(272, 142);
                    if (_flag) {
                        //调用成就 by cai_haotian 2016.4.5
                        Model.AchievementLocalService.setCurrentGet(Model.AchievementType.ACHIEVEMENT_TYPE_USE_SKILL6, 1);
                    }
                    //调用技能逻辑效果
                    Model.PlayerSkillLocalService.PlayerSkillEffect(_data, function (_gold, _goldAndunit) {
                        Main.singleton.mainGameVM.goldAnimel(_gold, _goldAndunit);
                    }, _flag);
                    break;
                default:
                    alert("主角技能使用出错！请联系管理员！！");
            }
            //技能处在持续时间中
            var during = egret.setInterval(function () {
                duringTime--;
                if (_flag) {
                    _item.counterCD.text = Model.PlayerSkillLocalService.timeDes(duringTime);
                }
                if (_onCallBack) {
                    _onCallBack(_data, duringTime);
                }
                //技能持续时间过完
                if (duringTime <= 0) {
                    egret.clearInterval(during);
                    _item.touchEnabled = true;
                    switch (_data.st.id) {
                        case 1:
                            //移除技能1的监听事件
                            //                            Main.singleton.mainGameVM.clickBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,skillOncAnimate,this);
                            break;
                        case 2:
                            Main.singleton.mainGameVM.yungeFrontSkill.removeChild(mc);
                            mc.removeEventListener(egret.Event.LOOP_COMPLETE, enemyHit, _this);
                            break;
                        case 3:
                            Main.singleton.mainGameVM.yungeFrontSkill.removeChild(armature.display);
                            Main.singleton.mainGameVM.yungeFrontSkill.removeChild(partcleObject);
                            break;
                        case 4:
                            Main.singleton.mainGameVM.yungeSkill0.removeChild(mc);
                            break;
                        case 5:
                            //此层级在后面
                            Main.singleton.mainGameVM.yungeSkill0.removeChild(armature.display);
                            break;
                        case 6:
                            //粒子动画特效移除
                            Main.singleton.mainGameVM.yungeFrontSkill.removeChild(partcleObject);
                            break;
                        default:
                            alert("主角技能使用出错！请联系管理员！！");
                    }
                    if (_flag) {
                        _item.currentState = "disabled";
                        _item.initSkillCD(_data);
                    }
                }
            }, this, 1000);
        };
        /**
         * @缓冲动画
         * @by cai_haotian 2016.2.19.
         */
        MainInfoVM.prototype.bufferAnimel = function (_uiGroup, _onCallback) {
            var bufferFactory = Model.DragonBones.addArmatureToFactory("Tx_zhujue_hc0405_json", "Tx_zhujue_hc0405_texture_json", "Tx_zhujue_hc0405_texture_png");
            var bufferArmature = Model.DragonBones.buildArmature(bufferFactory, "Tx_zhujue_hc0405");
            Model.DragonBones.play(_uiGroup, bufferArmature, "Tx_zhujue_hc0405", 275, 450, 1);
            bufferArmature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, function (evt) {
                _uiGroup.removeChild(bufferArmature.display);
                _onCallback();
            }, this);
        };
        /**
         * @重置技能cd
         * @by cai_haotian 2016.2.24.
         */
        MainInfoVM.prototype.resetCD = function (_data, _item) {
            var _this = this;
            var resetCD = new ViewModel.ResetSkillVM(Main.singleton, _data, function (_data) {
                Model.PlayerSkillLocalService.reduceCD(_data, function () {
                    _this.initMainInfo();
                    egret.clearInterval(_item.cd);
                });
            });
        };
        return MainInfoVM;
    }(eui.Component));
    ViewModel.MainInfoVM = MainInfoVM;
    __reflect(MainInfoVM.prototype, "ViewModel.MainInfoVM");
})(ViewModel || (ViewModel = {}));
//# sourceMappingURL=MainInfoVM.js.map
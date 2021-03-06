module Model {
	/**
     * @author by cai_haotian 2015.12.23.
     * @modification: zhu_jun, 
     * @date: 2016.01.14.
     */
	export class PlayerData {
		public constructor(_dy:PlayerDyModel,_st:SystemConfigStModel) {
		    this.dy = _dy;
		    this.st = _st;
		}
		/**
		 * @每秒点击伤害.
		 */ 
        private perSecondTapDamage:number = 0
        
        public set PerSecondTapDamage(_value:number){
            this.perSecondTapDamage += _value;
            this.CurrentDps = this.perSecondTapDamage + this.dy.friendDamage; 
        }
        
        /*
		 * @当前dps值.
		 */ 
        private currentDps : number = 0;
        
        public set CurrentDps(_value:number){
            this.currentDps = _value;  
            Main.singleton.mainMenuVM.mainInfo.setCurrentDps(this.CurrentDpsAndUnit);
        }
        
        /**
         * @带单位当前秒伤.
         */ 
        public get CurrentDpsAndUnit():string{
            return MainLocalService.toUnitConversion(this.currentDps);
        }
        
        /**
         * @直接设置灵石数量.
         */ 
        public set Jewel(_value:number){
            this.dy.jewel = _value;
//            Main.singleton.mainGameVM.sceneInfo
            //TODO: by zhu_jun,这边需要更新灵石.
        }
        /**
         * @正加负减灵石数量.
         */ 
        public set AddJewel(_value:number){
            this.dy.jewel = Number(this.dy.jewel) + _value;
//            Main.singleton.mainGameVM.sceneInfo
            //TODO: by zhu_jun,这边需要更新灵石.
        }
        /**
         * @设置动态金币数量.
         */ 
        public set Gold(_value:number){
            this.dy.gold = _value;
            Main.singleton.mainGameVM.sceneInfo.setMoney(this.GoldAndUnit);
        }
        /**
         * @正加负减金币数量.
         */ 
        public set AddGold(_value:number){
            this.dy.gold += _value;
            Main.singleton.mainGameVM.sceneInfo.setMoney(this.GoldAndUnit);
        }
        /**
         * @带单位金币总额.
         */ 
        public get GoldAndUnit():string{
            var value:string = MainLocalService.toUnitConversion(this.dy.gold); 
            return value;
        }
        /**
         * @基础点击伤害.
         */ 
        public clickDamageBase:number;
        
        public set ClickDamage(_value:number){
            this.dy.clickDamage = _value;
            Main.singleton.mainMenuVM.mainInfo.setTapDamage(this.ClickDamageAndUnit);
        }
        
        /**
         * @带单位点击伤害.
         */ 
        public get ClickDamageAndUnit():string{
            var value:string = MainLocalService.toUnitConversion(this.dy.clickDamage);
            return value;
        }
        /**
         * @下一级基础点击伤害.
         */ 
        public clickDamageBaseNext:number;
        /**
         * @下一级点击伤害.
         */ 
        public clickDamageNext:number;
        /**
         * @和下一级的点击伤害差值.
         */ 
        public clickDamageDelta:number;
        /**
         * @带单位的和下一级的点击伤害差值.
         */ 
        public get ClickDamageDeltaUnit():string{
            return MainLocalService.toUnitConversion(this.clickDamageDelta);
        }
        /**
         * @升级花费.
         */ 
        public upgradeCost:number;
        /**
         * @带单位升级花费.
         */ 
        public get UpgradeCostAndUnit():string{
            return MainLocalService.toUnitConversion(this.upgradeCost);
        }
        /**
         * @10连升花费
         * @by cai_haotian 2016.3.8.
         */ 
        public tenUpgradeCost:number=0;
        /**
         * @带单位10连升花费
         * @by cai_haotian 2016.3.8.
         */ 
        public get TenUpgradeCostAndUnit():string{
            return MainLocalService.toUnitConversion(this.tenUpgradeCost);
        }
        
        /**
         * @100连升花费
         * @by cai_haotian 2016.3.8.
         */
        public hundredUpgradeCost: number=0;
        /**
         * @带单位100连升花费
         * @by cai_haotian 2016.3.8.
         */
        public get HundredUpgradeCostAndUnit(): string {
            return MainLocalService.toUnitConversion(this.hundredUpgradeCost);
        }
        
        /**
         * @设置挚友伤害.
         */ 
        public set FriendDamage(_value:number){
            this.dy.friendDamage = _value;
            Main.singleton.mainMenuVM.mainInfo.setFriendDps(this.FriendDamageAndUnit);
        }
        /**
         * @带单位挚友总秒伤.
         */ 
        public get FriendDamageAndUnit():string{
            var value: string = MainLocalService.toUnitConversion(this.dy.friendDamage);
            return value;
        }
        
        
        /**
         * @获得基础暴击率
         * @by cai_haotian 2016.3.23
         */ 
        public get BaseCritDmageMultiple():number{
            var value: number = Number(this.st.baseCritDamageMultiple);
            return value;
        }
        
        /**
         * @暴击伤害.
         */ 
        public critDamage:number;
        /**
         * @获取暴击伤害.
         * @by cai_haotian 2016.3.23.
         */
        public get CritDamage():number{
            this.critDamage = (this.BaseCritDmageMultiple + FriendLocalService.FriendSkillTypeCrit / 100 + MagicWeaponService.AddCritDamage / 100+ClanLocalService.AddTypeCrit / 100) * this.dy.clickDamage;
            return this.critDamage;
        }
        /**
         * @暴击率.
         */ 
        public critRate:number;
        /**
         * @获取暴击率.
         * @by cai_haotian 2016.3.23
         */ 
        public get CritRate():number{
            this.critRate = this.st.baseCritProbability * 100 + FriendLocalService.FriendSkillTypeCritProbability / 1 + MagicWeaponService.AddCritChance / 1;
            if(this.critRate > 100){
                this.critRate = 100;
            }
            return this.critRate;
        }
        
        /**
         * @所有挚友等级
         * @by cai_haotian 2016.3.21
         */ 
        public allFriendLevel:number=0;
        /**
         * @秒伤加成
         * @by cai_haotian 2016.3.21
         */ 
        public allDamageAdd:number=0;
        /**
         * @所有铜钱加成
         * @by cai_haotian 2016.3.21
         */ 
        public allGoldAdd:number=0;
        /**
         * @所有暴击伤害加成
         * @by cai_haotian 2016.3.21
         */ 
        public allCritdDamageAdd:number=0;
        /**
         * @保护挚友是否开启
         * @by cai_haotian 2016.3.21
         */ 
        public protectFriend:boolean=false;
        /**
         * @挚友攻击动画帧率
         * @by cai_haotian 2016.3.23
         */ 
        public friendFrameRate:number=0;
        /**
         * @离线奖励钱币
         * @by cai_haotian 2016.4.10
         */ 
        public offLineMoney:number=0;
        /**
         * @商城购买标示
         * @by cai_haotian 2016.4.15
         */ 
        public shopFlag:boolean=true;
        /**
         * @是否进行活动
         * @by cai_haotian 2016.4.18.
         */ 
        public isChallenge:boolean=false;
        
        
        /**
         * @离线奖励显示 
         */ 
        public get OffLineMoney():string{
            return MainLocalService.toUnitConversion(this.offLineMoney);
        }
        
        /**
         * @主角特效配置.
         */ 
        public get EffectJson():string{
            return this.st.playerEffect + "_json";
        }
        /**
         * @主角特效图片.
         */
        public get EffectPng():string{
            return this.st.playerEffect + "_png";
        }
        /**
         * @主角特效骨骼配置.
         */
        public get Effect():string{
            return this.st.playerEffect  + "_texiao";
        }
        /**
         * @主角攻击配置.
         */
        public get AttackJson():string{
            return this.st.playerAttack + "_json";
        }
        /**
         * @主角攻击图片.
         */
        public get AttackPng(): string{
            return this.st.playerAttack + "_png";
        }        
        /**
         * @主角待机配置.
         */
        public get IdleJson(): string{
            return this.st.playerIdle + "_json";
        }
        /**
         * @主角待机图片.
         */
        public get IdlePng(): string{
            return this.st.playerIdle + "_png";
        }
        		
		public dy:PlayerDyModel;
		
		public st:SystemConfigStModel;
		
	}
}

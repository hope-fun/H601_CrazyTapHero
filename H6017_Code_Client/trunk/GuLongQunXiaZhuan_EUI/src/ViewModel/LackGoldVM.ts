module ViewModel {
	/**
	 *
	 * @author  fangchao
	 *
	 */
	export class LackGoldVM extends eui.Component {
        /**
         * @充值按钮
         */ 
        private rechargeBtn:ViewModel.BtnShareVM;
        /**
         * @取消按钮
         */
        private cancelBtn: ViewModel.BtnShareVM;
        /**
        * @父节点.
        */
        private uiLayer: eui.UILayer;
        /**
         * @回调函数.
         */
        private onCallBack: Function;
        private mask_black: eui.Image;
        private window: eui.Group;
        public constructor(_uiLayer: eui.UILayer,_onCallBack?: Function) {
            super();
            
            if(Model.WebValue.isTraditional){
                this.skinName = View.LackGoldView_tw;
            }else{
                this.skinName = View.LackGoldView;
            }
            
            this.uiLayer = _uiLayer;
            this.onCallBack = _onCallBack;
            this.uiLayer.addChild(this);
		}
        protected createChildren() {
            super.createChildren();
            this.initVM();
        }
        
        /**
         * @初始化
         */ 
        private initVM(){
            if(Model.WebValue.isTraditional){
                this.cancelBtn.description.text = "取消";
            }else{
                this.cancelBtn.description.text = "取消";
            }
            
            
            this.cancelBtn.description.size=22;
            this.cancelBtn.costIcon.visible=false;
            this.cancelBtn.costNum.visible = false;
            
            if(Model.WebValue.isTraditional){
                this.rechargeBtn.description.text = "儲值";
            }else{
                this.rechargeBtn.description.text = "充值";
            }
            
            this.rechargeBtn.description.size = 22;
            this.rechargeBtn.costIcon.visible = false;
            this.rechargeBtn.costNum.visible = false;
            
            egret.Tween.get(this.mask_black).to({ alpha: .7 },700,egret.Ease.circIn);
            egret.Tween.get(this.window).to({ y: 0 },700,egret.Ease.backOut);
            this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
                egret.Tween.get(this.mask_black).to({ alpha: 0 },700,egret.Ease.circIn);
                egret.Tween.get(this.window).to({ y: -550 },700,egret.Ease.backIn);
                egret.setTimeout(()=>{
                    this.uiLayer.removeChild(this);
                },this,700);
            },this);
            
            this.rechargeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
                this.onCallBack();
                egret.Tween.get(this.mask_black).to({ alpha: 0 },700,egret.Ease.circIn);
                egret.Tween.get(this.window).to({ y: -550 },700,egret.Ease.backIn);
                egret.setTimeout(() => {
                    this.uiLayer.removeChild(this);
                    
                    for(var i = 0;i < Main.singleton.mainMenuVM.btnGroup.length;i++) {
                        if(Main.singleton.mainMenuVM.btnBottom.btnMall == Main.singleton.mainMenuVM.btnGroup[i]) {
                            Main.singleton.mainMenuVM.btnGroup[i].currentState = "down";
                            Main.singleton.mainMenuVM.btnGroup[i].enabled = false;
                            Main.singleton.mainMenuVM.btnGroup[i].btnWord.source = Main.singleton.mainMenuVM.btnGroup[i].btnWordSourceDown;
                        } else {
                            Main.singleton.mainMenuVM.btnGroup[i].currentState = "up";
                            Main.singleton.mainMenuVM.btnGroup[i].enabled = true;
                            Main.singleton.mainMenuVM.btnGroup[i].btnWord.source = Main.singleton.mainMenuVM.btnGroup[i].btnWordSource;
                        }
                    }
                    Main.singleton.mainMenuVM.menuPopupGroup.visible = true;
                    Main.singleton.mainMenuVM.menuPopup.setMData(true);
                },this,700);
            },this);
        }
	}
}

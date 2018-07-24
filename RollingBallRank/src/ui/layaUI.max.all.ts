
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class RankListUI extends View {
		public background:Laya.Image;
		public scoreLabel:Laya.Label;
		public historyLabel:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":412,"height":732},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"background","skin":"Ui/rankbg.png"}},{"type":"Label","props":{"y":50,"x":46,"width":319,"text":"本次得分","height":77,"fontSize":50,"font":"Microsoft YaHei","color":"#fa684f","bold":true,"align":"center"}},{"type":"Label","props":{"y":122,"x":0,"width":412,"var":"scoreLabel","height":125,"fontSize":100,"font":"Microsoft YaHei","color":"#ff5a44","bold":true,"align":"center"}},{"type":"Label","props":{"y":269,"x":0,"width":412,"var":"historyLabel","text":"历史最高得分：            ","height":30,"fontSize":25,"font":"Microsoft YaHei","color":"#ff7761","align":"center"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.RankListUI.uiView);

        }

    }
}

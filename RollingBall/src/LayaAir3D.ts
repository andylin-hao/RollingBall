var maxBlockNumber:number = 10;
var environmentBoxWidth = 10;
var environmentBoxHeight = 100;
var environmentBoxGap_Z = 25;
var environmentBoxGap_Y = 10;
var maxBoxNumber:number = 5;
var blockLength:Array<number> = [16,12,20];
var blockWidth:number = 3;
var blockHeight:number = 0.5;
var rightBoundary:number = 5;
var leftBoundary:number = -5;
var maxGap = 8;
var minGap = 4;
var cameraGap = 5;
var realGap:number = 5;
// var BstProbability:Array<number> = ;
// var ObsProbability:Array<number> = ;
// var SprProbability:Array<number> = ;
// var MovProbability:Array<number> = ;

// 程序入口
class LayaAir3D {
    private playerball:PlayerBall;
    private score:number;
    private blockList:Array<Block>;
    public  scene:Laya.Scene;
    private scoreBoard:Laya.Text;
    private camera:Laya.Camera;
    private lastMousePos:Laya.Vector2;
    private mousePressed:Boolean;
    private mouseMoveFreq:number;
    private environmentBoxList:Array<Laya.MeshSprite3D>;
    private pauseButton:Pause;
    private startpos:number;
    private pausePage:PausePage;
    private pauseStatus:boolean;
    private inGame:boolean;
    private structure:Game;
    private level:number;
    constructor(gameStructure:Game) {
        
        // 开启统计信息
        // Laya.Stat.show();

        this.pauseStatus = false;
        this.inGame = false; 
        this.pausePage = new PausePage(this);
        this.initscene();
        this.structure = gameStructure;
        this.level = 0;
        
        // this.camera.addComponent(CameraMoveScript);
    }
    public initscene(){
        this.scene = new Laya.Scene();
        this.scene.enableFog = true;
       
        //添加照相机
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.scene.addChild(this.camera);
        this.camera.transform.rotate(new Laya.Vector3(-Math.PI/4, 0, 0),true, true);
        
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        var sky = new Laya.SkyBox();
        sky.textureCube = Laya.TextureCube.load("res/skyBox/skyCube.ltc");
        this.camera.sky = sky;
        
        // this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        // this.camera.clearColor = new Laya.Vector4(0.9,0.85,0.8,1);
        
        this.scene.fogColor = new Laya.Vector3(0.9,0.85,0.8);
        this.scene.fogStart = 100;
        this.scene.fogRange = 150;

        //添加方向光
        let directionLight: Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.direction = new Laya.Vector3(0.7, -1, -0.2);
        directionLight.shadow = true;
    }
    public updateStatus(){
        if(this.playerball.isDead){
            this.gameOver();
            return;
        }
        
        this.playerball.updatePos();
        this.difficultyUpdate();
        this.updateCameraPos();
        this.updateBlockList();
        this.updateEnvironment();
        this.updateScore();
    }

    public initStatus(){
        this.initBlockList();
        this.initPlayer();
        this.inGame = true;
        this.initMouseHandler();
        this.initEnvironment();
    }
    public initMouseHandler(){
        this.mousePressed = false;
        this.lastMousePos = new Laya.Vector2(0,0);
        this.mouseMoveFreq = -1;
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.mouseMoveHandler);
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDownHandler);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUpHandler);
    }
    public initBlockList(){
        this.blockList = new Array<Block>();
        let new_block:Block;
        new_block = new Block(blockWidth,blockLength[0],blockHeight);
        this.blockList.push(new_block);
        this.scene.addChild(new_block);
        
        for(let i = 1;i<maxBlockNumber;i++){
            let lastpos = this.blockList[this.blockList.length-1].transform.position;
            this.addNewBlock(lastpos);
        }

        
        
    }
    public initPlayer(){
        this.playerball = new PlayerBall(0.5,20,20);
        this.playerball.transform.translate(new Laya.Vector3(0,3,5),false);
        this.scene.addChild(this.playerball);
        this.startpos = this.playerball.transform.position.z;
        this.updateCameraPos();

    }

    public initEnvironment(){
        this.environmentBoxList = new Array<Laya.MeshSprite3D>();
        let new_box_right,new_box_left;
        for(let i = 0;i<maxBoxNumber;i++){
            new_box_right = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth,environmentBoxWidth,environmentBoxHeight));
            new_box_left = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth,environmentBoxWidth,environmentBoxHeight));
            new_box_left.transform.translate(new Laya.Vector3(-20,-40+i*(-environmentBoxGap_Y),i*(-environmentBoxGap_Z)),false);
            new_box_right.transform.translate(new Laya.Vector3(20,-40+i*(-environmentBoxGap_Y),i*(-environmentBoxGap_Z)),false);
            this.environmentBoxList.push(new_box_left);
            this.environmentBoxList.push(new_box_right);
            this.scene.addChild(new_box_left);
            this.scene.addChild(new_box_right);
        }
    }
    public initScore(){
        this.score = 0;
        this.scoreBoard = new Laya.Text();
        this.scoreBoard.text = "score";
        this.scoreBoard.color = "#FBDE5C";
        this.scoreBoard.bold = true;
        this.scoreBoard.fontSize = 50;
        this.scoreBoard.strokeColor = "#FFFFFF";
        this.scoreBoard.name = "txt";
        this.scoreBoard.pos(25, 50);
        Laya.stage.addChild(this.scoreBoard);
    }

    public difficultyUpdate(){
        if(this.score>200&&this.score<600&&this.playerball.normalSpeed>-0.4){
            this.playerball.normalSpeed =-0.4;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
        else if(this.score>600&&this.score<1000&&this.playerball.normalSpeed>-0.6){
            this.playerball.normalSpeed =-0.6;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
        else if(this.score>1000&&this.playerball.normalSpeed>-0.8){
            this.playerball.normalSpeed =-0.8;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
    }
    public levelUp(){
        this.level++;
        let levelup = new Laya.Text();
        levelup.text = "Level Up !!!";
        levelup.color = "#FFFF00";
        levelup.bold = true;
        levelup.fontSize = 80;
        levelup.strokeColor = "#FFFFFF";
        Laya.stage.addChild(levelup);
        levelup.pos(200,500);

        for(let i = 0;i<20;i++){
            setTimeout(function() {
                levelup.pos(200,500-i*4);
                levelup.alpha = 1-i*0.05;
            }, i*50);
        }
        setTimeout(function() {
                Laya.stage.removeChild(levelup);
                levelup.destroy();
        }, 1100);

    }
    public updateCameraPos(){
        let delta = new Laya.Vector3(0,0,0);
        let ra =  Math.sqrt(2)*cameraGap;
        Laya.Vector3.subtract(this.playerball.transform.position,this.camera.transform.position,delta);
        Laya.Vector3.add(delta,new Laya.Vector3(0,ra*Math.sin(Math.PI/4),ra*Math.cos(Math.PI/4)),delta);
        this.camera.transform.translate(delta,false);
        
        if(!this.playerball.isOnBlock){
           if(this.camera.transform.localRotationEuler.x>-50){
                this.camera.transform.rotate(new Laya.Vector3(-1,0,0),true,false);
            }

        }
        else{
            if(this.camera.transform.localRotationEuler.x<-40){
                this.camera.transform.rotate(new Laya.Vector3(1,0,0),true,false);
            }
        }
    }
    public updateBlockList(){
        let addnum:number = this.clearUselessBlock();
        for(let i = 0;i<addnum;i++){
            let lastpos = this.blockList[this.blockList.length-1].transform.position;
            this.addNewBlock(lastpos);
        }
        this.blockList.forEach(element => {
            element.updatePos();
        });
    }
    public updateEnvironment(){
        let addnum :number = this.clearUselessEnvBox();
        for(let i = 0;i<addnum;i++){
            let lastpos = this.environmentBoxList[this.environmentBoxList.length-1].transform.position;
            this.addNewEnvBox(lastpos);
        }
    }
    public updateScore(){
        this.score = parseInt((this.startpos-this.playerball.transform.position.z).toString());
        let txt = Laya.stage.getChildByName("txt") as Laya.Text;
        txt.text = `Score: ${this.score}`;
    }
    public clearUselessBlock():number{
        let deletenum:number = 0;
        if(this.blockList.length == 0)return 10;
        while(this.blockList[0].transform.position.z-this.blockList[0].width/2>this.camera.transform.position.z){
            deletenum++;
            this.scene.removeChild(this.blockList[0]);
            let useless = this.blockList.shift();
            useless.destroy();
            if(this.blockList[0].transform.position.y-maxGap-1>this.playerball.transform.position.y){
                this.playerball.isDead = true;
                break;
            }
        }
        return deletenum;
    }
    public clearUselessEnvBox():number{
        let deletenum:number = 0;
        if(typeof(this.environmentBoxList[0]) == undefined){
            return maxBlockNumber;
        }
        while(this.environmentBoxList[0].transform.position.z-environmentBoxWidth/2>this.camera.transform.position.z){
            deletenum++;
            this.scene.removeChild(this.environmentBoxList[0]);
            let useless = this.environmentBoxList.shift();
            useless.destroy();
        }
        return deletenum/2;
    }

    public addNewBlock(startpos:Laya.Vector3):Block{
        let moveable:boolean = (Math.random()<0.7)?false:true;
        let extraObs:boolean = (Math.random()<0.5)?false:true;
        // let extraObs:boolean = true;
        let SprBoard:boolean = (Math.random()<0.3)?false:true;
        let hBooster:boolean = (Math.random()<0.6)?false:true;
        
        let newX:number = leftBoundary-blockWidth/2+Math.random()*(rightBoundary-leftBoundary-blockWidth/2);
        let newGap:number = minGap+(maxGap-minGap)*Math.random();
        let newLen = blockLength[parseInt((Math.random()*10).toString())%3];
        let newBlock:Block = new Block(blockWidth,newLen,blockHeight,null,moveable,extraObs,SprBoard,hBooster);
        let lastlen = this.blockList[this.blockList.length-1].width;
        let thislen = newBlock.width;
        newBlock.transform.translate(new Laya.Vector3(newX,startpos.y-newGap,startpos.z-lastlen/2-thislen/2-realGap),false);
        
        this.blockList.push(newBlock);
        this.scene.addChild(newBlock);
        
        return newBlock;
    }

    public addNewEnvBox(startpos:Laya.Vector3):Array<Laya.MeshSprite3D>{
        let part = new Array<Laya.MeshSprite3D>();
        let leftrandom = (Math.random()<0.5?-1:1)*parseInt((Math.random()*25).toString());
        let rightrandom = (Math.random()<0.5?-1:1)*parseInt((Math.random()*25).toString());
        let left = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth,environmentBoxWidth,environmentBoxHeight+leftrandom));
        let right = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth,environmentBoxWidth,environmentBoxHeight+rightrandom));
        // left.transform.translate(new Laya.Vector3(-20,startpos.y-environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        // right.transform.translate(new Laya.Vector3(20,startpos.y-environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        
        left.transform.translate(new Laya.Vector3(-20,this.camera.position.y-8*environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        right.transform.translate(new Laya.Vector3(20,this.camera.position.y-8*environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        this.scene.addChild(right);
        this.scene.addChild(left);
        this.environmentBoxList.push(left);
        this.environmentBoxList.push(right);
        return part;

    }
    public mouseMoveHandler(){
        if(this.pauseStatus)return;
        if(this.mousePressed){
           let dis = (Laya.MouseManager.instance.mouseX-this.lastMousePos.x)/50;
           if(dis>-5&&dis<5)
            {this.playerball.transform.translate(new Laya.Vector3(dis,0,0),false); }
        }
        this.lastMousePos = new Laya.Vector2(Laya.MouseManager.instance.mouseX,Laya.MouseManager.instance.mouseY);
    }
    public mouseDownHandler(){
        if(this.pauseStatus)return;
        if(this.inGame){
            this.mousePressed = true;
            this.lastMousePos = new Laya.Vector2(Laya.MouseManager.instance.mouseX,Laya.MouseManager.instance.mouseY);
        }
    }
    public mouseUpHandler(){
        if(this.pauseStatus)return;
        if(this.inGame)this.mousePressed = false;
    }
    public gamePause(){
        this.pauseStatus = true;
        Laya.timer.clearAll(this);
        // Laya.stage.removeChild(this.scene);
        Laya.stage.removeChild(this.scoreBoard);
        Laya.stage.removeChild(this.pauseButton);
        Laya.stage.addChild(this.pausePage);
        Laya.SoundManager.stopSound('res/Sounds/Rage.mp3');
        this.pausePage.ani1.play('1', false);
        // this.pausePage.show();
    }
    public pauseCancel(){
        this.pauseStatus = false;
        Laya.stage.removeChild(this.pausePage);
        Laya.timer.loop(1,this,this.updateStatus);
        Laya.stage.addChild(this.scene);
        Laya.stage.addChild(this.pauseButton);
        Laya.stage.addChild(this.scoreBoard);
        this.pauseButton.isPaused = false;
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3',0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
    }
    
    public gamestart(){
        this.inGame = true;
        Laya.stage.addChild(this.scene);
        this.pauseButton = new Pause(this);
        Laya.stage.addChild(this.pauseButton);
        this.initScore();
        Laya.timer.loop(1,this,this.updateStatus);
    }

    public clearStage(){
        this.pauseStatus = false;
        Laya.stage.removeChild(this.pausePage);
        Laya.stage.offAll(Laya.Event.MOUSE_DOWN);
        Laya.stage.offAll(Laya.Event.MOUSE_MOVE);
        Laya.stage.offAll(Laya.Event.MOUSE_UP);
        this.pauseButton.destroy();
        this.score = 0;
        this.blockList.forEach(element => {
            element.destroy();
        });
        this.scoreBoard.destroy();
        this.environmentBoxList.forEach(element => {
            element.destroy();
        });
        this.playerball.destroy();
        this.scene.destroy();
    }
    public restart(){
        this.clearStage();
        this.structure.restart();
    }
    public gameOver(){
        let score1 = this.score;
        Laya.timer.clearAll(this);
        this.clearStage();
        Laya.SoundManager.playSound("res/Sounds/GG.mp3",1,new Laya.Handler(()=>{}));
        Laya.SoundManager.setSoundVolume(0.6, "res/Sounds/GG.mp3");
        this.structure.gameOver(score1);
    }
    
}

class Game{
    private game:LayaAir3D;
    private startMenu:StartMenu;
    private endPage:EndPage;
    private rankList:RankList;
    private id:string; //openId

    constructor(){
        //初始化微信小游戏
        Laya.MiniAdpter.init(true);
        //初始化引擎
        Laya3D.init(1080, 1920, true);

        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.alignV = Laya.Stage.ALIGN_CENTER;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        
        Laya.loader.load("res/atlas/Ui.atlas",Laya.Handler.create(this,this.resloaded),null,Laya.Loader.ATLAS);
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3',0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
    }
    private resloaded(){
        this.startMenu = new StartMenu(this);
        Laya.stage.addChild(this.startMenu);
        let code;
        let body = this;

        wx.login({
            //获取code
            success: res => {
                code = res.code //返回code
            },
            complete: () => {
                wx.request({
                    url: 'https://linhao16.iterator-traits.com:12306/users',
                    data: {code: code},
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        body.id = res.data.openid; //返回openid
                        console.log(body.id);
                    }
                });
            }
        })
    }
    public startAGame(){
        Laya.stage.removeChildren();
        this.game = new LayaAir3D(this);
        this.game.initStatus();
        this.game.gamestart();
    }
    public gameOver(score){
        // delete this.game;
        Laya.SoundManager.stopSound('res/Sounds/Rage.mp3');
        Laya.stage.removeChildren();
        this.endPage = new EndPage(this, score, this.id);
        Laya.stage.addChild(this.endPage);
    }
    public restart(){
        Laya.SoundManager.stopSound('res/Sounds/GG.mp3');
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3',0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
        Laya.stage.removeChildren();
        this.game.initscene();
        this.game.initStatus();
        this.game.gamestart();
     }
}
new Game();
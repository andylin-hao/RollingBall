var maxBlockNumber = 10;
var environmentBoxWidth = 10;
var environmentBoxHeight = 100;
var environmentBoxGap_Z = 25;
var environmentBoxGap_Y = 10;
var maxBoxNumber = 5;
var blockLength = [16, 12, 20];
var blockWidth = 3;
var blockHeight = 0.5;
var rightBoundary = 5;
var leftBoundary = -5;
var maxGap = 8;
var minGap = 4;
var cameraGap = 5;
var realGap = 5;
// var BstProbability:Array<number> = ;
// var ObsProbability:Array<number> = ;
// var SprProbability:Array<number> = ;
// var MovProbability:Array<number> = ;
// 程序入口
var LayaAir3D = /** @class */ (function () {
    function LayaAir3D(gameStructure) {
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
    LayaAir3D.prototype.initscene = function () {
        this.scene = new Laya.Scene();
        this.scene.enableFog = true;
        //添加照相机
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.scene.addChild(this.camera);
        this.camera.transform.rotate(new Laya.Vector3(-Math.PI / 4, 0, 0), true, true);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        var sky = new Laya.SkyBox();
        sky.textureCube = Laya.TextureCube.load("res/skyBox/skyCube.ltc");
        this.camera.sky = sky;
        // this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        // this.camera.clearColor = new Laya.Vector4(0.9,0.85,0.8,1);
        this.scene.fogColor = new Laya.Vector3(0.9, 0.85, 0.8);
        this.scene.fogStart = 100;
        this.scene.fogRange = 150;
        //添加方向光
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.direction = new Laya.Vector3(0.7, -1, -0.2);
        directionLight.shadow = true;
    };
    LayaAir3D.prototype.updateStatus = function () {
        if (this.playerball.isDead) {
            this.gameOver();
            return;
        }
        this.playerball.updatePos();
        this.difficultyUpdate();
        this.updateCameraPos();
        this.updateBlockList();
        this.updateEnvironment();
        this.updateScore();
    };
    LayaAir3D.prototype.initStatus = function () {
        this.initBlockList();
        this.initPlayer();
        this.inGame = true;
        this.initMouseHandler();
        this.initEnvironment();
    };
    LayaAir3D.prototype.initMouseHandler = function () {
        this.mousePressed = false;
        this.lastMousePos = new Laya.Vector2(0, 0);
        this.mouseMoveFreq = -1;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMoveHandler);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDownHandler);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUpHandler);
    };
    LayaAir3D.prototype.initBlockList = function () {
        this.blockList = new Array();
        var new_block;
        new_block = new Block(blockWidth, blockLength[0], blockHeight);
        this.blockList.push(new_block);
        this.scene.addChild(new_block);
        for (var i = 1; i < maxBlockNumber; i++) {
            var lastpos = this.blockList[this.blockList.length - 1].transform.position;
            this.addNewBlock(lastpos);
        }
    };
    LayaAir3D.prototype.initPlayer = function () {
        this.playerball = new PlayerBall(0.5, 20, 20);
        this.playerball.transform.translate(new Laya.Vector3(0, 3, 5), false);
        this.scene.addChild(this.playerball);
        this.startpos = this.playerball.transform.position.z;
        this.updateCameraPos();
    };
    LayaAir3D.prototype.initEnvironment = function () {
        this.environmentBoxList = new Array();
        var new_box_right, new_box_left;
        for (var i = 0; i < maxBoxNumber; i++) {
            new_box_right = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth, environmentBoxWidth, environmentBoxHeight));
            new_box_left = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth, environmentBoxWidth, environmentBoxHeight));
            new_box_left.transform.translate(new Laya.Vector3(-20, -40 + i * (-environmentBoxGap_Y), i * (-environmentBoxGap_Z)), false);
            new_box_right.transform.translate(new Laya.Vector3(20, -40 + i * (-environmentBoxGap_Y), i * (-environmentBoxGap_Z)), false);
            this.environmentBoxList.push(new_box_left);
            this.environmentBoxList.push(new_box_right);
            this.scene.addChild(new_box_left);
            this.scene.addChild(new_box_right);
        }
    };
    LayaAir3D.prototype.initScore = function () {
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
    };
    LayaAir3D.prototype.difficultyUpdate = function () {
        if (this.score > 200 && this.score < 600 && this.playerball.normalSpeed > -0.4) {
            this.playerball.normalSpeed = -0.4;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
        else if (this.score > 600 && this.score < 1000 && this.playerball.normalSpeed > -0.6) {
            this.playerball.normalSpeed = -0.6;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
        else if (this.score > 1000 && this.playerball.normalSpeed > -0.8) {
            this.playerball.normalSpeed = -0.8;
            this.playerball.Speed.z = this.playerball.normalSpeed;
            this.levelUp();
        }
    };
    LayaAir3D.prototype.levelUp = function () {
        this.level++;
        var levelup = new Laya.Text();
        levelup.text = "Level Up !!!";
        levelup.color = "#FFFF00";
        levelup.bold = true;
        levelup.fontSize = 80;
        levelup.strokeColor = "#FFFFFF";
        Laya.stage.addChild(levelup);
        levelup.pos(200, 500);
        var _loop_1 = function (i) {
            setTimeout(function () {
                levelup.pos(200, 500 - i * 4);
                levelup.alpha = 1 - i * 0.05;
            }, i * 50);
        };
        for (var i = 0; i < 20; i++) {
            _loop_1(i);
        }
        setTimeout(function () {
            Laya.stage.removeChild(levelup);
            levelup.destroy();
        }, 1100);
    };
    LayaAir3D.prototype.updateCameraPos = function () {
        var delta = new Laya.Vector3(0, 0, 0);
        var ra = Math.sqrt(2) * cameraGap;
        Laya.Vector3.subtract(this.playerball.transform.position, this.camera.transform.position, delta);
        Laya.Vector3.add(delta, new Laya.Vector3(0, ra * Math.sin(Math.PI / 4), ra * Math.cos(Math.PI / 4)), delta);
        this.camera.transform.translate(delta, false);
        if (!this.playerball.isOnBlock) {
            if (this.camera.transform.localRotationEuler.x > -50) {
                this.camera.transform.rotate(new Laya.Vector3(-1, 0, 0), true, false);
            }
        }
        else {
            if (this.camera.transform.localRotationEuler.x < -40) {
                this.camera.transform.rotate(new Laya.Vector3(1, 0, 0), true, false);
            }
        }
    };
    LayaAir3D.prototype.updateBlockList = function () {
        var addnum = this.clearUselessBlock();
        for (var i = 0; i < addnum; i++) {
            var lastpos = this.blockList[this.blockList.length - 1].transform.position;
            this.addNewBlock(lastpos);
        }
        this.blockList.forEach(function (element) {
            element.updatePos();
        });
    };
    LayaAir3D.prototype.updateEnvironment = function () {
        var addnum = this.clearUselessEnvBox();
        for (var i = 0; i < addnum; i++) {
            var lastpos = this.environmentBoxList[this.environmentBoxList.length - 1].transform.position;
            this.addNewEnvBox(lastpos);
        }
    };
    LayaAir3D.prototype.updateScore = function () {
        this.score = parseInt((this.startpos - this.playerball.transform.position.z).toString());
        var txt = Laya.stage.getChildByName("txt");
        txt.text = "Score: " + this.score;
    };
    LayaAir3D.prototype.clearUselessBlock = function () {
        var deletenum = 0;
        if (this.blockList.length == 0)
            return 10;
        while (this.blockList[0].transform.position.z - this.blockList[0].width / 2 > this.camera.transform.position.z) {
            deletenum++;
            this.scene.removeChild(this.blockList[0]);
            var useless = this.blockList.shift();
            useless.destroy();
            if (this.blockList[0].transform.position.y - maxGap - 1 > this.playerball.transform.position.y) {
                this.playerball.isDead = true;
                break;
            }
        }
        return deletenum;
    };
    LayaAir3D.prototype.clearUselessEnvBox = function () {
        var deletenum = 0;
        if (typeof (this.environmentBoxList[0]) == undefined) {
            return maxBlockNumber;
        }
        while (this.environmentBoxList[0].transform.position.z - environmentBoxWidth / 2 > this.camera.transform.position.z) {
            deletenum++;
            this.scene.removeChild(this.environmentBoxList[0]);
            var useless = this.environmentBoxList.shift();
            useless.destroy();
        }
        return deletenum / 2;
    };
    LayaAir3D.prototype.addNewBlock = function (startpos) {
        var moveable = (Math.random() < 0.7) ? false : true;
        var extraObs = (Math.random() < 0.5) ? false : true;
        // let extraObs:boolean = true;
        var SprBoard = (Math.random() < 0.3) ? false : true;
        var hBooster = (Math.random() < 0.6) ? false : true;
        var newX = leftBoundary - blockWidth / 2 + Math.random() * (rightBoundary - leftBoundary - blockWidth / 2);
        var newGap = minGap + (maxGap - minGap) * Math.random();
        var newLen = blockLength[parseInt((Math.random() * 10).toString()) % 3];
        var newBlock = new Block(blockWidth, newLen, blockHeight, null, moveable, extraObs, SprBoard, hBooster);
        var lastlen = this.blockList[this.blockList.length - 1].width;
        var thislen = newBlock.width;
        newBlock.transform.translate(new Laya.Vector3(newX, startpos.y - newGap, startpos.z - lastlen / 2 - thislen / 2 - realGap), false);
        this.blockList.push(newBlock);
        this.scene.addChild(newBlock);
        return newBlock;
    };
    LayaAir3D.prototype.addNewEnvBox = function (startpos) {
        var part = new Array();
        var leftrandom = (Math.random() < 0.5 ? -1 : 1) * parseInt((Math.random() * 25).toString());
        var rightrandom = (Math.random() < 0.5 ? -1 : 1) * parseInt((Math.random() * 25).toString());
        var left = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth, environmentBoxWidth, environmentBoxHeight + leftrandom));
        var right = new Laya.MeshSprite3D(new Laya.BoxMesh(environmentBoxWidth, environmentBoxWidth, environmentBoxHeight + rightrandom));
        // left.transform.translate(new Laya.Vector3(-20,startpos.y-environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        // right.transform.translate(new Laya.Vector3(20,startpos.y-environmentBoxGap_Y,startpos.z-environmentBoxGap_Z),false);
        left.transform.translate(new Laya.Vector3(-20, this.camera.position.y - 8 * environmentBoxGap_Y, startpos.z - environmentBoxGap_Z), false);
        right.transform.translate(new Laya.Vector3(20, this.camera.position.y - 8 * environmentBoxGap_Y, startpos.z - environmentBoxGap_Z), false);
        this.scene.addChild(right);
        this.scene.addChild(left);
        this.environmentBoxList.push(left);
        this.environmentBoxList.push(right);
        return part;
    };
    LayaAir3D.prototype.mouseMoveHandler = function () {
        if (this.pauseStatus)
            return;
        if (this.mousePressed) {
            var dis = (Laya.MouseManager.instance.mouseX - this.lastMousePos.x) / 50;
            if (dis > -5 && dis < 5) {
                this.playerball.transform.translate(new Laya.Vector3(dis, 0, 0), false);
            }
        }
        this.lastMousePos = new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);
    };
    LayaAir3D.prototype.mouseDownHandler = function () {
        if (this.pauseStatus)
            return;
        if (this.inGame) {
            this.mousePressed = true;
            this.lastMousePos = new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);
        }
    };
    LayaAir3D.prototype.mouseUpHandler = function () {
        if (this.pauseStatus)
            return;
        if (this.inGame)
            this.mousePressed = false;
    };
    LayaAir3D.prototype.gamePause = function () {
        this.pauseStatus = true;
        Laya.timer.clearAll(this);
        // Laya.stage.removeChild(this.scene);
        Laya.stage.removeChild(this.scoreBoard);
        Laya.stage.removeChild(this.pauseButton);
        Laya.stage.addChild(this.pausePage);
        Laya.SoundManager.stopSound('res/Sounds/Rage.mp3');
        this.pausePage.ani1.play('1', false);
        // this.pausePage.show();
    };
    LayaAir3D.prototype.pauseCancel = function () {
        this.pauseStatus = false;
        Laya.stage.removeChild(this.pausePage);
        Laya.timer.loop(1, this, this.updateStatus);
        Laya.stage.addChild(this.scene);
        Laya.stage.addChild(this.pauseButton);
        Laya.stage.addChild(this.scoreBoard);
        this.pauseButton.isPaused = false;
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3', 0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
    };
    LayaAir3D.prototype.gamestart = function () {
        this.inGame = true;
        Laya.stage.addChild(this.scene);
        this.pauseButton = new Pause(this);
        Laya.stage.addChild(this.pauseButton);
        this.initScore();
        Laya.timer.loop(1, this, this.updateStatus);
    };
    LayaAir3D.prototype.clearStage = function () {
        this.pauseStatus = false;
        Laya.stage.removeChild(this.pausePage);
        Laya.stage.offAll(Laya.Event.MOUSE_DOWN);
        Laya.stage.offAll(Laya.Event.MOUSE_MOVE);
        Laya.stage.offAll(Laya.Event.MOUSE_UP);
        this.pauseButton.destroy();
        this.score = 0;
        this.blockList.forEach(function (element) {
            element.destroy();
        });
        this.scoreBoard.destroy();
        this.environmentBoxList.forEach(function (element) {
            element.destroy();
        });
        this.playerball.destroy();
        this.scene.destroy();
    };
    LayaAir3D.prototype.restart = function () {
        this.clearStage();
        this.structure.restart();
    };
    LayaAir3D.prototype.gameOver = function () {
        var score1 = this.score;
        Laya.timer.clearAll(this);
        this.clearStage();
        Laya.SoundManager.playSound("res/Sounds/GG.mp3", 1, new Laya.Handler(function () { }));
        Laya.SoundManager.setSoundVolume(0.6, "res/Sounds/GG.mp3");
        this.structure.gameOver(score1);
    };
    return LayaAir3D;
}());
var Game = /** @class */ (function () {
    function Game() {
        //初始化微信小游戏
        Laya.MiniAdpter.init(true);
        //初始化引擎
        Laya3D.init(1080, 1920, true);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.alignV = Laya.Stage.ALIGN_CENTER;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.loader.load("res/atlas/Ui.atlas", Laya.Handler.create(this, this.resloaded), null, Laya.Loader.ATLAS);
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3', 0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
    }
    Game.prototype.resloaded = function () {
        this.startMenu = new StartMenu(this);
        Laya.stage.addChild(this.startMenu);
        var code;
        var body = this;
        wx.login({
            //获取code
            success: function (res) {
                code = res.code; //返回code
            },
            complete: function () {
                wx.request({
                    url: 'https://linhao16.iterator-traits.com:12306/users',
                    data: { code: code },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        body.id = res.data.openid; //返回openid
                        console.log(body.id);
                    }
                });
            }
        });
    };
    Game.prototype.startAGame = function () {
        Laya.stage.removeChildren();
        this.game = new LayaAir3D(this);
        this.game.initStatus();
        this.game.gamestart();
    };
    Game.prototype.gameOver = function (score) {
        // delete this.game;
        Laya.SoundManager.stopSound('res/Sounds/Rage.mp3');
        Laya.stage.removeChildren();
        this.endPage = new EndPage(this, score, this.id);
        Laya.stage.addChild(this.endPage);
    };
    Game.prototype.restart = function () {
        Laya.SoundManager.stopSound('res/Sounds/GG.mp3');
        Laya.SoundManager.playSound('res/Sounds/Rage.mp3', 0);
        Laya.SoundManager.setSoundVolume(0.6, 'res/Sounds/Rage.mp3');
        Laya.stage.removeChildren();
        this.game.initscene();
        this.game.initStatus();
        this.game.gamestart();
    };
    return Game;
}());
new Game();
//# sourceMappingURL=LayaAir3D.js.map
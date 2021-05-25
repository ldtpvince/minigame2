var resTypeMonster = {
    monster0: res.GAME_MONSTER + "/bat/monster_bat_run_",
    monster1: res.GAME_MONSTER + "/giant/monster_giant_run_",
    monster2: res.GAME_MONSTER + "/swordsman/monster_swordsman_run_",
    monster3: res.GAME_MONSTER + "/assassin/monster_assassin_run_",
    monster4: res.GAME_MONSTER + "/ninja/monster_ninja_run_"
}

var resMonsterSpriteNum = {
    monster0: {
        downRight: [8, 15]
    },
    monster1: {
        down: [0, 10],
        right: [33, 44]
    },
    monster2: {
        down: [0, 11],  
        right: [27, 35]
    },
    monster3: {
        down: [0, 9],
        right: [20, 28]
    },
    monster4: {
        down: [0, 9],
        right: [20, 29]
    }
}

var Monster = cc.Class.extend({
    pos:[],
    type:-1,
    animation:[],
    animCur:null,
    moveVector:null,
    path:null,
    curPointIndex:0,
    life:2,
    speed:77,

    ctor:function(x, y, type, screen, path) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.path = path;

        this.monsterId = "monster" + type;
        //cc.log(monsterId);
        this.sprite = cc.Sprite.create(resTypeMonster[this.monsterId] + '0000.png');
        this.sprite.setPosition(screen.convertPosToWorld(0, 0));
        screen.addChild(this.sprite, 1);
        // this.initAnimation();
        // this.moveAnimation();

    }
})

var WalkMonster = Monster.extend({
    animDown:null,
    animRight:null,

    ctor:function(x, y, type, screen, path) {
        this._super(x, y, type, screen, path);
        this.moveVector = [cc.p(0, -this.speed), cc.p(this.speed, 0)];
        this.initAnimation();
    },
    initAnimation:function() {
        var animation = cc.Animation.create();
        var startAni = resMonsterSpriteNum[this.monsterId].down[0];
        var endAni = resMonsterSpriteNum[this.monsterId].down[1];
        for (var i = startAni; i <= endAni; ++i) {
            var frameId = ('000' + i).slice(-4);
            animation.addSpriteFrameWithFile(resTypeMonster[this.monsterId] + frameId + '.png');
        }
        animation.setDelayPerUnit(0.08);
        this.animDown = cc.Animate.create(animation);
        this.animDown.retain();

        if (this.animDown === null) cc.log('null');

        animation = cc.Animation.create();
        startAni = resMonsterSpriteNum[this.monsterId].right[0];
        endAni = resMonsterSpriteNum[this.monsterId].right[1];
        for (var i = startAni; i <= endAni; ++i) {
            var frameId = ('000' + i).slice(-4);
            animation.addSpriteFrameWithFile(resTypeMonster[this.monsterId] + frameId + '.png');
        }
        animation.setDelayPerUnit(0.08);
        this.animRight = cc.Animate.create(animation);
        this.animRight.retain();
    },
    moveAnimation:function(animCur, moveVector) {
        var seqAni = cc.sequence(animCur);
        var seqMove = cc.sequence(cc.moveBy(1, moveVector));
        var spawn = cc.spawn(seqAni, seqMove);
        this.sprite.runAction(spawn.speed(2));
    },
    runPath:function() {
        var nextPoint = this.curPointIndex + 1;
        if (this.curPointIndex < this.path.length - 1) {
            if (this.path[this.curPointIndex].y == this.path[nextPoint].y && this.path[this.curPointIndex].x != this.path[nextPoint].x) {
                this.animCur = this.animDown.clone();
                //this.sprite.stopAllActions();
                this.moveAnimation(this.animCur, this.moveVector[0]);
            }
            else if (this.path[this.curPointIndex].x == this.path[nextPoint].x && this.path[this.curPointIndex].y != this.path[nextPoint].y) {
                this.animCur = this.animRight.clone();
                //this.sprite.stopAllActions();
                this.moveAnimation(this.animCur, this.moveVector[1]);
            }
            this.curPointIndex = nextPoint;
        }
    }
})

var FlyMonster = Monster.extend({    
    ctor:function(x, y, type, screen, path) {
        this._super(x, y, type, screen, path);
        this.moveVector = cc.p(10, -10);
        this.initAnimation();
    },
    initAnimation:function() {
        var animation = cc.Animation.create();
        var startAni = resMonsterSpriteNum['monster0'].downRight[0];
        var endAni = resMonsterSpriteNum['monster0'].downRight[1];
        for (var i = startAni; i <= endAni; ++i) {
            var frameId = ('000' + i).slice(-4);
            animation.addSpriteFrameWithFile(resTypeMonster[this.monsterId] + frameId + '.png');
        }
        animation.setDelayPerUnit(0.08);
        this.animCur = cc.Animate.create(animation);
        this.animCur.retain();
    },
    moveAnimation:function() {
        var seqAni = cc.sequence(this.animCur);
        var seqMove = cc.sequence(cc.moveBy(1, this.moveVector));
        var spawn = cc.spawn(seqAni, seqMove);
        //var action = spawn.repeatForever();
        this.sprite.runAction(spawn.speed(2));
    },
    runPath:function() {
        this.moveAnimation();
    }
})
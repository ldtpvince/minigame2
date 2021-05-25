var ScreenMap = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,
    mapSize:7,
    anchorMapX:0,
    anchorMapY:0,
    floor:[],
    map:null,
    ratio:1,
    monster:[],
    obstacle:[],
    typeOfMons:5,
    mapAnchor:[],
    tileSize:null,
    tileUnder:14,
    score:0,
    heart:3,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();
        this.initMap(size.width /2, size.height / 2);
        this.initRandomObstacle();
        this.monsterFactory = new MonsterManager(this.map, this);
        cc.log('test');
        //cc.log([size.width, size.height]);
        //map.init(size.width / 3, size.height / 3, this);
        // sword
        this.sword = cc.Sprite.create("assests/game/Asset/map/map_sword.png");
        this.addChild(this.sword, 3);
        this.sword.setScale(0.2);
        this.sword.setAnchorPoint(cc.p(0.5, 0.5));
        this.sword.setRotation(-70);

        let mouseListener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
        
                var pos = event.getLocation(), target = event.getCurrentTarget();
                let s = target.getContentSize();
            
                var rect = cc.rect(0, 0, s.width, s.height);
                target.sword.x = pos.x;
                target.sword.y = pos.y;
                let r = target.sword.getRotation();
                target.sword.runAction(cc.rotateTo(0, -90));
                if (cc.rectContainsPoint(rect, pos)) {
                    for (let i = 0; i < target.monster.length; ++i) {
                        if (target.monster[i].sprite == null) continue;
                        let monsBox = target.monster[i].sprite.getBoundingBoxToWorld();
                        
                        if (cc.rectContainsPoint(monsBox, pos)) {
                            target.monster[i].life -= 1;
                            target.score++;

                            return true;
                            
                        }
                    }
        
                    return true;
                }
                return false;
            },
            onMouseMove:function(event) {
                var pos = event.getLocation();
                var target = event.getCurrentTarget();
                target.sword.x = pos.x;
                target.sword.y = pos.y;
                
                
                // cc.log(pos.x);
                // cc.log(target.sword.x);
            },
            onMouseUp:function(event) {
                var pos = event.getLocation();
                var target = event.getCurrentTarget();
                target.sword.x = pos.x;
                target.sword.y = pos.y;
                target.sword.runAction(cc.rotateTo(0, -70));
            }
        });
        cc.eventManager.addListener(mouseListener, this);;
        this.schedule(this.update.bind(this), rand(1,3));
        //this.update();
        this.schedule(this.moveMonster.bind(this), 0.5);
    },
    initMap:function(x, y) {
        this.anchorMapX = x;
        this.anchorMapY = y;
        
        for (var i = this.mapSize - 4; i >= -3 ; --i) {
            for (var j = this.mapSize - 4; j >= -3; --j) {
                var randTile = rand(0, 1);
                var fileName = res.GAME_MAP + "/map_cell_000" + randTile + ".png";
                var tempSprite = cc.Sprite.create(fileName);

                if (this.tileSize == null) {
                    this.tileSize = cc.size(tempSprite.width, tempSprite.height - this.tileUnder);
                }
                this.addChild(tempSprite, 0);
                //cc.log([this.anchorMapX, this.anchorMapY]);
                tempSprite.setPosition(this.anchorMapX + i * tempSprite.width, this.anchorMapY + j * (tempSprite.height - this.tileUnder));
                this.floor.push(tempSprite);
            }
        }

        // init map state 
        this.map = new Array(this.mapSize);
        for (var i = 0; i < this.mapSize; ++i) {
            this.map[i] = new Array(this.mapSize);
        }

        for (var i = 0; i < this.mapSize; ++i) {
            for (var j = 0; j < this.mapSize; ++j) {
                this.map[i][j] = 1;
            }
        }

        // init main house
        var fileName = res.GAME_MAP + '/map_house.png';
        this.houseSprite = cc.Sprite.create(fileName);
        this.addChild(this.houseSprite, 0);
        this.houseSprite.setPosition(x * 2 * 4/5, y * 2 / 5);
    },
    initRandomObstacle:function() {
        var numObs = rand(5, 7);
        var cnt = 0; 
        
        while(cnt < numObs) {
            var x = rand(0, this.mapSize - 1);
            var y = rand(0, this.mapSize - 1);
            
            if (((x == 0 && y == 0)) || ((x == this.mapSize - 1) && (y == this.mapSize - 1))) {
                continue;
            }
            else if (this.map[x][y] == 1 && !this.isObstacleNear(x, y)) {
                this.map[x][y] = 0;
                cc.log('check1');
                cc.log([x, y]);

                cnt++;
                var worldPos = this.convertPosToWorld(x, y);
                var typeObs = rand(1, 3);
                var tempObstacle = new Obstacle(worldPos.x, worldPos.y, typeObs, this);
                //cc.log(tempObstacle.sprite);
                this.obstacle.push(tempObstacle);
            }
        } 
    },
    getValueAt:function(x, y) {
        if (x < 0 || x >= this.mapSize) {
            return 1;
        }
        else if (y < 0 || y >= this.mapSize) {
            return 1;
        }
        else return this.map[x][y];
    },
    isObstacleNear:function(x, y) {
        let check = 0;
        
        for (var i = -1; i <= 1; ++i) {
            for (var j = -1; j <= 1; ++j) {
                if (i == 0 && j == 0) continue;
                check += this.getValueAt(x + i, y + j);
                //cc.log(check);
            }
        }

        if (check < 8) {
            return true;
        }
        else return false;
    },
    update:function() {
        this.createMonster();
    },
    createMonster:function() {  
        var monsterType = rand(0, this.typeOfMons - 1);
        var tempMonster = this.monsterFactory.getMonster(monsterType);
        this.monster.push(tempMonster);  
        // for (var i = 0; i < numObs; ++i) {
        //     var monsterType = rand(0, typeOfMons - 1);
        //     var tempMonster = new Monster(0, 0, monsterType);
        //     monster.push(tempMonster);
        // }
    },
    moveMonster:function() {
        for (var i = 0; i < this.monster.length; ++i) {
            var curPosWorld = this.monster[i].sprite.getPosition();
            //if (this.monster[i] == null) continue;
            var curLife = this.monster[i].life;
            
            var curPos = this.convertWorldToPos(curPosWorld.x, curPosWorld.y);
            if ((curPos.x == 6 && curPos.y == 6) || curLife <= 0) {

                this.monster[i].sprite.removeFromParent();
                this.monster.splice(i, 1);
                i--;
                //cc.log('end here');
                this.heart--;
            }
            else {
                this.monster[i].runPath();
            }
        }
    },
    convertPosToWorld:function(x, y) {
        var leftMostAnchor = cc.p(this.anchorMapX - this.mapSize * this.tileSize.width / 2 * this.ratio, this.anchorMapY + this.mapSize * this.tileSize.height / 2 * this.ratio);
        newX = leftMostAnchor.x + y * this.tileSize.width + this.tileSize.width / 2 * this.ratio;
        newY = leftMostAnchor.y - x * this.tileSize.height - this.tileSize.height / 2 * this.ratio;

        return cc.p(newX, newY);
    },
    convertWorldToPos:function(x, y) {
        var leftMostAnchor = cc.p(this.anchorMapX - this.mapSize * this.tileSize.width / 2 * this.ratio, this.anchorMapY + this.mapSize * this.tileSize.height / 2 * this.ratio);
        newX = (leftMostAnchor.x +  this.tileSize.width / 2 * this.ratio - x) / (-this.tileSize.width);
        newY = (leftMostAnchor.y  - this.tileSize.height / 2 * this.ratio - y) / this.tileSize.height;
        
        return cc.p(Math.floor(newX), Math.floor(newY));
    }
})
var GameMap = cc.Class.extend({
    mapSize:7,
    floor:[],
    x:0,
    y:0,
    ratio:1,
    monster:[],
    obstacle:[],
    typeOfMons:5,
    mapAnchor:[],
    tileSize:null,

    ctor:function(x, y, screen) {
        this.setPos(x, y);
        for (var i = this.mapSize - 4; i >= -3 ; --i) {
            for (var j = this.mapSize - 4; j >= -3; --j) {
                var randTile = rand(0, 1);
                var fileName = res.GAME_MAP + "/map_cell_000" + randTile + ".png";
                var tempSprite = cc.Sprite.create(fileName);

                if (this.tileSize == null) {
                    this.tileSize = cc.size(tempSprite.width, tempSprite.height - 14);
                }
                screen.addChild(tempSprite, 0);
                tempSprite.setPosition(this.x + i * tempSprite.width, this.y + j * (tempSprite.height - 14));
                this.floor.push(tempSprite);
            }
        }
        //cc.log([this.floor[48].getPosition().x, this.floor[48].getPosition().y])
        this.initRandomObstacle(screen);
        //this.schedule(this.createMonster, rand(1, 2));
    },
    initRandomObstacle:function(screen) {
        var numObs = rand(5, 7);
        //var numObs = 1;
        var set = new Set();
        //cc.log(numObs);
        while(set.size < numObs) {
            var x = rand(0, this.mapSize - 1);
            var y = rand(0, this.mapSize - 1);
            //var x = 0, y = 0;
            //cc.log(x * this.mapSize + y);

            if (set.has(x * this.mapSize + y) || this.isObstacleNear(set, x, y)) {
                //cc.log(set.size);
                continue;
            }
            else {
                set.add(x * this.mapSize + y);
                var worldPos = this.convertPosToWorld(x, y);
                var typeObs = rand(1, 3);
                var tempObstacle = new Obstacle(worldPos.x, worldPos.y, typeObs, screen);
                //cc.log(tempObstacle.sprite);
                this.obstacle.push(tempObstacle);
            }
        } 
    },
    isObstacleNear:function(set, x, y) {
        var leftId = (x - 1) * this.mapSize + y;
        var rightId = (x + 1) * this.mapSize + y;
        var upId = x * this.mapSize + y + 1;
        var downId = x * this.mapSize + y - 1;

        if (set.has(leftId) || set.has(rightId) || set.has(upId) || set.has(downId)) {
            return true;
        }
        return false;
    },
    setPos:function(x, y) {
        this.x = x;
        this.y = y;
    },
    update:function() {
        this.schedule(this.createMonster(), 3);
    },
    createMonster:function() {  
        var monsterType = rand(0, typeOfMons - 1);
        var tempMonster = new Monster(0, 0, monsterType);
        monster.push(tempMonster);  
        // for (var i = 0; i < numObs; ++i) {
        //     var monsterType = rand(0, typeOfMons - 1);
        //     var tempMonster = new Monster(0, 0, monsterType);
        //     monster.push(tempMonster);
        // }
    },
    convertPosToWorld:function(x, y) {
        var leftMostAnchor = cc.p(this.x - this.mapSize * this.tileSize.width / 2 * this.ratio, this.y - this.mapSize * this.tileSize.height / 2 * this.ratio);
        x = leftMostAnchor.x + x * this.tileSize.width + this.tileSize.width / 2 * this.ratio;
        y = leftMostAnchor.y + y * this.tileSize.height + this.tileSize.height / 2 * this.ratio;
        //cc.log([x, y]);
        //cc.log([leftMostAnchor.x, leftMostAnchor.y]);
        //var test = this.floor[48].getPosition();
        cc.log([test.x, test.y]);
        cc.log([x, y]);
        return cc.p(x, y);
    }
})
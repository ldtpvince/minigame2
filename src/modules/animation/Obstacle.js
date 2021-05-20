var resTypeObstacle = {
    obstacle0 : res.GAME_MAP + "/map_forest_obstacle_1.png",
    obstacle1 : res.GAME_MAP + "/map_forest_obstacle_2.png",
    obstacle2 : res.GAME_MAP + "/map_forest_obstacle_3.png"
}

var Obstacle = cc.Class.extend({
    pos:[],
    type:-1,

    ctor:function(x, y, type, screen) {
        this.pos.push([x, y]);
        this.type = type;

        let obstacleId = "obstacle" + type;
        cc.log(obstacleId);
        //cc.log(resTypeObstacle[obstacleId]);
        // this.sprite = cc.Sprite.create(resTypeMonster.obstacleId);

        // screen.addChild(this.sprite, 1);
    }
})
var resTypeObstacle = {
    obstacle1 : res.GAME_MAP + "/map_forest_obstacle_1.png",
    obstacle2 : res.GAME_MAP + "/map_forest_obstacle_2.png",
    obstacle3 : res.GAME_MAP + "/map_forest_obstacle_3.png"
}

var Obstacle = cc.Class.extend({
    pos:[],
    type:-1,

    ctor:function(x, y, type, screen) {
        this.pos.push([x, y]);
        this.type = type;

        let obstacleId = 'obstacle' + type;
        
        var fileName = resTypeObstacle[obstacleId].toString();
        //cc.log(fileName);
        this.sprite = cc.Sprite.create(fileName);
        
        screen.addChild(this.sprite, 1);
        this.sprite.setPosition(x, y);
    }
})
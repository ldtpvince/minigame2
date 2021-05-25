var MonsterManager = cc.Class.extend({
    map:null,
    path:null,
    monster:[],

    ctor:function(map, screen) {
        this.map = map;
        this.screen = screen;
        this.findPath();
    },
    findPath:function() {
        
        var graph = new Graph(this.map);
        var start = graph.grid[0][0];
        var end = graph.grid[6][6];
        this.path = astar.search(graph, start, end);
        cc.log(this.path.length);
        for (var i = 0; i < this.path.length; ++i) {
            cc.log([this.path[i].x, this.path[i].y]);
        }
        this.path.unshift(graph.grid[0][0]);
    },
    getMonster:function(type) {
        switch (type) {
            case 0:
                return new FlyMonster(0, 0, type, this.screen, this.path);
            default:
                return new WalkMonster(0, 0, type, this.screen, this.path);
        }
    }
})
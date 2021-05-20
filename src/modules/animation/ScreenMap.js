var ScreenMap = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,
    mapSize:7,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();
        //cc.log([size.width, size.height]);
        this.map =  new GameMap(size.width / 2, size.height / 2 , this);
        //map.init(size.width / 3, size.height / 3, this);
    }
})
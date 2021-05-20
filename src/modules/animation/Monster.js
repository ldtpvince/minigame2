var resTypeMonster = {
    monster0: res.GAME_MONSTER + "/bat/monster_bat_",
    monster1: res.GAME_MONSTER + "/giant/monster_giant_",
    monster2: res.GAME_MONSTER + "/swordsman/monster_swordsman_",
    monster3: res.GAME_MONSTER + "/assassin/monster_assassin_",
    monster4: res.GAME_MONSTER + "/ninja/monster_ninja_"
}

var Monster = cc.Class.extend({
    pos:[],
    type:-1,
    animation:[],

    ctor:function(x, y, type, screen) {
        this.x = x;
        this.y = y;
        this.type = type;

        let monsterId = "monster" + type;
        this.sprite = cc.Sprite.create(resTypeMonster[monsterId]);
        this.sprite.setPosition(scene.convertPosToWorld(0, 0));
        screen.addChild(this.sprite, 1);
    }
})
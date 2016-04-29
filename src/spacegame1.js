window.onload = function () {
    Crafty.init(window.innerWidth, window.innerHeight, document.getElementById('game'));
    Crafty.background('#000000');

    createScore();
    createShootingControls();
    createEnemy();
    createShip();
};

var createShip = function(){
    Crafty.e('PlayerShip, 2D, DOM, Color, SpaceShipControls')
        .attr({x: 50, y: 60, w: 20, h: 20})
        .color('#2ECC71')
        .origin("center");
};

var createShootingControls = function(){
    Crafty.e("Keyboard").bind("KeyDown", function(e){
        var ship = Crafty("PlayerShip"), k = Crafty.keys, vx = ship.vx, vy = ship.vy, speed = 500;
        var x = ship.x + ship.w/2, y = ship.y + ship.h/2;
        if([k.LEFT_ARROW, k.UP_ARROW, k.RIGHT_ARROW, k.DOWN_ARROW].indexOf(e.key) > -1){

            switch (e.key){
                case k.LEFT_ARROW : vx -= speed; break;
                case k.UP_ARROW : vy -= speed; break;
                case k.RIGHT_ARROW : vx += speed; break;
                case k.DOWN_ARROW : vy += speed; break;
            }

            createBullet(x, y, vx, vy);
        }
    });
};

var createEnemy = function(){
    Crafty.e("Enemy, 2D, DOM, Color, Collision")
        .attr({x: 500, y:500, w: 20, h:20})
        .color("#0000FF");
};

var createBullet = function(x, y, vx, vy){
    Crafty.e('Bullet, 2D, DOM, Color, Motion, Collision')
        .attr({x: x, y:y, w: 5, h: 5, vx : vx, vy : vy})
        .color('#E74C3C')
        .onHit("Enemy", hitEnemy);
};

var createScore = function (){
    Crafty.e("Score, DOM, 2D, Text")
        .attr({ x: 20, y: 20, w: 100, h: 20})
        .textColor("#FFFFFF")
        .text("0 Points");
};

var score = 0;
var hitEnemy = function(hitData){
    this.destroy();
    hitData[0].obj.destroy();
    score = score + 1;
    Crafty("Score").text(score + " Points");
};

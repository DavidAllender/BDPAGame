window.onload = function () {
    Crafty.init(window.innerWidth, window.innerHeight, document.getElementById('game'));
    Crafty.background('#000000');

    createScore();
    createInstructions();
    createShootingControls();
    createEnemy();
    createShip();
    createWalls();
};

var createInstructions = function(){
	var w = 200;
	Crafty.e("DOM, 2D, Text")
        .attr({ x: window.innerWidth - w - 20, y: 20, w: w, h: 80})
        .textColor("#FFFFFF")
        .text("You are the green box.<br>The blue box is your enemy.<br>Shoot at it with the arrow keys.<br>Fly your ship with AWDS.");
}

var createWalls = function(){
    var wallWidth = 500;
    var wallOffset = 100; 
    Crafty.e("Wall, 2D, DOM, Collision").attr({x:-wallWidth, y:-wallOffset, w:wallWidth, h:window.innerHeight + wallOffset * 2});
    Crafty.e("Wall, 2D, DOM, Collision").attr({x:-wallOffset, y:-wallWidth, w:window.innerWidth + wallOffset * 2, h:wallWidth});
    Crafty.e("Wall, 2D, DOM, Collision").attr({x:-wallOffset, y:window.innerHeight, w:window.innerWidth + wallOffset * 2, h:wallWidth});
    Crafty.e("Wall, 2D, DOM, Collision").attr({x:window.innerWidth, y:-wallOffset, w:wallWidth, h:window.innerHeight + 2 * wallOffset});
};

var createShip = function(){
    Crafty.e('PlayerShip, Destructible, 2D, DOM, Color, SpaceShipControls, Collision')
        .attr({x: 50, y: 60, w: 20, h: 20})
        .color('#2ECC71')
        .origin("center")
        .onHit("Wall", bounce);
};

var bounce = function(hits){
    if(hits[0].normal.x!=0){
        this.vx = -1 * this.vx;
    }

    if(hits[0].normal.y!=0){
        this.vy = -1 * this.vy;
    }
};

var createShootingControls = function(){
    Crafty.e("Keyboard").bind("KeyDown", function(e){
        var ship = Crafty("PlayerShip"), k = Crafty.keys, vx = ship.vx, vy = ship.vy, speed = 500, x, y;
        if([k.LEFT_ARROW, k.UP_ARROW, k.RIGHT_ARROW, k.DOWN_ARROW].indexOf(e.key) > -1){

            switch (e.key){
                case k.LEFT_ARROW : vx -= speed; x = ship.x -10; y = ship.y + ship.h/2; break;
                case k.UP_ARROW : vy -= speed; x = ship.x + ship.w/2; y= ship.y -10; break;
                case k.RIGHT_ARROW : vx += speed; x = ship.x + ship.w + 10; y = ship.y + ship.h/2; break;
                case k.DOWN_ARROW : vy += speed; x = ship.x + ship.w/2; y = ship.y + ship.h + 10; break;
            }

            createBullet(x, y, vx, vy);
        }
    });
};

var createEnemy = function(){
    var rand = Crafty.math.randomNumber;
    Crafty.e("Enemy, Destructible, 2D, DOM, Color, Collision, Motion")
        .attr({x: rand(0, window.innerWidth), y:rand(0, window.innerHeight), w: 20, h:20, vx: rand(-400, 400), vy:rand(-400, 400)})
        .color("#0000FF")
        .onHit("Wall", bounce);
};

var createBullet = function(x, y, vx, vy){
    Crafty.e('Bullet, Destructible, 2D, DOM, Color, Motion, Collision')
        .attr({x: x, y:y, w: 5, h: 5, vx : vx, vy : vy})
        .color('#E74C3C')
        .onHit("Wall", bounce)
        .onHit("Bullet", hitBullet)
        .onHit("Enemy", hitEnemy)
        .onHit("PlayerShip", hitPlayer);
};

var hitBullet = function(impactData){
    var obj = impactData[0].obj;
    createExplosion(this, obj);
    this.destroy();
    obj.destroy();
};

var hitPlayer = function(impactData){
    var obj = impactData[0].obj;
    createExplosion(this, obj);
    this.destroy();
    obj.destroy();

    var w = 500;
    var h = 20;
    Crafty.e("DOM, 2D, Text")
        .attr({ x: window.innerWidth/2 - w/2, y: window.innerHeight/2 -h/2, w: w, h: h})
        .textColor("#FFFFFF")
        .css("textAlign", "center")
        .text("Game Over!");

    gameOver = true;
};

var createExplosion = function(obj1, obj2){
    var x = Math.min(obj1.x, obj2.x);
    var y = Math.min(obj1.y, obj2.y);
    var w = obj1.w + obj2.w;
    var h = obj1.h + obj2.h;
    var color = "#ff6600";
    var fadeTime = 1000;
    var remainingFadeTime = fadeTime;
    Crafty.e("Explosion, 2D, DOM, Color")
        .attr({x:x, y:y, w:w, h:h})
        .color(color)
        .bind("EnterFrame", function(info){
            this.color(color, remainingFadeTime/fadeTime);
            remainingFadeTime -= info.dt;
            if(remainingFadeTime < 0){
                this.destroy();
            }
        });
};

var createScore = function (){
    Crafty.e("Score, DOM, 2D, Text")
        .attr({ x: 20, y: 20, w: 100, h: 20})
        .textColor("#FFFFFF")
        .text("0 Points");
};

var gameOver = false;
var score = 0;
var hitEnemy = function(hitData){
    createExplosion(this, hitData[0].obj);
    this.destroy();
    hitData[0].obj.destroy();
    score = gameOver ? score : score + 1;
    Crafty("Score").text(score + " Points");
    Crafty.e("Delay").delay(createEnemy, 100, 0)
};

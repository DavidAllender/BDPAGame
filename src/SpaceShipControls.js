/**
 * Created by David Allender on 4/22/2016.
 */
Crafty.c("SpaceShipControls", {
    required: "Motion, AngularMotion, Keyboard",
    init: function () {
        var k = Crafty.keys;
        this.validKeys = [k.A, k.W, k.D, k.S, k.Q, k.E];
        this.bind("KeyUp", this._keyup);
        this.bind("KeyDown", this._keydown);
        this.bind("EnterFrame", this._enterframe);
    },
    validKeys: [],
    keys: [],
    speed: 1,
    rspeed: 1,
    _keyup: function (e) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
    },
    _keydown: function (e) {
        if(this.validKeys.indexOf(e.key) > -1) {
            this.keys.push(e.key);
        }
    },
    enforceSpeed: function(){
        var max = 500;

        if(this.vx > max){
            this.vx = max;
        }

        if (this.vx < -max){
            this.vx = -max;
        }

        if(this.vy > max){
            this.vy = max;
        }

        if(this.vy < -max){
            this.vy = -max;
        }
    },
    _enterframe: function (arg) {
        var dt = arg.dt, k = Crafty.keys;
        this.keys.forEach(function (key, i) {
            if (this.isDown(key)) {
                switch (key) {
                    case k.A: this.vx -= this.speed * dt; break;
                    case k.W: this.vy -= this.speed * dt; break;
                    case k.D: this.vx += this.speed * dt; break;
                    case k.S: this.vy += this.speed * dt; break;
                    case k.Q: this.vrotation -= this.rspeed * dt; break;
                    case k.E: this.vrotation += this.rspeed * dt; break;
                }
                this.enforceSpeed();
            } else {
                this.keys.splice(i, 1);
            }
        }, this);
    }
});
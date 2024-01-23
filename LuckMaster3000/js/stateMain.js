var credits = 100;
var credits_text;
var win_text;
var win = 0;
const newStrip = [
  { value: "1bar" },
  { value: "2bar" },
  { value: "bell" },
  { value: "3ball" },
  { value: "cherry" },
  { value: "7" },
  { value: "1bar" },
  { value: "1bar" },
  { value: "2bar" },
  { value: "3bar" },
  { value: "1bar" },
  { value: "bell" },
  { value: "cherry" },
  { value: "3bar" },
  { value: "2bar" },
  { value: "1bar" },
  { value: "2bar" },
  { value: "wild" },
  { value: "1bar" },
];

var StateMain = {
  preload: function () {
    game.load.image("background", "images/background.png");
    game.load.image("bars", "images/strip_new.png");
    game.load.image("btnSpin", "images/btnSpin.png");
    game.load.script(
      "BlurX",
      "https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js"
    );
    game.load.script(
      "BlurY",
      "https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js"
    );
  },
  create: function () {
    this.background = game.add.sprite(0, 0, "background");
    this.background.anchor.set(0, 0);

    this.barGroup = game.add.group();
    this.graphics = game.add.graphics();

    for (var i = 0; i < 3; i++) {
      var bar = game.add.sprite(i * 138, 0, "bars");
      this.barGroup.add(bar);
    }
    this.barGroup.x = 50;
    this.barGroup.y = 110;

    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(0, 0, 400, 100);
    this.graphics.endFill();

    this.graphics.x = 50;
    this.graphics.y = this.barGroup.y;
    this.barGroup.mask = this.graphics;

    this.setBar(0, 1);
    this.setBar(1, 1);
    this.setBar(2, 1);

    this.btnSpin = game.add.sprite(game.width / 2, 370, "btnSpin");
    this.btnSpin.anchor.set(0.5, 0.5);

    this.btnSpin.inputEnabled = true;
    this.btnSpin.events.onInputDown.add(this.startSpin, this);

    //Add credits Text
    credits_text = game.add.text(175, 310, "" + credits);
    credits_text.anchor.set(0.5);
    credits_text.align = "center";

    credits_text.font = "Arial Black";
    credits_text.fontSize = 22;
    credits_text.fontWeight = "bold";
    credits_text.fill = "#fff";

    //Add win Text
    win_text = game.add.text(305, 310, "0");
    win_text.anchor.set(0.5);
    win_text.align = "center";

    win_text.font = "Arial Black";
    win_text.fontSize = 20;
    win_text.fontWeight = "bold";
    win_text.fill = "#fff";
  },
  startSpin() {
    credits--;
    credits_text.text = "" + credits;
    win_text.text = "";
    this.spinCount = 3;

    this.btnSpin.visible = false;
    var s1 = game.rnd.integerInRange(1, 18);
    var s2 = game.rnd.integerInRange(1, 18);
    var s3 = game.rnd.integerInRange(1, 18);

    const finalSlotValues = [
      newStrip[s1].value,
      newStrip[s2].value,
      newStrip[s3].value,
    ];

    this.calculatePointsLogic(finalSlotValues);

    this.setStop(0, s1);
    this.setStop(1, s2);
    this.setStop(2, s3);

    this.spinTimer = game.time.events.loop(
      Phaser.Timer.SECOND / 33.33,
      this.spin,
      this
    );
  },
  setStop: function (i, stopPoint) {
    var bar = this.barGroup.getChildAt(i);
    bar.stopPoint = -stopPoint * 100;
    bar.active = true;
    bar.spins = 2 + 2 * i;
  },
  setBar: function (i, pos) {
    var bar = this.barGroup.getChildAt(i);
    bar.y = -(pos - 1) * 100;
  },

  //loop through the bar group
  //and move each bar up by the number of spins it
  //has left by 2
  spin: function () {
    this.barGroup.forEach(
      function (bar) {
        if (bar.active == true) {
          bar.y += 50;
          bar.filters = this.createBlurFilter(0,20)
          //if the bar is at the end of a spin
          //which is when the y position
          //is less than the negative height of the bar
          //40 = bounce height
          if (bar.y > bar.stopPoint + 40) {
            //if out of spins then
            if (bar.spins <= 0) {
              bar.active = false;
              //do the final spin
              //which is a tween
              this.finalSpin(bar);
            }
          }
          if (bar.y > -100) {
            this.firstSpin(bar);
          }
        }
      }.bind(this)
    );
  },
  firstSpin: function (bar) {
    bar.y -= 300;
    //then subtract a spin
    bar.spins--;
  },
  finalSpin: function (bar) {
    var ty = bar.stopPoint;
    bar.filters = null;
    
    var finalTween = game.add.tween(bar).to(
      {
        y: ty,
      },
      1000,
      Phaser.Easing.Cubic.InOut,
      true
    );
    finalTween.onComplete.add(this.checkFinished, this);
  },
  checkFinished() {
    //subtract 1 from spinCount every time
    //a bar stops
    this.spinCount--;

    //if all bars have stop reset
    if (this.spinCount == 0) {
      game.time.events.remove(this.spinTimer);

      this.btnSpin.visible = true;
      if (win > 0) {
        credits += win;
        win_text.text = "" + win;
        credits_text.text = "" + credits;
        win = 0;
      } else {
        win_text.text = "";
      }
    }
  },
  createBlurFilter: function (x, y) {
    var blurX = game.add.filter("BlurX");
    var blurY = game.add.filter("BlurY");
    blurX.blur = x;
    blurY.blur = y;
    return [blurX, blurY];
  },
  calculatePointsLogic: function (values) {
    if (values.every((x) => x === values[0])) {
      this.finalScore(values[0]);
    } else if (values.some((x) => x === "wild")) {
      const filteredValues = values.filter((x) => x !== "wild");
      if (filteredValues.every((x) => x === filteredValues[0]))
        this.finalScore(filteredValues[0]);
    }
  },
  update: function () {},
  finalScore: (value) => {
    switch (value) {
      case "2bar":
        win = 2;
        break;
      case "bell":
        win = 5;
        break;
      case "3bar":
        win = 3;
        break;
      case "cherry":
        win = 5;
        break;
      case "7":
        win = 10;
        break;
      case "1bar":
        win = 1;
        break;
      case "wild":
        win = 50;
        break;
    }
  },
};

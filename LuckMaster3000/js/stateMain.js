
// Constants
const SLOT_VALUES = ["1bar", "2bar", "bell", "3bar", "cherry", "7", "wild"];
const SPIN_DURATION = 500;
const SPIN_INTERVAL = Phaser.Timer.SECOND / 33.33;

// State variables
let credits = 1;
let win = 0;
let creditsText;
let winText;
let spinCount;
let newStrip = [
  { value: SLOT_VALUES[0] },
  { value: SLOT_VALUES[1] },
  { value: SLOT_VALUES[2] },
  { value: SLOT_VALUES[3] },
  { value: SLOT_VALUES[4] },
  { value: SLOT_VALUES[5] },
  { value: SLOT_VALUES[0] },
  { value: SLOT_VALUES[0] },
  { value: SLOT_VALUES[1] },
  { value: SLOT_VALUES[3] },
  { value: SLOT_VALUES[0] },
  { value: SLOT_VALUES[2] },
  { value: SLOT_VALUES[4] },
  { value: SLOT_VALUES[3] },
  { value: SLOT_VALUES[1] },
  { value: SLOT_VALUES[0] },
  { value: SLOT_VALUES[1] },
  { value: SLOT_VALUES[6] },
  { value: SLOT_VALUES[0] },
];

const StateMain = {
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
    const builder = Object.create(LayoutBuilder);
    builder.buildBackground();
    builder.buildBars();
    builder.buildUI(this.startSpin, this);
    
    this.btnSpin = builder.btnSpin;
    this.barGroup = builder.barGroup
  },

  startSpin() {
    credits--;
    creditsText.text = `${credits}`;
    winText.text = "";
    this.spinCount = 3;

    this.btnSpin.visible = false;

    this.tweenSpinStart();

    let s1 = game.rnd.integerInRange(1, 18);
    let s2 = game.rnd.integerInRange(1, 18);
    let s3 = game.rnd.integerInRange(1, 18);

    const finalSlotValues = [
      newStrip[s1].value,
      newStrip[s2].value,
      newStrip[s3].value,
    ];

    this.calculatePointsLogic(finalSlotValues);

    this.setStop(0, s1);
    this.setStop(1, s2);
    this.setStop(2, s3);

    this.spinTimer = game.time.events.loop(SPIN_INTERVAL, this.spin, this);
  },
  setStop: function (i, stopPoint) {
    let bar = this.barGroup.getChildAt(i);
    bar.stopPoint = -stopPoint * 100;
    bar.active = true;
    bar.spins = 2 + 2 * i;
  },
  setBar: function (i, pos) {
    let bar = this.barGroup.getChildAt(i);
    bar.y = -(pos - 1) * 100;
  },

  spin: function () {
    this.barGroup.forEach(
      function (bar) {
        if (!bar.active) return;

        bar.y += 50;
        bar.filters = this.createBlurFilter(0, 20);

        if (bar.y <= -100) return;

        if (bar.y > bar.stopPoint + 40 && bar.spins <= 0) {
            bar.active = false;
            this.finalSpin(bar);
        } else {
            this.firstSpin(bar);
        }
      }.bind(this)
    );
  },
  firstSpin: function (bar) {
    bar.y -= 300;
    bar.spins--;
  },
  finalSpin: function (bar) {
    let ty = bar.stopPoint;
    bar.filters = null;

    let finalTween = game.add.tween(bar).to(
      {
        y: ty,
      },
      SPIN_DURATION,
      Phaser.Easing.Cubic.InOut,
      true
    );
    finalTween.onComplete.add(function () {
      bar.filters = null;
      this.checkFinished();
  }, this);
  },
  checkFinished() {
    this.spinCount--;

    if (this.spinCount == 0) {
      game.time.events.remove(this.spinTimer);

      this.btnSpin.visible = true;
      if (win > 0) {
        credits += win;
        winText.text = `${win}`;
        creditsText.text = `${credits}`;
        win = 0;
      } else {
        winText.text = "";
      }
    }
  },
  createBlurFilter: function (x, y) {
    let blurX = game.add.filter("BlurX");
    let blurY = game.add.filter("BlurY");
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
  tweenSpinStart() {
    let tween = game.add
      .tween(this.barGroup)
      .to({ y: this.barGroup.y + 30 }, SPIN_DURATION, Phaser.Easing.Cubic.InOut)
      .to({ y: this.barGroup.y }, SPIN_DURATION, Phaser.Easing.Cubic.InOut);
    tween.start();
  },
  update: function () {},
  finalScore: (value) => {
    switch (value) {
      case SLOT_VALUES[0]:
        win = 2;
        break;
      case SLOT_VALUES[1]:
        win = 5;
        break;
      case SLOT_VALUES[2]:
        win = 3;
        break;
      case SLOT_VALUES[3]:
        win = 5;
        break;
      case SLOT_VALUES[4]:
        win = 10;
        break;
      case SLOT_VALUES[5]:
        win = 1;
        break;
      case SLOT_VALUES[5]:
        win = 50;
        break;
    }
  },
};
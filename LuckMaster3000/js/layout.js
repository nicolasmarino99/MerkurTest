const PhaserUIElementFactory = Object.create(UIElementFactory);

const LayoutBuilder = {
  buildBackground: function () {
    this.background = PhaserUIElementFactory.createSprite({ x: 0, y: 0, imageKey: "background" });
    this.background.anchor.set(0, 0);
  },

  buildBars: function () {
    this.barGroup = PhaserUIElementFactory.createGroup();
    this.barGroup.x = 50;
    this.barGroup.y = 110;

    this.graphics = PhaserUIElementFactory.createGraphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(0, 0, 400, 100);
    this.graphics.endFill();

    this.graphics.x = 50;
    this.graphics.y = this.barGroup.y;
    this.barGroup.mask = this.graphics;

    for (let i = 0; i < 3; i++) {
      const bar = PhaserUIElementFactory.createSprite({ x: i * 138, y: 0, imageKey: "bars" });
      this.barGroup.add(bar);
    }
  },

  buildUI: function (callback, context) {
    this.setBar(0, 1);
    this.setBar(1, 1);
    this.setBar(2, 1);

    this.btnSpin = PhaserUIElementFactory.createButton({ x: 0.5, y: 0.5, imageKey: "btnSpin" });

    creditsText = PhaserUIElementFactory.createText({
      x: 175,
      y: 310,
      content: `${credits}`,
      fontSize: 22,
    });

    winText = PhaserUIElementFactory.createText({
      x: 305,
      y: 310,
      content: `${win}`,
      fontSize: 22,
    });


    this.btnSpin.inputEnabled = true;
    this.btnSpin.events.onInputDown.add(callback, context);
  },

  setBar: function (i, pos) {
    const bar = this.barGroup.getChildAt(i);
    bar.y = -(pos - 1) * 100;
  },
};
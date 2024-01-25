const UIElementFactory = {
  createSprite: function ({ x, y, imageKey }) {
    const sprite = game.add.sprite(x, y, imageKey);
    return sprite;
  },
  createGroup: function () {return game.add.group();},
  createGraphics: function () {return game.add.graphics();},
  createText: function ({ x, y, content, fontSize }) {
    let existingText = game.world.getByName(content);

    if (existingText) {
      existingText.x = x;
      existingText.y = y;
      return existingText;
    }

    let text = game.add.text(x, y, content);
    text.name = content;
    text.anchor.set(0.5);
    text.align = "center";
    text.font = "Arial Black";
    text.fontSize = fontSize;
    text.fontWeight = "bold";
    text.fill = "#fff";

    return text;
  },
  createButton: function ({ x, y, imageKey }) {
    if (this.btnSpin) {
      return this.btnSpin;
    }

    this.btnSpin = game.add.sprite(game.width / 2, 370, imageKey);
    this.btnSpin.anchor.set(x, y);
    return this.btnSpin;
  },
};
"use strict";

/**
 * Game images.
 */
Game.Image = {
	/** Card-related images. */
	CARD_BACK: undefined,
	CARD_RED: undefined,
	CARD_BLUE: undefined,
	CARD_GRAY: undefined,

	/** Cursor image. */
	CURSOR: undefined,

	/** Rank symbols. */
	RANK: [],

	/** Score symbols. */
	SCORE: [],

	/** Special rule images. */
	SPECIAL_SAME: undefined,
	SPECIAL_PLUS: undefined,
	SPECIAL_COMBO: undefined,

	/** Result images. */
	RESULT_WIN: undefined,
	RESULT_LOSE: undefined,
	RESULT_DRAW: undefined,

	/** Info box image. */
	INFO_BOX: undefined,

	/**
	 * Adds all assets.
	 */
	addAssets: function() {
		var files = [
			"card", "card-back", "rank", "result", "score",
			"special", "spinner", "cursor", "info-box"
		];
		for (var i = 0, len = files.length; i < len; i++)
			jaws.assets.add("img/" + files[i] + ".png");
	},

	/**
	 * Initializes all game images.
	 */
	setup: function() {
		// card-related
		Game.Image.CARD_BACK = new jaws.Sprite({image: "img/card-back.png"});
		var cards = new jaws.SpriteSheet({image: "img/card.png", frame_size: [256, 256] });
		Game.Image.CARD_RED = new jaws.Sprite({});
		Game.Image.CARD_BLUE = new jaws.Sprite({});
		Game.Image.CARD_GRAY = new jaws.Sprite({});
		Game.Image.CARD_RED.setImage(cards.frames[0]);
		Game.Image.CARD_BLUE.setImage(cards.frames[1]);
		Game.Image.CARD_GRAY.setImage(cards.frames[2]);

		// cursor
		Game.Image.CURSOR = new jaws.Sprite({image: "img/cursor.png"});

		// rank symbols
		var rank = new jaws.SpriteSheet({image: "img/rank.png", frame_size: [32, 28] });
		for (var i = 0; i <= 10; i++) {
			Game.Image.RANK[i] = new jaws.Sprite({});
			Game.Image.RANK[i].setImage(rank.frames[i]);
		}

		// score symbols
		var score = new jaws.SpriteSheet({image: "img/score.png", frame_size: [96, 96] });
		for (var i = 1; i <= 9; i++) {
			Game.Image.SCORE[i] = new jaws.Sprite({});
			Game.Image.SCORE[i].setImage(score.frames[i - 1]);
		}

		// special rules
		var special = new jaws.SpriteSheet({image: "img/special.png", frame_size: [1024, 256] });
		Game.Image.SPECIAL_SAME = new jaws.Sprite({});
		Game.Image.SPECIAL_SAME.setImage(special.frames[0]);
		Game.Image.SPECIAL_PLUS = new jaws.Sprite({});
		Game.Image.SPECIAL_PLUS.setImage(special.frames[1]);
		Game.Image.SPECIAL_COMBO = new jaws.Sprite({});
		Game.Image.SPECIAL_COMBO.setImage(special.frames[2]);

		// results
		var result = new jaws.SpriteSheet({image: "img/result.png", frame_size: [1024, 195] });
		Game.Image.RESULT_WIN = new jaws.Sprite({});
		Game.Image.RESULT_WIN.setImage(result.frames[0]);
		Game.Image.RESULT_LOSE = new jaws.Sprite({});
		Game.Image.RESULT_LOSE.setImage(result.frames[1]);
		Game.Image.RESULT_DRAW = new jaws.Sprite({});
		Game.Image.RESULT_DRAW.setImage(result.frames[2]);

		// info box
		Game.Image.INFO_BOX = new jaws.Sprite({image: "img/info-box.png"});

		// spinner animations
		var spin = new jaws.Animation({sprite_sheet: "img/spinner.png",
			frame_size: [24, 33], frame_duration: 200});
		for (var i = 0; i < 8; i++) {
			Game.Spinner.anim[i] = spin.slice(i * 4, (i + 1) * 4);
			Game.Spinner.sprite[i] = new jaws.Sprite({});
			Game.Spinner.sprite[i].setImage(Game.Spinner.anim[i].next());
			Game.Spinner.frameLeft[i] = new jaws.Sprite({});
			Game.Spinner.frameLeft[i].setImage(Game.Spinner.anim[i].frames[3]);
			Game.Spinner.frameRight[i] = new jaws.Sprite({});
			Game.Spinner.frameRight[i].setImage(Game.Spinner.anim[i].frames[1]);
		}

		// resize images
		Game.Image.resize();
	},

	/**
	 * Resizes all game images.
	 */
	resize: function() {
		var baseScale = Game.CARD_LENGTH / 256;

		// card-related
		Game.Image.CARD_BACK.setScale(baseScale);
		Game.Image.CARD_RED.setScale(baseScale);
		Game.Image.CARD_BLUE.setScale(baseScale);
		Game.Image.CARD_GRAY.setScale(baseScale);

		// cursor
		Game.Image.CURSOR.setScale(baseScale / 2.25);

		// rank symbols
		for (var i = 0; i <= 10; i++)
			Game.Image.RANK[i].setScale(baseScale);

		// score symbols
		for (var i = 1; i <= 9; i++)
			Game.Image.SCORE[i].setScale(baseScale);

		// special rules
		Game.Image.SPECIAL_SAME.setScale(baseScale);
		Game.Image.SPECIAL_PLUS.setScale(baseScale);
		Game.Image.SPECIAL_COMBO.setScale(baseScale);

		// results
		Game.Image.RESULT_WIN.setScale(baseScale);
		Game.Image.RESULT_LOSE.setScale(baseScale);
		Game.Image.RESULT_DRAW.setScale(baseScale);

		// info box
		var infoScale = Game.CARD_LENGTH * 2.75 / 1024;
		Game.Image.INFO_BOX.setScale(infoScale);

		// spinner animations
		var spinScale = baseScale * 2.5;
		for (var i = 0; i < 8; i++) {
			Game.Spinner.sprite[i].setScale(spinScale);
			Game.Spinner.frameLeft[i].setScale(spinScale);
			Game.Spinner.frameRight[i].setScale(spinScale);
		}
	}
};

/**
 * Character spinners.
 */
Game.Spinner = {
	/** Left/right frame sprites. */
	frameLeft: [],
	frameRight: [],

	/** Sprite objects. */
	sprite: [],

	/** Animation objects. */
	anim: [],

	/**
	 * Updates all sprites and animations.
	 * @param {int} spinner the spinner index
	 */
	update: function(spinner) {
		Game.Spinner.sprite[spinner].setImage(Game.Spinner.anim[spinner].next());
	},

	/**
	 * Returns a random spinner.
	 * @return {int} a random spinner index
	 */
	getRandomSpinner: function() {
		return Math.floor(Math.random() * Game.Spinner.anim.length);
	}
}

/**
 * Game sounds.
 */
Game.Sound = {
	BACK: ["sounds/sound-back.wav"],
	CARD: ["sounds/sound-card.wav"],
	INVALID: ["sounds/sound-invalid.wav"],
	SELECT: ["sounds/sound-select.wav"],
	SPECIAL: ["sounds/sound-special.wav"],
	START: ["sounds/sound-start.wav"],
	TURN: ["sounds/sound-turn.wav"],

	/**
	 * Initializes all sounds.
	 */
	setup: function() {
		Game.Sound.BACK = new Howl({ "urls": Game.Sound.BACK, "volume": Game.settings.SOUND });
		Game.Sound.CARD = new Howl({ "urls": Game.Sound.CARD, "volume": Game.settings.SOUND });
		Game.Sound.INVALID = new Howl({ "urls": Game.Sound.INVALID, "volume": Game.settings.SOUND });
		Game.Sound.SELECT = new Howl({ "urls": Game.Sound.SELECT, "volume": Game.settings.SOUND });
		Game.Sound.SPECIAL = new Howl({ "urls": Game.Sound.SPECIAL, "volume": Game.settings.SOUND });
		Game.Sound.START = new Howl({ "urls": Game.Sound.START, "volume": Game.settings.SOUND });
		Game.Sound.TURN = new Howl({ "urls": Game.Sound.TURN, "volume": Game.settings.SOUND });

		// sound on/off
		document.getElementById("sound").addEventListener("click", function() {
			var sound = document.getElementById("sound");
			if (!Game.isMuted) {
				sound.src = "img/icon-sound-off.png";
				if (!Game.isPaused)
					Howler.mute();
				Game.isMuted = true;
			} else {
				sound.src = "img/icon-sound-on.png";
				if (!Game.isPaused)
					Howler.unmute();
				Game.isMuted = false;
			}
		});
	},
}
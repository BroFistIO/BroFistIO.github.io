"use strict";

/**
 * Game settings.
 */
Game.settings = {
	// volume [0, 1]
	"MUSIC": 0.6,
	"SOUND": 0.8,

	// frame rate
	"FPS": 60,

	// RANDOM, OFFENSIVE, DEFENSIVE, BALANCED
	"AI_PLAYER": "BALANCED",
	"AI_OPPONENT": "BALANCED"
};

/**
 * Game rules.
 */
Game.rules = {
	"OPEN": true,
	"SAME": true,
	"PLUS": true,
	"COMBO": true
};
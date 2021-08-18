const ROOT_DIR = 'http://localhost/resource/'
const HEART = 3.0
const SCREEN_X = 8
const SCREEN_Y = 7
const SIZE = 48
const POS_X = 8.5 * SIZE
const POS_Y = 6 * SIZE
const SCALE_GAME = 1
const SCALE_PLAYER = 1
const SCALE_TEXT = 2
const MOVE_SPEED = 250
const OCTOROK_SPEED = 120
const SLICER_SPEED = 200

kaboom({
	global: true,
	fullscreen: true,
	scale: SCALE_GAME,
	debug: true,
	clearColor: [1, 0.86, 0.66, 1]
})

// Game logic
loadRoot(ROOT_DIR)

loadSprite('bg-beige', 'bg-beige.png')
loadSprite('bg-black', 'bg-black.png')
loadSprite('bg-grey', 'bg-grey.png')
loadSprite('dock-brown', 'dock-brown.png')
loadSprite('dock-green', 'dock-green.png')
loadSprite('ladder', 'ladder.png')
loadSprite('sand', 'sand.png')

loadSprite('boulder-brown', 'boulder-brown.png')
loadSprite('boulder-green', 'boulder-green.png')
loadSprite('statue-brown', 'statue-brown.png')
loadSprite('statue-green', 'statue-green.png')
loadSprite('statue-white', 'statue-white.png')
loadSprite('tomb', 'tomb.png')
loadSprite('tree-brown', 'tree-brown.png')
loadSprite('tree-green', 'tree-green.png')
loadSprite('tree-white', 'tree-white.png')
loadSprite('wall-brown', 'wall-brown.png')
loadSprite('wall-green', 'wall-green.png')
loadSprite('wall-white', 'wall-white.png')
loadSprite('water', 'water.png')
loadSprite('waterfall', 'waterfall.png')

loadSprite('cave', 'cave.png')
loadSprite('stairs', 'stairs.png')

loadSprite('link-u1', 'link-u1.png')
loadSprite('link-u2', 'link-u2.png')

/*
loadSprite('link-d', 'link-d.png', {
	sliceX: 2,
	sliceY: 1,
	anims: {
		idle: { from 1:, to: 1 },
		run: { from 1:, to: 2 }
	}
})
*/

loadSprite('link-d1', 'link-d1.png')
loadSprite('link-d2', 'link-d2.png')
loadSprite('link-l1', 'link-l1.png')
loadSprite('link-l2', 'link-l2.png')
loadSprite('link-r1', 'link-r1.png')
loadSprite('link-r2', 'link-r2.png')

loadSprite('sword-up', 'sword-u.png')
loadSprite('sword-down', 'sword-d.png')
loadSprite('sword-left', 'sword-l.png')
loadSprite('sword-right', 'sword-r.png')

loadSprite('octorok', 'octorok-d1.png')
loadSprite('octorok-up', 'octorok-u1.png')
loadSprite('octorok-down', 'octorok-d1.png')
loadSprite('octorok-left', 'octorok-l1.png')
loadSprite('octorok-right', 'octorok-r1.png')
loadSprite('slicer', 'sword-u.png')

loadSound('music', 'overworld.mp3')
loadSound('attack', 'LOZ_Sword_Slash.wav')

scene('game', ({
	screen_x,
	screen_y,
	pos_x,
	pos_y,
	heart,
	rupee
}) => {
	const music = play('music')
	music.loop()

	layers(['bg', 'obj', 'ui'], 'obj')

	const levelCfg = {
		height: SIZE,
		width: SIZE,
		
		//' ': [sprite('bg-beige')],
		e: [sprite('dock-brown')],
		
		b: [sprite('boulder-brown'), solid(), 'wall'],
		d: [sprite('boulder-green'), solid(), 'wall'],
		r: [sprite('statue-brown'), solid(), 'wall'],
		t: [sprite('tree-brown'), solid(), 'wall'],
		u: [sprite('tree-green'), solid(), 'wall'],
		w: [sprite('wall-brown'), solid(), 'wall'],
		x: [sprite('wall-green'), solid(), 'wall'],
		a: [sprite('water'), solid(), 'wall'],
		
		c: [sprite('cave'), solid(), 'door'],
		s: [sprite('stairs'), solid(), 'door'],
		'^': [sprite('bg-black'), 'screen-up'],
		'v': [sprite('bg-black'), 'screen-down'],
		'<': [sprite('bg-black'), 'screen-left'],
		'>': [sprite('bg-black'), 'screen-right'],
		
		o: [sprite('octorok'), 'dangerous', 'octorok', { dir: -1, timer: 0 }],
		l: [sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous']
	}
	
	addLevel(overworld[screen_y][screen_x], levelCfg)

	add([sprite('bg-beige'), layer('bg')])
	
	// Display scoreboard
	
	const rupeeLabel = add([
		text('Hearts: ' + heart.toFixed(1) + ' | Rupees: ' + rupee),
		pos(SIZE, 12.1 * SIZE),
		layer('ui'),
		{ value: rupee },
		scale(SCALE_TEXT)
	])
	
	add([
		text('Screen: x=' + screen_x + ', y=' + screen_y),
		pos(SIZE, 12.6 * SIZE),
		scale(SCALE_TEXT)
	])

	// Create player
	const player = add([
		sprite('link-u1'),
		pos(pos_x, pos_y),
		{ dir: vec2(0, -1) },
		scale(SCALE_PLAYER),
		'killable'
	])

	player.action(() => { player.resolve() })
	
	player.overlaps('screen-up', () => {
		go('game', {
			heart: heart,
			rupee: rupeeLabel.value,
			screen_x: screen_x,
			screen_y: screen_y - 1,
			pos_x: player.pos.x,
			pos_y: 11 * SIZE
		})
	})
	
	player.overlaps('screen-down', () => {
		go('game', {
			heart: heart,
			rupee: rupeeLabel.value,
			screen_x: screen_x,
			screen_y: screen_y + 1,
			pos_x: player.pos.x,
			pos_y: 1 * SIZE
		})
	})
	
	player.overlaps('screen-left', () => {
		go('game', {
			heart: heart,
			rupee: rupeeLabel.value,
			screen_x: screen_x - 1,
			screen_y: screen_y,
			pos_x: 16 * SIZE,
			pos_y: player.pos.y
		})
	})
	
	player.overlaps('screen-right', () => {
		go('game', {
			heart: heart,
			rupee: rupeeLabel.value,
			screen_x: screen_x + 1,
			screen_y: screen_y,
			pos_x: 1 * SIZE,
			pos_y: player.pos.y
		})
	})
	
	keyDown(['up', 'w'], () => {
		player.changeSprite('link-u1')
		player.move(0, -MOVE_SPEED)
		player.dir = vec2(0, -1)
	})

	keyDown(['down', 's'], () => {
		player.changeSprite('link-d1')
		player.move(0, MOVE_SPEED)
		player.dir = vec2(0, 1)
	})

	keyDown(['left', 'a'], () => {
		player.changeSprite('link-l1')
		player.move(-MOVE_SPEED, 0)
		player.dir = vec2(-1, 0)
	})

	keyDown(['right', 'd'], () => {
		player.changeSprite('link-r1')
		player.move(MOVE_SPEED, 0)
		player.dir = vec2(1, 0)
	})
	
	keyPress(['space', 'f'], () => {
		attack(player.pos.add(player.dir.scale(SIZE)))
	})

	function attack(p) {
		var sword
		
		if (player.dir.x == 0 && player.dir.y == 1) {
			sword = 'sword-down'
		}
		
		else if (player.dir.x == -1) {
			sword = 'sword-left'
		}
		
		else if (player.dir.x == 1) {
			sword = 'sword-right'
		}
		
		else {
			sword = 'sword-up'
		}
		
		const obj = add([sprite(sword), pos(p), 'kaboom'])
		const attack = play('attack')
		
		wait(0.2, () => {
			destroy(obj)
		})
	}

	player.collides('door', (d) => {
		destroy(d)
	})

	collides('kaboom', 'octorok', (k,s) => {
		camShake(4)
		wait(1, () => { destroy(k) })
		destroy(s)
		rupeeLabel.value ++
		rupeeLabel.text = 'Hearts: ' + heart.toFixed(1) + ' | Rupees: ' + rupeeLabel.value
	})

	action('slicer', (s) => {
		s.move(s.dir * SLICER_SPEED, 0)
	})

	collides('slicer', 'wall', (s) => {
		s.dir = -s.dir
	})

	action('octorok', (s) => {
		if (s.axis == 0) {
			s.move(s.dir * OCTOROK_SPEED, 0)
		}
		
		else {
			s.move(0, s.dir * OCTOROK_SPEED)
		}
		
		s.timer -= dt()
		
		if (s.timer <= 0) {
			s.axis = getRandomInt(0, 1)
			s.dir = -s.dir
			s.timer = rand(5)
		}
	})

	collides('octorok', 'wall', (s) => {
		s.dir = -s.dir
	})

	player.overlaps('dangerous', (d) => {
		if (player.is('killable')) {
			// TODO: Bump and set invincible for 2 seconds
			destroy(d)
			
			heart -= 0.5
			rupeeLabel.text = 'Hearts: ' + heart.toFixed(1) + ' | Rupees: ' + rupeeLabel.value
		}
		
		if (heart <= 0) {
			go('lose', { rupee: rupeeLabel.value })
		}
	})
})

scene('lose', ({ rupee }) => {
	add([
		text(rupee, 32),
		origin('center'),
		pos(width() / 2, height() / 2)
	])
})

start('game', {
	screen_x: SCREEN_X,
	screen_y: SCREEN_Y,
	pos_x: POS_X,
	pos_y: POS_Y,
	heart: HEART,
	rupee: 0
})

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

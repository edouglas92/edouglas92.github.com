// Eric Douglas
// Comp20 Assignment 4
// game.js


//declare game constants

var level;
var lives;
//time is in seconds
var time;
var prev_score;
var score;
var highscore;
var car_timers = [];
var car_specs = [];
var cars = [];
var log_specs = [];
var logs = [];
var log_spawns = [];
var lillies = [];
var timer_width;
var frogs_home;
var frogger_sprites = {
	"up":{"ssheetx":10, "ssheety":364, "ssheetw":26, "ssheeth":26},
	"down":{"ssheetx":79, "ssheety":364, "ssheetw":26, "ssheeth":26},
	"left":{"ssheetx":79, "ssheety":332, "ssheetw":26, "ssheeth":26},
	"right":{"ssheetx":10, "ssheety":332, "ssheetw":26, "ssheeth":26},
	"dead":{"ssheetx":0, "ssheety": 0, "ssheetw":30, "ssheeth":30},
	"jright" : {"ssheetx":41, "ssheety": 332, "ssheetw":30, "ssheeth":30},
	"jleft" : {"ssheetx":110, "ssheety": 332, "ssheetw":30, "ssheeth":30},
	"jup" : {"ssheetx":41, "ssheety": 364, "ssheetw":30, "ssheeth":30},
	"jdown" : {"ssheetx":110, "ssheety": 364, "ssheetw":30, "ssheeth":30}
}
var game_over = false;

//make frogger object
var frogger = {
	
	xpos : 0,
	ypos : 0,
	orientation : "up",
	cooldown : 0,
	ymax: 491,
	width : 32,
	height : 32,
	xcent : 0,
	ycent : 0,
	onlog : false,
	log_row : 0,
	death_timer : 0,
	dead : false	 

};

var fly_timer;
var fly_sprite = {"ssheetx":135, "ssheety":232, "ssheetw":25, "ssheeth":20};
var fly_active = false;
var turtle_increment;
var turtle_cd;
var dozer_increment;
var dozer_cd;

var imgLoaded = false;
var img = new Image();
img.src = 'assets/frogger_sprites.png';
img.onload = function(){
  imgLoaded = true;
}
var imgLoaded2 = false;
var img2 = new Image();
img2.src = 'assets/dead_frog.png';
img2.onload = function(){
  imgLoaded2 = true;
}
var canvas;
var ctx;

var game = { };


game.initialize = function() {

	//initialize game constants
	level = 1;
	lives = 3;
	time = 3150;
	timer_width = (3/5)*399;
	fly_timer = 750 + Math.floor(Math.random() * 200);
	turtle_increment = 0;
	turtle_cd = 40;
	dozer_increment = 0;
	dozer_cd = 15;
	
	if (localStorage['highscore'] == undefined) {
		localStorage['highscore'] = 0;
	}
	highscore = localStorage['highscore'];
	score = 0;
	prev_score = 0;
	
	frogger.xpos = 180;
	frogger.ypos = 491;
	frogger.xcent = frogger.xpos + frogger.width/2;
	frogger.ycent = frogger.ypos + frogger.height/2;
	frogs_home = 0;


	car_specs[0] = {"yspawn" : 315, "ssheetx" : 104, "ssheety" : 300, "ssheetw" : 48, "ssheeth" : 20, "width" : 60, "height" : 30, 
					"speed" : -1.75, "time" : 90, "xspawn" : 500, "spawn_count" : 0, "max_spawn" : 2, "timer" : 50}
	car_specs[1] = {"yspawn" : 349, "ssheetx" : 45, "ssheety" : 262, "ssheetw" : 30, "ssheeth" : 27, "width" : 35, "height" : 33, 
					"speed" : 1.75, "time" : 80, "xspawn" : -100, "spawn_count" : 0, "max_spawn" : 3, "timer" : 120}
	car_specs[2] = {"yspawn" : 385, "ssheetx" : 8, "ssheety" : 265, "ssheetw" : 30, "ssheeth" : 21, "width" : 35, "height" : 30, 
					"speed" : -1.75, "time" : 80, "xspawn" : 500, "spawn_count" : 0, "max_spawn" : 3, "timer" : 0}
	car_specs[3] = {"yspawn" : 417, "ssheetx" : [9, 39, 70], "ssheety" : 296, "ssheetw" : 28, "ssheeth" : 25, "width" : 35, "height" : 33, 
					"speed" : 1.75, "time" : 80, "xspawn" : -100, "spawn_count" : 0, "max_spawn" : 3, "timer" : 0}
	car_specs[4] = {"yspawn" : 455, "ssheetx" : 80, "ssheety" : 265, "ssheetw" : 27, "ssheeth" : 26, "width" : 35, "height" : 32, 
					"speed" : -1, "time" : 130, "xspawn" : 500, "spawn_count" : 0, "max_spawn" : 3, "timer" : 0}

	log_specs[0] = {"yspawn" : 242, "ssheetx" : [12, 52, 85], "ssheety" : 401, "ssheetw" : 35, "ssheeth" : 27, "width" : 120, "height" : 37, 
					"speed" : -1.75, "time" : 85, "xspawn" : 500, "spawn_count" : 0, "max_spawn" : 5, "timer" : 0}
	log_specs[1] = {"yspawn" : 212, "ssheetx" : 5, "ssheety" : 227, "ssheetw" : 87, "ssheeth" : 27, "width" : 90, "height" : 37, 
					"speed" : 1, "time" : 150, "xspawn" : -100, "spawn_count" : 0, "max_spawn" : 3, "timer" : 0}
	log_specs[2] = {"yspawn" : 175, "ssheetx" : 5, "ssheety" : 161, "ssheetw" : 183, "ssheeth" : 27, "width" : 185, "height" : 37, 
					"speed" : 2.25, "time" : 150, "xspawn" : -200, "spawn_count" : 0, "max_spawn" : 3, "timer" : 0}
	log_specs[3] = {"yspawn" : 140, "ssheetx" : [12, 52, 85], "ssheety" : 401, "ssheetw" : 35, "ssheeth" : 27, "width" : 90, "height" : 37, 
					"speed" : -1.75, "time" : 80, "xspawn" : 500, "spawn_count" : 0, "max_spawn" : 4, "timer" : 0}
	log_specs[4] = {"yspawn" : 104, "ssheetx" : 5, "ssheety" : 192, "ssheetw" : 119, "ssheeth" : 27, "width" : 120, "height" : 37, 
					"speed" : 1.75, "time" : 100, "xspawn" : -150, "spawn_count" : 0, "max_spawn" : 4, "timer" : 0}

	lillies[0] = {xcoord :  25, ycoord : 70, width : 5, height : 20, has_frog : false, frogx :  12, frogy : 70, xcent :  27.5, ycent : 80,
				  has_fly : false};
	lillies[1] = {xcoord : 110, ycoord : 70, width : 5, height : 20, has_frog : false, frogx :  97, frogy : 70, xcent : 112.5, ycent : 80,
				  has_fly : false};
	lillies[2] = {xcoord : 195, ycoord : 70, width : 5, height : 20, has_frog : false, frogx : 182, frogy : 70, xcent : 197.5, ycent : 80,
				  has_fly : false};
	lillies[3] = {xcoord : 280, ycoord : 70, width : 5, height : 20, has_frog : false, frogx : 267, frogy : 70, xcent : 282.5, ycent : 80,
				  has_fly : false};
	lillies[4] = {xcoord : 365, ycoord : 70, width : 5, height : 20, has_frog : false, frogx : 352, frogy : 70, xcent : 367.5, ycent : 80,
				  has_fly : false};

};

function update_anims() {
	turtle_cd--;
    if (turtle_cd < 0) {
    	if (turtle_increment == 2) {
    		turtle_increment = 0;
    	}
    	else {
    		turtle_increment++;
    	}
    	turtle_cd = 40;
    }
    dozer_cd--;
    if (dozer_cd < 0) {
    	if (dozer_increment == 2) {
    		dozer_increment = 0;
    	}
    	else {
    		dozer_increment++;
    	}
    	dozer_cd = 15;
    }

}


game.draw = function () 
{

	canvas = document.getElementById('game');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		//2d rendering
		 // clear the screencontext.save();
		ctx.save(); 
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha=1;
        //Timer
        ctx.fillStyle = "#00FF00";
        ctx.fillRect (399/2, 290, 3*399/5, 20);
        
        //Water
		ctx.fillStyle = "#191970";
        ctx.fillRect (0, 0, 399, 565/2);
        
        //Road
        ctx.fillStyle = "#000000";
        ctx.fillRect (0, 565/2, 399, 565/2);
        
        //Level title
        ctx.fillStyle = "#00FF00";
    	ctx.font = "16pt Helvetica";
    	ctx.fillText("Level " + level, 60, 545);
    	
    	//Score title
    	ctx.font = "12pt Helvetica";
    	ctx.fillText("Score: " + score, 0, 560);
    	
    	//High-score title
    	ctx.font = "12pt Helvetica";
    	ctx.fillText("Highscore: " + highscore, 100, 560);
    	
    	//Timer
    	if (time > 500) {
    		ctx.fillStyle = "#00FF00";
    		ctx.font = "12pt Helvetica";
    		ctx.fillText("Time", 360, 540);
        	ctx.fillRect (timer_width, 545, timer_width, 20);
    	}
    	else {
        	ctx.fillStyle = "#FF0000";
        	ctx.font = "12pt Helvetica";
    		ctx.fillText("Time", 360, 540);
        	ctx.fillRect (timer_width, 545, timer_width, 20);
        }

    	
        //Sprite sheet
  		if (imgLoaded) {
			if (lives > 0) {
    			//frog life 1
    			ctx.drawImage(img,10,332,23,25,0,527,18,19);
    		}
    		if (lives > 1) {
    			//frog life 2
    			ctx.drawImage(img,10,332,23,25,17,527,18,19);
    		}
    		if (lives > 2) {
    			//frog life 2
    			ctx.drawImage(img,10,332,23,25,34,527,18,19);
    		}
    		//Title
    		ctx.drawImage(img,0,0,335,50,0,0,335,50);
    		//End platform
    		ctx.drawImage(img,0,53,399,62,0,48,399,62);
    		//Intermediate platform
    		ctx.drawImage(img,0,113,399,45,0,275,399,45);
    		//Start platform
    		ctx.drawImage(img,0,113,399,45,0,485,399,45);
			//Cars
			ctx.strokeStyle = "#FF0000";
    		for (var m in cars) {
    			if (cars[m].ypos == 417) {
    				ctx.drawImage(img,cars[m].ssheetx[dozer_increment],cars[m].ssheety,cars[m].ssheetw,cars[m].ssheeth,cars[m].xpos,
    						  cars[m].ypos,cars[m].width,cars[m].height);
    			}
    			else {
    				ctx.drawImage(img,cars[m].ssheetx,cars[m].ssheety,cars[m].ssheetw,cars[m].ssheeth,cars[m].xpos,
    						  cars[m].ypos,cars[m].width,cars[m].height);
    			}
    			//ctx.strokeRect(cars[m].xpos,cars[m].ypos,cars[m].width,cars[m].height);
    		}
    		//Logs
    		for (var m in logs) {
    			if (logs[m].ypos == 140) {
    				ctx.drawImage(img,logs[m].ssheetx[turtle_increment],logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,logs[m].xpos,
    						  logs[m].ypos,logs[m].width/2,logs[m].height);
    				ctx.drawImage(img,logs[m].ssheetx[turtle_increment],logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,
    							logs[m].xpos+logs[m].width/2, logs[m].ypos,logs[m].width/2,logs[m].height);
    			}
    			else if (logs[m].ypos == 242) {
    				ctx.drawImage(img,logs[m].ssheetx[turtle_increment],logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,logs[m].xpos,
    						  logs[m].ypos,logs[m].width/3,logs[m].height);
    				ctx.drawImage(img,logs[m].ssheetx[turtle_increment],logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,
    						logs[m].xpos+logs[m].width/3, logs[m].ypos,logs[m].width/3,logs[m].height);
    				ctx.drawImage(img,logs[m].ssheetx[turtle_increment],logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,
    						logs[m].xpos+(2*logs[m].width/3),logs[m].ypos,logs[m].width/3,logs[m].height);
    			}
    			else {
    				ctx.drawImage(img,logs[m].ssheetx,logs[m].ssheety,logs[m].ssheetw,logs[m].ssheeth,logs[m].xpos,
    						  logs[m].ypos,logs[m].width,logs[m].height);
    			}
    		}
    		update_anims();
    		//Frogger
    		if (frogger.orientation != "dead" && !frogger.dead) {
    			if (frogger.cooldown < 0) {
    				ctx.drawImage(img,frogger_sprites[frogger.orientation]["ssheetx"],
    				frogger_sprites[frogger.orientation]["ssheety"],frogger_sprites[frogger.orientation]
    				["ssheetw"],frogger_sprites[frogger.orientation]["ssheeth"],frogger.xpos,frogger.ypos,frogger.width,frogger.height);
    			}
    			else {
    				ctx.drawImage(img,frogger_sprites["j"+frogger.orientation]["ssheetx"],
    				frogger_sprites["j"+frogger.orientation]["ssheety"],frogger_sprites["j"+frogger.orientation]
    				["ssheetw"],frogger_sprites["j"+frogger.orientation]["ssheeth"],frogger.xpos,frogger.ypos,frogger.width,frogger.height);
    			}
    		}
    		else {
    			ctx.drawImage(img2,frogger_sprites[frogger.orientation]["ssheetx"],
    			frogger_sprites[frogger.orientation]["ssheety"],frogger_sprites[frogger.orientation]
    			["ssheetw"],frogger_sprites[frogger.orientation]["ssheeth"],frogger.xpos,frogger.ypos,frogger.width,frogger.height);
    		}
    		
    		for (var l in lillies) {
    			if (lillies[l].has_frog) {
    				ctx.drawImage(img,frogger_sprites["down"]["ssheetx"],
    				frogger_sprites["down"]["ssheety"],frogger_sprites["down"]
    				["ssheetw"],frogger_sprites["down"]["ssheeth"],lillies[l].frogx,lillies[l].frogy,frogger.width,frogger.height);
    			}
    			if (lillies[l].has_fly) {
    				ctx.drawImage(img,fly_sprite["ssheetx"],
    				fly_sprite["ssheety"],fly_sprite["ssheetw"],fly_sprite		
    				["ssheeth"],lillies[l].frogx,lillies[l].frogy,frogger.width-5,frogger.height-8);
    			}
    		}
    		
    		

  		}
  		
  		if (time > 3000) {
  		
  			ctx.fillStyle = "#000000";
        	ctx.fillRect (125, 257, 150, 50);
        	ctx.strokeStyle = "#00FF00";
    		ctx.strokeRect(125,257,150,50);
        	ctx.fillStyle = "#00FF00";
        	if (time > 3025) {//150
        		ctx.font = "26pt Helvetica";
    			ctx.fillText("Ready", 150, 295);
        	} else {
        		ctx.font = "26pt Helvetica";
    			ctx.fillText("GO!", 170, 295);
        	}
    		
    	}
    	
    	if (frogs_home == 5) {
    		ctx.fillStyle = "#000000";
        	ctx.fillRect (120, 257, 160, 50);
        	ctx.strokeStyle = "#00FF00";
    		ctx.strokeRect(120,257,160,50);
        	ctx.fillStyle = "#00FF00";
        	ctx.font = "26pt Helvetica";
    		ctx.fillText("Level Up!", 130, 295);
    	}
    	
    	if (lives == 0) {
    		ctx.fillStyle = "#000000";
        	ctx.fillRect (120, 257, 160, 50);
        	ctx.strokeStyle = "#00FF00";
    		ctx.strokeRect(120,257,160,50);
        	ctx.fillStyle = "#00FF00";
        	ctx.font = "22pt Helvetica";
    		ctx.fillText("Game Over", 125, 293);
    	}
    	
  		ctx.restore();    
	
	}
	
	else {
		alert('Sorry, canvas is not supported on your browser!');
	}

};


//user input

	$(document).keydown(function (e) {
		if (!game_over && time < 3000) {
  		var keyCode = e.keyCode || e.which,
      	arrow = {left: 37, up: 38, right: 39, down: 40 };
  		switch (keyCode) {
   			case arrow.left:
   			if ((frogger.xpos - 29 > -10) && (frogger.cooldown < 0) && (!frogger.dead)) {
      			frogger.xpos -= 29;
      			frogger.cooldown = 5;
      			frogger.orientation = "left";
      			frogger.xcent -= 29;
      		}
    		break;
    		case arrow.up:
      		if ((frogger.ypos - 35 > 10) && (frogger.cooldown < 0) && (!frogger.dead)) {
      			frogger.ypos -= 35;
      			frogger.cooldown = 5;
      			frogger.orientation = "up";
      			frogger.ycent -= 35;
      			if (frogger.ypos < frogger.ymax) {
      				score += 10;
      				prev_score += 10;
      				add_life();
      				frogger.ymax = frogger.ypos;
      			}
      		}
    		break;
    		case arrow.right:
     		if ((frogger.xpos + 29 < 375) && (frogger.cooldown < 0) && (!frogger.dead)) {
      			frogger.xpos += 29;
      			frogger.cooldown = 5;
      			frogger.orientation = "right";
      			frogger.xcent += 29;
      		}
    		break;
    		case arrow.down:
      		if ((frogger.ypos + 35 < 500) && (frogger.cooldown < 0) && (!frogger.dead)) {
      			frogger.ypos += 35;
      			frogger.cooldown = 5;
      			frogger.orientation = "down";
      			frogger.ycent += 35;
      		}
    		break;
  		}
  		}
	});



function collide(x1, y1, size1, x2, y2, size2) {
  var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
  left1 = x1 - size1;
  right1 = x1 + size1;
  top1 = y1 - size1;
  bottom1 = y1 + size1;
  left2 = x2 - size2;
  right2 = x2 + size2;
  top2 = y2 - size2;
  bottom2 = y2 + size2;
  return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
};

function rect_collide(x1, y1, xsize1, ysize1, x2, y2, xsize2, ysize2) {
  var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
  left1 = x1 - xsize1;
  right1 = x1 + xsize1;
  top1 = y1 - ysize1;
  bottom1 = y1 + ysize1;
  left2 = x2 - xsize2;
  right2 = x2 + xsize2;
  top2 = y2 - ysize2;
  bottom2 = y2 + ysize2;
  return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
};

function create_car(spec) {
	var car = new Object();
	car.speed = spec["speed"];
	car.xpos = spec["xspawn"];
	car.ypos = spec["yspawn"];
	car.width = spec["width"];
	car.height = spec["height"];
	car.ssheetx = spec["ssheetx"];
	car.ssheety = spec["ssheety"];
	car.ssheetw = spec["ssheetw"];
	car.ssheeth = spec["ssheeth"];
	car.xcenter = car.xpos + car.width/2;
	car.ycenter = car.ypos + car.height/2;
	car.colliding = rect_collide;
	return car;
}

function create_log(spec) {
	var log = new Object();
	log.speed = spec["speed"];
	log.xpos = spec["xspawn"];
	log.ypos = spec["yspawn"];
	log.width = spec["width"];
	log.height = spec["height"];
	log.ssheetx = spec["ssheetx"];
	log.ssheety = spec["ssheety"];
	log.ssheetw = spec["ssheetw"];
	log.ssheeth = spec["ssheeth"];
	log.xcenter = log.xpos + log.width/2;
	log.ycenter = log.ypos + log.height/2;
	log.colliding = rect_collide;
	return log;
}

function respawn_frog() {
	if (frogger.orientation == "dead") {
		lives-=1;
	}
	if (lives == 0) {
		game_over = true;
		if (score > highscore) {
			localStorage['highscore'] = score;
		}
	} else {
		frogger.xpos = 180;
		frogger.ypos = 491;
		frogger.xcent = frogger.xpos + frogger.width/2;
		frogger.ycent = frogger.ypos + frogger.height/2;
		frogger.ymax = 491;
		frogger.orientation = "up";
		time = 3000;
		timer_width = (3/5)*399;
		frogger.dead = false;
	}
}

function update_cars() {

	for (var m in cars) {
		cars[m].xpos += cars[m].speed;
		cars[m].xcenter += cars[m].speed;
		if (cars[m].colliding(cars[m].xcenter, cars[m].ycenter, cars[m].width/2-3, cars[m].height/2-3, 
			frogger.xcent, frogger.ycent, frogger.width/2, frogger.height/2) && !frogger.dead) {
			frogger.dead = true;
			frogger.death_timer = 50; 
			frogger.orientation = "dead";
		}
		if (cars[m].xpos > 500) {
			cars.splice(m, 1);
		}
	}

}

function update_logs() {

	for (var m in logs) {
		logs[m].xpos += logs[m].speed;
		logs[m].xcenter += logs[m].speed;
		if (logs[m].colliding(logs[m].xcenter, logs[m].ycenter, logs[m].width/2 - frogger.width/2, 1, 
			frogger.xcent, frogger.ycent, frogger.width/2, frogger.height/2)) {
			logs[m].hasfrogger = true;
		}
		else {
			logs[m].hasfrogger = false;
		}
		if (logs[m].xpos > 600) {
			logs.splice(m, 1);
		}
	}
	var on_log = false;
	var row = -1;
	for (var m in logs) {
		if (logs[m].hasfrogger) {
			on_log = true;
			switch(logs[m].ypos) {
				case 242:
					row = 0;
					break;
				case 212:
					row = 1;
					break;
				case 175:
					row = 2;
					break;
				case 142:
					row = 3;
					break;
				case 104:
					row = 4;
					break;
				default:
					row = 0;
			}
		}
	}
	if (on_log) {
		frogger.onlog = true;
		frogger.log_row = row;
	}
	else {
		frogger.onlog = false;
	}

}

function add_life() {
	if (prev_score > 10000) {
		if (lives < 3) {
		lives += 1;
		}
		prev_score = prev_score-10000;
	}
}

function update_lillies() {

	for (var m in lillies) {
		if (rect_collide(lillies[m].xcent, lillies[m].ycent, lillies[m].width/2, lillies[m].height/2, 
			frogger.xcent, frogger.ycent, frogger.width/2, frogger.height/2) && !lillies[m].has_frog && !frogger.dead) {
				lillies[m].has_frog = true;
				frogs_home += 1;
				score += ((Math.floor(time/50))*10 + 50);
				prev_score += ((Math.floor(time/50))*10 + 50);
				add_life();
				if (lillies[m].has_fly) {
					score += 200;
					prev_score += 200;
					lillies[m].has_fly = false;
					add_life();
				}
				frogger.dead = true;
				frogger.death_timer = 25; 
				
		}
	}

}

function level_up(lev) {
	score += 1000;
	prev_score += 1000;
	add_life();
	for (var l in lillies) {
			lillies[l].has_frog = false;
			car_specs[l]["speed"] = car_specs[l]["speed"]*(1.2);
			car_specs[l]["time"] = car_specs[l]["time"]*(0.8);
			log_specs[l]["speed"] = log_specs[l]["speed"]*(1.2);
			log_specs[l]["time"] = log_specs[l]["time"]*(1.1);
	}
	for (var c in cars){
		cars[c].speed = cars[c].speed*(1.2);
	}
	for (var c in logs) {
		logs[c].speed = logs[c].speed*(1.2);
	}
	frogs_home = 0;

}

game.update = function() {
	
	if (!game_over) {
		time -= 1;
		frogger.death_timer -= 1;
		fly_timer -= 1;
	}
	if ((time%25 == 0) && (time<3000)){
		timer_width += 1.33;
	}
	frogger.cooldown -= 1;
	
	for (var m in car_specs) {
		car_specs[m]["timer"] -= 1;
		if (car_specs[m]["timer"] < 0) {
			var vehicle = create_car(car_specs[m]);
			cars.push(vehicle);
			car_specs[m]["timer"] = car_specs[m]["time"];
			car_specs[m]["spawn_count"] += 1;
			if (car_specs[m]["spawn_count"] >= car_specs[m]["max_spawn"]) {
				car_specs[m]["timer"] += car_specs[m]["time"];
				car_specs[m]["spawn_count"] = 0;
			}
		}
	}
	
	for (var m in log_specs) {
		log_specs[m]["timer"] -= 1;
		if (log_specs[m]["timer"] < 0) {
			var log = create_log(log_specs[m]);
			logs.push(log);
			log_specs[m]["timer"] = log_specs[m]["time"];
			log_specs[m]["spawn_count"] += 1;
			if (log_specs[m]["spawn_count"] >= log_specs[m]["max_spawn"]) {
				log_specs[m]["timer"] += 0.75*log_specs[m]["time"];
				log_specs[m]["spawn_count"] = 0;
			}
		}
	}

	update_cars();
	update_logs();
	update_lillies();
	
	if (frogs_home == 5 && (frogger.death_timer < 0)) {
		level += 1;
		level_up(level);
	}
	
	
	if (frogger.ypos < 250 && !frogger.onlog && !frogger.dead) {
		frogger.dead = true;
		frogger.death_timer = 50;
		frogger.orientation = "dead";

	}
	if (frogger.onlog && (frogger.xpos < 375) && (frogger.xpos > -10) && (!frogger.dead)) {
		frogger.xpos += log_specs[frogger.log_row]["speed"];
		frogger.xcent += log_specs[frogger.log_row]["speed"];
	}
	if (time < 0 && !frogger.dead) {
		frogger.dead = true;
		frogger.death_timer = 50;
		frogger.orientation = "dead";

	}
	if(game_over) {
		frogger.death_timer = 100;
	}

	if (frogger.dead && (frogger.death_timer < 0)) {
		respawn_frog();
	}
	
	if (fly_timer < 150 && !fly_active) {
		var l = Math.floor(Math.random() * 5);
		if (!lillies[l].has_frog && !lillies[l].has_fly) {
			lillies[l].has_fly = true;
			fly_active = true;
		}
		else {
			fly_timer = 150;
		}
	}
	if (fly_timer < 0) {
		for (var l in lillies) {
			lillies[l].has_fly = false;
		}
		fly_active = false;
		fly_timer = 750 + Math.floor(Math.random() * 200);
	}
	

};

game.fps = 50;

game.run = (function() {
  var loops = 0, skipTicks = 1000 / game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();
  
  return function (){
    loops = 0;
    
    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
      game.update();
      nextGameTick += skipTicks;
      loops++;
    }
    
    game.draw();
  };
})();


function start_Game() {
			game.initialize();
            game._intervalID = setInterval(game.run, 0);
}


function submit_score(){
	var username = 'test';
	
	$.post("http://quiet-coast-3990.herokuapp.com/submit.json", 
			{game_title: "Frogger", username: username, score: score});
}
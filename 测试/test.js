

let canvas = document.getElementById('canvas');

let ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let left_bound  = canvas.width / 3;
let right_bound = canvas.width - left_bound;


ctx.strokeStyle = 'white';
ctx.beginPath();
ctx.moveTo(left_bound,0);
ctx.lineTo(left_bound,canvas.height);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(right_bound,0);
ctx.lineTo(right_bound,canvas.height);
ctx.stroke(); 	

class Brick{
	
	
	constructor(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
	}
	
	draw(){
		ctx.strokeStyle = 'white';
		ctx.fillStyle = '#55007f';
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(this.x + this.width,this.y);
		ctx.lineTo(this.x + this.width,this.y + this.height);
		ctx.lineTo(this.x,this.y + this.height);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	
	checkCollision(ball){
		let x = ball.x;
		let y = ball.y;
		let bottom = this.y + this.height;
		let right = this.x + this.width;
		let top = this.y;
		let left = this.x;
		let dis = ball.radius;
		
		if(Math.abs(left - x) <= dis && y >= top && y <= bottom){
			ball.changeDir(1)
			return true;
		}
		if(Math.abs(x - right) <= dis && y >= top && y <= bottom){
			ball.changeDir(0);
			return true;
		}
		if(Math.abs(bottom - y) <= dis && x >= left && x <= right){
			ball.changeDir(3);
			return true;
		}
		if(Math.abs(top - y) <= dis && x >= left && x <= right){
			ball.changeDir(2);
			return true;
		}
		return false;
	}

}

let brickList = [];
for(let i = 0;i < 20;i++){
	for(let j = 0;j < 40;j++){
		brickList.push(new Brick(left_bound + 50 + j * 10,
								50 + i * 20,
								10,
								10));
	}
}

for(let i = 0;i < brickList.length;i++){
	brickList[i].draw();
}

class Ball{
	
	constructor(x,y,speedx,speedy,radius){
		this.x = x;
		this.y = y;
		this.speedx = speedx;
		this.speedy = speedy;
		this.radius = radius;
		this.tag = 0;
	}
	
	update(){
		let x = this.x + this.speedx;
		let y = this.y + this.speedy;
		if(x - this.radius <= left_bound){
			this.speedx = Math.abs(this.speedx);
		}
		if(x + this.radius >= right_bound){
			this.speedx = -Math.abs(this.speedx);
		}
		
		if(y + this.radius >= canvas.height){
			this.speedy = -Math.abs(this.speedy);
			this.tag = 0;
		}
		
		if(y - this.radius <= 0){
			this.speedy = Math.abs(this.speedy);
			this.tag = 1;
		}
		
		this.x += this.speedx;
		this.y += this.speedy;
	}
	
	draw(){
		
		ctx.fillStyle = this.tag == 0 ? 'firebrick' : '#0055ff';
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
		ctx.fill();
	}
	
	changeDir(dir){
		switch(dir){
			case 0:this.speedx = Math.abs(this.speedx);break;		//???
			case 1:this.speedx = -Math.abs(this.speedx);break;		//???
			case 2:this.speedy = -Math.abs(this.speedy);break;		//???
			case 3:this.speedy = Math.abs(this.speedy);break;		//???
		}
	}
}

// let ball = new Ball((left_bound + right_bound) / 2,canvas.height - 50,10,10,5);

let ballList = [];

for(let i = 0;i < 8;i++){
	ballList.push(new Ball(Math.random() * (right_bound - left_bound) + left_bound,
						-Math.random() * 40 + canvas.height,
						Math.random() * 4 + 2,
						Math.random() * 4 + 2,5))
}

setInterval(function(){
	ctx.clearRect(left_bound,0,right_bound - left_bound,canvas.height);
	
	for(let i = 0;i < ballList.length;i++){
		ballList[i].update();
		for(let j = 0;j < brickList.length;j++){
			if(brickList[j].checkCollision(ballList[i])){
				brickList.splice(j,1);
				j--;
			}
		}
		ballList[i].draw();
	}
	for(let i = 0;i < brickList.length;i++){
		brickList[i].draw();
	}
},1000 / 60);
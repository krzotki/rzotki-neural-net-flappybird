function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
function mutateByGaussian(value){
	var random = getRandomInt(0,100);
	if(random<mutationRate)
	{
		var gaussian = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
		var x = value * gaussian
		return x;
	}
	else
	{
		return value;
	}
    
}
document.getElementById("speed").onchange = function(){
	drawSpeed = parseInt(document.getElementById("speed").value);
	clearInterval(drawInterval);
	drawInterval = setInterval(draw,1000/drawSpeed);
}
var canvas = document.getElementById("canv");
canvas.width = screen.width-2;
var wallsDestroyed = 0;
var gravity =2;
var gapSize = 200;
var wallWidth = 100;
var wallSpeed = 3;
var birdies = [];
var deadBirdies = [];
var walls = [];
var drawSpeed = 100;
var spawnSpeed = 150;
var maxPopulation = 50;
var mutationRate = 10;
var generation = 0;
var drawInterval,spawnInterval=0;
var showGame = true;
var bestScore = 0;
var hiddenNodes =10;
var hiddenLayers = 1;
function draw()
{
	
	if(spawnInterval==0)
	{
		spawnObstacle();
		spawnInterval=spawnSpeed;
	}
	else spawnInterval--;
	
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	updateBirdies(ctx);
	updateWalls(ctx);
	updateDOM();
	if(birdies.length==0)
	{
		
		clearInterval(drawInterval);
		walls = [];
		spawnInterval=spawnSpeed
		nextGeneration();
		deadBirdies = [];
		drawInterval = setInterval(draw,1000/drawSpeed);
		spawnObstacle();
		generation++;
	}
}



function skipEvolution(score,gen)
{
	showGame = false;
	clearInterval(drawInterval);
	while((bestScore<score && birdies.length!=0) && (generation<gen  && birdies.length!=0 )) justCalculate();
	justCalculate(true);
}

function justCalculate(wannaDraw)
{
	
	if(spawnInterval==0)
	{
		spawnObstacle();
		spawnInterval=spawnSpeed;
	}
	else spawnInterval--;
	updateBirdies();
	updateWalls();
	if(birdies.length==0)
	{
		walls = [];
		spawnInterval=spawnSpeed;
		generation++;
		nextGeneration();
		deadBirdies = [];
		spawnObstacle();
	}
	if(wannaDraw)
	{
		
		showGame = true;
		drawInterval = setInterval(draw,1000/drawSpeed);
	}
}

function updateBirdies(ctx)
{

	for(var i in birdies)
	{
		birdies[i].update(ctx);
		if(birdies[0].score > bestScore)
		{
			 bestScore = birdies[0].score;
			 console.log("Best score: "+bestScore);
		}
	}
	for(var i in birdies)
	{
		if(birdies[i].collision())
		{
			
			birdies[i].calculateFitness();
			deadBirdies.push(birdies[i]);
			birdies.splice(i,1);
		}
	}
}
function updateWalls(ctx)
{
	for(var i in walls)
	{
		walls[i].update(ctx);
	}
	for(var i in walls)
	{
		if(walls[i].x+walls[i].width<0)
		{
			walls.splice(i,1);
			wallsDestroyed++;
		}
	}
}
function spawnObstacle()
{
	
	var random = getRandomInt(50,canvas.height-gapSize-50);
	walls.push(new Wall(0,random));
	walls.push(new Wall(random+gapSize,canvas.height-(random+gapSize)));
	for(var i in birdies)
	{
		birdies[i].points.push([canvas.width+wallWidth,random+gapSize/2]);
		
	}
}

function updateDOM()
{
	var display = document.getElementById("score");
	if(birdies[0])display.innerHTML = "Punkty: "+birdies[0].score;
	document.getElementById("generation").innerHTML ="Generacja: " + generation;
}


drawInterval = setInterval(draw,1000/drawSpeed);

function newPopulation()
{
	for(var i=0;i<maxPopulation;i++)
	{
		var nn = new NeuralNetwork(3,hiddenNodes,1,hiddenLayers);
		birdies.push(new Birdie(nn));
		
	}
}
newPopulation();

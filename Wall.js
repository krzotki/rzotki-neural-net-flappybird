class Wall
{
	constructor(y,height)
	{
		this.x = canvas.width;
		this.y = y;
		this.width = wallWidth;
		this.height = height;
	}
	update(ctx)
	{
		this.x-=wallSpeed;
		if(showGame)
		{
			ctx.fillStyle = "#007700";
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
	}
}
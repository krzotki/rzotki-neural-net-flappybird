class Matrix{
	
	constructor(rows,cols)
	{
		this.rows = rows;
		this.cols = cols;
		this.matrix = [];
		this.initiate();
	}
	initiate()
	{
		for(let x=0;x<this.rows;x++)
		{
			this.matrix[x] = [];
			for(let y=0;y<this.cols;y++)
			{
				this.matrix[x][y] =0;
			}
		}
	}
	randomize()
	{
		
		for(let x=0;x<this.rows;x++)
		{
			for(let y=0;y<this.cols;y++)
			{
				this.matrix[x][y] = Math.random()*2 -1;
				//values prepared for neural network
			}
		}
	}
	static add(input,n)
	{
		var temp = new Matrix(input.rows,input.cols);
		if(n instanceof Matrix)
		{
			if(n.rows != input.rows || n.cols != input.cols)
			{
				console.log("Dimensions must be the same");
			}
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] =  input.matrix[x][y] + n.matrix[x][y];
				}
			}
		}
		else
		{
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] = input.matrix[x][y] + n;
				}
			}
		}
		return temp;
	}
	static subtract(input,n)
	{
		var temp = new Matrix(input.rows,input.cols);
		if(n instanceof Matrix)
		{
			if(n.rows != input.rows || n.cols != input.cols)
			{
				console.log("Dimensions must be the same");
			}
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] =  input.matrix[x][y] - n.matrix[x][y];
				}
			}
		}
		else
		{
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] = input.matrix[x][y] + n;
				}
			}
		}
		return temp;
	}
	
	static EWMultiply(input,n)
	{
		var temp = new Matrix(input.rows,input.cols);
		if(n instanceof Matrix)
		{
			if(n.rows != input.rows || n.cols != input.cols)
			{
				console.log("Dimensions must be the same");
			}
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] =  input.matrix[x][y] * n.matrix[x][y];
				}
			}
		}
		return temp;
	}
	
	static multiply(input,n)
	{
		if(n instanceof Matrix)
		{
			if(input.cols !== n.rows)
			{
				console.log("Colums of A must match rows rows of B to create product");
				return undefined;
			} 
			//product of 2 matrices
			var temp = new Matrix(input.rows,n.cols);
			for(let x=0;x<temp.rows;x++)
			{
				for(let y =0;y<temp.cols;y++)
				{
					var sum =0;
					for(var g=0;g<input.cols;g++)
					{
						sum+= input.matrix[x][g] * n.matrix[g][y];
					}
					temp.matrix[x][y] = sum;
				}	
			}
		}
		else
		{
			var temp = new Matrix(input.rows,input.cols);
			for(let x=0;x<input.rows;x++)
			{
				for(let y=0;y<input.cols;y++)
				{
					temp.matrix[x][y] = input.matrix[x][y] * n;
				}
			}
		}
		return temp;
	}
	static transpose(input)
	{
		var temp = new Matrix(input.cols,input.rows);
		for(var i =0;i<temp.rows;i++)
		{
			for(var x=0;x<temp.cols;x++)
			{
				temp.matrix[i][x] = input.matrix[x][i];
			}
		}
		return temp;
	}
	static fromArray(arr)
	{
		let temp = new Matrix(arr.length,1);
		for(let i=0;i<arr.length;i++)
		{
			temp.matrix[i][0] = arr[i];
		}
		return temp;
		
	}
	static toArray(input)
	{
		let temp = [];
		for(var i in input.matrix)
		{
			for(var g in input.matrix[i])
			{
				let val = input.matrix[i][g];
			 	temp.push(input.matrix[i][g]);
			}
		}
		return temp;
	}
	//apply a function to every value in the matrix
	static map(input,func)
	{
		let temp = new Matrix(input.rows,input.cols);
		for(var i in input.matrix)
		{
			for(var g in input.matrix[i])
			{
				let val = input.matrix[i][g];
				temp.matrix[i][g] = func(val);
			}
		}
		return temp;
	}
}
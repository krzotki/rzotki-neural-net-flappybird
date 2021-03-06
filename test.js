function sigmoid(t) {
    return 1/(1+Math.exp(-t));
}
//fake derivative of sigmoid
function dsigmoid(x) {
    return x * (1-x);
}

class NeuralNetwork
{
	constructor(input_num,hidden_num,output_num,hiddenLayers_num)
	{
		this.input_num = input_num;
		this.hidden_num = hidden_num;
		this.output_num = output_num;
		this.hiddenLayers_num = hiddenLayers_num;
		this.AdditionalHiddenLayers = [];
		
		this.weightsToHidden = new Matrix(this.hidden_num,this.input_num);
		this.weightsToOutput = new Matrix(this.output_num,this.hidden_num);
		this.weightsToHidden.randomize();
		this.weightsToOutput.randomize();
		
		this.biasToHidden = new Matrix(this.hidden_num,1);
		this.biasToOutput = new Matrix(this.output_num,1);
		this.biasToHidden.randomize();
		this.biasToOutput.randomize();
		this.learningRate = 0.1;
		
		for(var i =1;i<hiddenLayers_num;i++)
		{
			var w = new Matrix(this.hidden_num,this.hidden_num);
			w.randomize();
			var b = new Matrix(this.hidden_num,1);
			b.randomize();
			this.AdditionalHiddenLayers.push(new HiddenLayer(w,b));
		}
		
	}
	
	guess(inputs)
	{
		let inputMatrix = Matrix.fromArray(inputs);
		let hiddenNodes = Matrix.multiply(this.weightsToHidden,inputMatrix);
		hiddenNodes = Matrix.add(hiddenNodes,this.biasToHidden);
		hiddenNodes = Matrix.map(hiddenNodes,sigmoid);
		var lastHidden = hiddenNodes;
		if(this.hiddenLayers_num>1)
		{
			let addHiddenNodes = Matrix.multiply(this.AdditionalHiddenLayers[0].weights,hiddenNodes);
			addHiddenNodes = Matrix.add(addHiddenNodes,this.AdditionalHiddenLayers[0].biases);
			addHiddenNodes = Matrix.map(addHiddenNodes,sigmoid);
			lastHidden = addHiddenNodes;
			for(var i =1;i<this.AdditionalHiddenLayers.length;i++)
			{
				var temp = Matrix.multiply(this.AdditionalHiddenLayers[i].weights,lastHidden);
				temp = Matrix.add(temp,this.AdditionalHiddenLayers[i].biases);
				temp = Matrix.map(temp,sigmoid);
				lastHidden = temp;
			}
		}
		
		
		let outputNodes = Matrix.multiply(this.weightsToOutput,lastHidden);
		outputNodes = Matrix.add(outputNodes,this.biasToOutput);
		outputNodes = Matrix.map(outputNodes,sigmoid);
		
		let guesses = outputNodes;
		return Matrix.toArray(guesses);
	}
	
	train(inputs,answer)
	{
		let inputMatrix = Matrix.fromArray(inputs);
		let hiddenNodes = Matrix.multiply(this.weightsToHidden,inputMatrix);
		hiddenNodes = Matrix.add(hiddenNodes,this.biasToHidden);
		hiddenNodes = Matrix.map(hiddenNodes,sigmoid);
		var lastHidden = hiddenNodes;
		if(this.hiddenLayers_num>1)
		{
			let addHiddenNodes = Matrix.multiply(this.AdditionalHiddenLayers[0].weights,hiddenNodes);
			addHiddenNodes = Matrix.add(addHiddenNodes,this.AdditionalHiddenLayers[0].biases);
			addHiddenNodes = Matrix.map(addHiddenNodes,sigmoid);
			lastHidden = addHiddenNodes;
			for(var i =1;i<this.AdditionalHiddenLayers.length;i++)
			{
				var temp = Matrix.multiply(this.AdditionalHiddenLayers[i].weights,lastHidden);
				temp = Matrix.add(temp,this.AdditionalHiddenLayers[i].biases);
				temp = Matrix.map(temp,sigmoid);
				lastHidden = temp;
			}
		}
		hiddenNodes = lastHidden;
		
		let outputNodes = Matrix.multiply(this.weightsToOutput,lastHidden);
		outputNodes = Matrix.add(outputNodes,this.biasToOutput);
		outputNodes = Matrix.map(outputNodes,sigmoid);
		
		let guesses = outputNodes;
		let answers = Matrix.fromArray(answer);
		let output_errors = Matrix.subtract(answers,guesses);
		
		let tWeightsToOutput = Matrix.transpose(this.weightsToOutput);
		let hiddenErrors = Matrix.multiply(tWeightsToOutput,output_errors);

		////adjust the weights which are heading to the outputs layer
		let gradients = Matrix.map(outputNodes,dsigmoid);
		
		//not a product of two matrices but just element-wise multiplication (hadamard product) the other multiplication is weighted sum
		gradients = Matrix.EWMultiply(gradients,output_errors);
		gradients = Matrix.multiply(gradients,this.learningRate);
		
		let tHidden = Matrix.transpose(hiddenNodes);
		let weightsToOutputDeltas = Matrix.multiply(gradients,tHidden);
		
		//weights
		this.weightsToOutput = Matrix.add(this.weightsToOutput,weightsToOutputDeltas);
		
		//biases (delta for bias is just the gradient)
		this.biasToOutput = Matrix.add(this.biasToOutput,gradients);
		
		for(var n=AdditionalHiddenLayers.length-2;n>0;n--)
		{
			//adjust the weights which are heading to the hidden layer
			let hiddenGradients = Matrix.map(hiddenNodes,dsigmoid);
			
			hiddenGradients = Matrix.EWMultiply(hiddenGradients,hiddenErrors);
			hiddenGradients = Matrix.multiply(hiddenGradients,this.learningRate);
			
			let tPrev = Matrix.transpose(AdditionalHiddenLayers[n-1]);
			let weightsToHiddenDeltas = Matrix.multiply(hiddenGradients,tPrev);
			
			AdditionalHiddenLayers[n].weights = Matrix.add(AdditionalHiddenLayers[n].weights,weightsToHiddenDeltas);
			
			AdditionalHiddenLayers[n].biases = Matrix.add(AdditionalHiddenLayers[n].biases,hiddenGradients);
			
			hiddenNodes = AdditionalHiddenLayers[n];
		}
		
		
		
		let tInput = Matrix.transpose(inputMatrix);
		let weightsToHiddenDeltas = Matrix.multiply(hiddenGradients,tInput);
		
		//weights
		this.weightsToHidden = Matrix.add(this.weightsToHidden,weightsToHiddenDeltas);
		
		//biases
		this.biasToHidden = Matrix.add(this.biasToHidden,hiddenGradients);
		
	}
	mutate(func) 
	{
	    this.weightsToHidden = Matrix.map(this.weightsToHidden,func);
	    this.weightsToOutput = Matrix.map(this.weightsToOutput,func);
	    this.biasToHidden = Matrix.map(this.biasToHidden,func);
	    this.biasToOutput = Matrix.map(this.biasToOutput,func);
		for(var i in this.AdditionalHiddenLayers)
		{
			this.AdditionalHiddenLayers[i].weights = Matrix.map(this.AdditionalHiddenLayers[i].weights,func);
			this.AdditionalHiddenLayers[i].biases = Matrix.map(this.AdditionalHiddenLayers[i].biases,func);
			
		}
		
 	}
}	

class HiddenLayer
{
	constructor(weights,biases)
	{
		this.weights = weights;
		this.biases = biases;
	}
}
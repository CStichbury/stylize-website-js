// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// const ort = require('onnxruntime-web');
async function getImageTensorFromPath(path, dims = [1, 3, 256, 256]) {
    // 1. load the image  
    var image = await loadImageFromPath(path, dims[2], dims[3]);
    // 2. convert to tensor
    var imageTensor = imageDataToTensor(image, dims);
    // 3. return the tensor
    return imageTensor;
  }
  
  async function loadImageFromPath(path, width = 224, height= 224) {
    // Use Jimp to load the image and resize it.
    var imageData = await Jimp.read(path)
        .then((imageBuffer) => {
      return imageBuffer.resize(width, height);
    });
  
    return imageData;
  }
  
  async function imageDataToTensor(image, dims) {
    // 1. Get buffer data from image and create R, G, and B arrays.
    var imageBufferData = image.bitmap.data;
    const [redArray, greenArray, blueArray] = new Array(
        new Array(),
        new Array(), 
        new Array()
     );
  
    // 2. Loop through the image buffer and extract the R, G, and B channels
    for (let i = 0; i < imageBufferData.length; i += 4) {
        redArray.push(imageBufferData[i]);
        greenArray.push(imageBufferData[i + 1]);
        blueArray.push(imageBufferData[i + 2]);
        // skip data[i + 3] to filter out the alpha channel
    }

    // 3. Concatenate RGB to transpose [224, 224, 3] -> [3, 224, 224] to a number array
    const transposedData = redArray.concat(greenArray).concat(blueArray);

    // 4. convert to float32
    let i, l = transposedData.length; // length, we need this for the loop
    // create the Float32Array size 3 * 224 * 224 for these dimensions output
    const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
    for (i = 0; i < l; i++) {
        float32Data[i] = transposedData[i] / 255.0; // convert to float
    }
    // 5. create the tensor object from onnxruntime-web.
    const inputTensor = new ort.Tensor("float32", float32Data, dims);
    return inputTensor;
}


const IMAGE_SIZE = 512

async function getImage(id) {
    const img = tf.cast(tf.browser.fromPixels(
        document.getElementById(id)
    ), 'float32');

    const offset = tf.scalar(255.0);
    // Normalize the image from [0, 255] to [0, 1].
    const normalized = img.div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    const ncwh = tf.transpose(batched, [0, 3, 1, 2]);

    return ncwh
}


// use an async context to call onnxruntime functions.
async function main() {
    try {
        const content = await getImage('content')
        const style = await getImage('style')
        console.log(content, style);
        console.log('Images loaded successfully!');
        
        const encoder = await tf.loadGraphModel('static/tfjs/encoder/model.json');
        const decoder = await tf.loadGraphModel('static/tfjs/decoder/model.json');
        const trfm = await tf.loadGraphModel('static/tfjs/transform/model.json');
        

        console.log('Models loaded successfully!');
        console.log(encoder, decoder, trfm);
        await encoder.predict({'image':tf.zeros([1, 3, IMAGE_SIZE, IMAGE_SIZE])});
        
        let iters = 2; 
        for (let iter = 0; iter < iters; iter++) {
            console.log(`Iter: ${iter}...`);
            let {out5_1:c5_1, out4_1:c4_1} = await encoder.run({'image':content})
            let {out5_1:s5_1, out4_1:s4_1} = await encoder.run({'image':style})
            let {c_tfm} = await trfm.run({c4_1,s4_1,c5_1,s5_1})
            var {c_stylized} = await decoder.run({c_tfm})
            
            c4_1 = c_stylized
            s4_1 = style
            c4_1 = c4_1
        }
        console.log('done');
        c_stylized

        // const model = tf.sequential();
        // model.add(tf.layers.dense({units: 1000, activation: 'relu', inputShape: [10]}));
        // model.add(tf.layers.dense({units: 1000, activation: 'relu',}));
        // model.add(tf.layers.dense({units: 1000, activation: 'relu',}));
        // model.add(tf.layers.dense({units: 1000, activation: 'relu',}));
        // model.add(tf.layers.dense({units: 1000, activation: 'relu'}));
        // model.add(tf.layers.dense({units: 1, activation: 'linear'}));
        // model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

        // const xs = tf.randomNormal([100, 10]);
        // const ys = tf.randomNormal([100, 1]);

        // model.fit(xs, ys, {
        // epochs: 100,
        // callbacks: {
        //     onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
        // }
        // });
        return
        // create a new session and load the specific model.
        //
        // the model in this example contains a single MatMul node
        // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
        // it has 1 output: 'c'(float32, 3x3)
        console.log('content path is ', document.getElementById('content').src);
        // const content = await getImageTensorFromPath(
        //     document.getElementById('content').src,
        // );
        // const style = await getImageTensorFromPath(
        //     document.getElementById('style').src,
        // );
        console.log('content and style images loaded successfully');
  
        // const session = await ort.InferenceSession.create('./model.onnx');
        // const encoder = await ort.InferenceSession.create('static/encoder.onnx')
        // const decoder = await ort.InferenceSession.create('static/decoder.onnx')
        // const trfm = await ort.InferenceSession.create('static/transform.onnx')
        console.log('model loaded successfully');

        // // prepare inputs. a tensor need its corresponding TypedArray as data
        // // const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        // // const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
        // // const tensorA = new ort.Tensor('float32', dataA, [3, 4]);
        // // const tensorB = new ort.Tensor('float32', dataB, [4, 3]);
        
        // let content = new ort.Tensor('float32', 
        //     new Float32Array(3 * 512 * 512),
        //      [1, 3, 512,512]);
        // let style = new ort.Tensor('float32', 
        //     new Float32Array(3 * 512 * 512),
        //      [1, 3, 512,512]);
             
        // let iters = 2; 
        // for (let iter = 0; iter < iters; iter++) {
        //     console.log(`Iter: ${iter}...`);
        //     let {out5_1:c5_1, out4_1:c4_1} = await encoder.run({'image':content})
        //     let {out5_1:s5_1, out4_1:s4_1} = await encoder.run({'image':style})
        //     let {c_tfm} = await trfm.run({c4_1,s4_1,c5_1,s5_1})
        //     var {c_stylized} = await decoder.run({c_tfm})
            
        //     c4_1 = c_stylized
        //     s4_1 = style
        //     c4_1 = c4_1
        // }
        // console.log('done');
        // c_stylized
            

        // console.log(c_stylized);
        // prepare feeds. use model input names as keys.
        // const feeds = { a: tensorA, b: tensorB };

        // // feed inputs and run
        // const results = await session.run(feeds);

        // // read from results
        // const dataC = results.c.data;
        // console.log(`data of result tensor 'c': ${dataC}`);



        // create a new session and load the specific model.
        //
        // the model in this example contains a single MatMul node
        // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
        // it has 1 output: 'c'(float32, 3x3)
        // const session = await ort.InferenceSession.create('./model.onnx');

        // prepare inputs. a tensor need its corresponding TypedArray as data
        // const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        // const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
        // const tensorA = new ort.Tensor('float32', dataA, [3, 4]);
        // const tensorB = new ort.Tensor('float32', dataB, [4, 3]);

        // prepare feeds. use model input names as keys.
        // const feeds = { a: tensorA, b: tensorB };

        // feed inputs and run
        // const results = await session.run(feeds);

        // read from results
        // const dataC = results.c.data;
        // document.write(`data of result tensor 'c': ${dataC}`);
    } catch (e) {
        // document.write(`failed to inference ONNX model: ${e}.`);
        console.error(e);
    }
}

main();

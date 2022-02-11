const IMAGE_SIZE = 512

async function getImage(id) {
    let img = document.getElementById(id)
    
    img = tf.cast(tf.browser.fromPixels(img), 'float32');

    const offset = tf.scalar(255.0);
    // Normalize the image from [0, 255] to [0, 1].
    img = img.div(offset).reshape([IMAGE_SIZE, IMAGE_SIZE, 3]);

    // const ncwh = tf.transpose(batched, [0, 3, 1, 2]);

    return img
}


// use an async context to call onnxruntime functions.
async function main() {
    try {
        // console.log(tf.getBackend());
        console.log(tf.getBackend());
        const content = await getImage('content')
        const style = await getImage('style')
        const iters = tf.scalar(2,dtype='int32')
        console.log(content, style);
        console.log('Images loaded successfully!');
        
        // const encoder = await tf.loadGraphModel('static/tfjs/encoder/model.json');
        // const decoder = await tf.loadGraphModel('static/tfjs/decoder/model.json');
        // const trfm = await tf.loadGraphModel('static/tfjs/transform/model.json');
        const model = await tf.loadGraphModel('static/model/model.json');

        console.log('Model loaded successfully!');
        
        console.log(model);
        // return
        // console.log('Starting model warmup...');

        // await model.executeAsync(
        //     {
        //         'content':tf.randomUniform([IMAGE_SIZE, IMAGE_SIZE, 3], dtype ='float32'),
        //         'style':tf.randomUniform([IMAGE_SIZE, IMAGE_SIZE, 3], dtype ='float32'),
        //         'iters':tf.scalar(2,'int32')
        //     },
        //     ["result"]
        // ); 
        // console.log('Model warmup successfull!');

        console.log('Doing stylization...');
        const result = await model.executeAsync(
            {content,style,iters},
            ["result"]
        ); 
        console.log(result);
        tf.browser.toPixels(result, document.getElementById('result'));
        
        return

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
(async() => {
   await main();
})()


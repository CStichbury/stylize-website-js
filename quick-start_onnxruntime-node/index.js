// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const ort = require('onnxruntime-node');
const tf = require('@tensorflow/tfjs-node');

// use an async context to call onnxruntime functions.
async function main() {
    try {
        // create a new session and load the specific model.
        //
        // the model in this example contains a single MatMul node
        // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
        // it has 1 output: 'c'(float32, 3x3)
        const session = await ort.InferenceSession.create('./model.onnx');
        const encoder = await ort.InferenceSession.create('../encoder.onnx')
        const decoder = await ort.InferenceSession.create('../decoder.onnx')
        const trfm = await ort.InferenceSession.create('../transform.onnx')
        
        // prepare inputs. a tensor need its corresponding TypedArray as data
        // const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        // const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
        // const tensorA = new ort.Tensor('float32', dataA, [3, 4]);
        // const tensorB = new ort.Tensor('float32', dataB, [4, 3]);

        let content = new ort.Tensor('float32', 
            new Float32Array(3 * 512 * 512),
             [1, 3, 512,512]);
        let style = new ort.Tensor('float32', 
            new Float32Array(3 * 512 * 512),
             [1, 3, 512,512]);
        let iters = 2; 
        for (let iter = 0; iter < iters; iter++) {
            let {out5_1:c5_1, out4_1:c4_1} = await encoder.run({'image':content})
            let {out5_1:s5_1, out4_1:s4_1} = await encoder.run({'image':style})
            let {c_tfm} = await trfm.run({c4_1,s4_1,c5_1,s5_1})
            var {c_stylized} = await decoder.run({c_tfm})
            
            c4_1 = c_stylized
            s4_1 = style
            c4_1 = c4_1
        }
            

        console.log(c_stylized);
        // prepare feeds. use model input names as keys.
        // const feeds = { a: tensorA, b: tensorB };

        // // feed inputs and run
        // const results = await session.run(feeds);

        // // read from results
        // const dataC = results.c.data;
        // console.log(`data of result tensor 'c': ${dataC}`);

    } catch (e) {
        console.error(e);
    }
}

main();

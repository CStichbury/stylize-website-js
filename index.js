const IMAGE_SIZE = 512

async function getImage(id) {
    let img = document.getElementById(id)
    
    img = tf.cast(tf.browser.fromPixels(img), 'float32');

    const offset = tf.scalar(255.0);
    // Normalize the image from [0, 255] to [0, 1].
    img = img.div(offset)//.reshape([IMAGE_SIZE, IMAGE_SIZE, 3]);

    // const ncwh = tf.transpose(batched, [0, 3, 1, 2]);

    return img
}


// use an async context to call onnxruntime functions.
async function stylize() {
    try {
        // console.log(tf.getBackend());
        console.log(tf.getBackend());
        const content = await getImage('content')
        const style = await getImage('style')
        const iters = tf.scalar(1,dtype='int32')
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
        
    } catch (e) {
        // document.write(`failed to inference ONNX model: ${e}.`);
        console.error(e);
    }


}

styleInp.onchange = evt => {
    console.log(evt);
    const [file] = styleInp.files
    if (file) {
      document.getElementById('style').src = URL.createObjectURL(file)
    }
}

contentInp.onchange = evt => {
    const [file] = contentInp.files
    if (file) {
      content.src = URL.createObjectURL(file)
    }
}

function showDiv() {
    document.getElementById('Login').style.display = "none";
    document.getElementById('loadingGif').style.display = "block";
    setTimeout(function() {
      document.getElementById('loadingGif').style.display = "none";
      document.getElementById('showme').style.display = "block";
    },2000);
}

async function beginStylization() {
    let btn = document.getElementById("stylizeBtn")
    let btnText = btn.value
    btn.value = "Wait a moment. Stylizing..."
    document.getElementById("loadingScreen").style.display = "block";
    await stylize()
    document.getElementById("loadingScreen").style.display = "none";
    btn.value = btnText
}
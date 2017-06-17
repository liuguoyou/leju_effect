

// Vertex shader program
var VSHADER_SOURCE = v_shader_main;


// Fragment shader program
var FSHADER_SOURCE = f_shader_header    + 
                     f_uniform_list     +
                     f_varying_list     +
                     f_func_list        +
                     f_func_main;
    

var gl;
var n;
var texture;
var textureMap;
var textureColorBalance;
var u_SampleImage;
var u_SamplerCurve;
var u_SamplerColorBalance;
var u_Brightness;
var u_Contrast;
var u_Hue;
var u_Saturation;
var u_Lightness;
var u_InputMinStage;
var u_InputMaxStage;
var u_Gamma;
var u_OutputMinStage;
var u_OutputMaxStage;
var u_Sharpen;
var u_PreserveLuminosity
var u_InvSize;
var u_SharpenCov;

function onBrightnessChanged(value)
{
    document.getElementById("brightness").innerHTML = value;
    gl.uniform1f(u_Brightness, value);
    updateCanvas();
}

function onContrastChanged(value)
{
    document.getElementById("contrast").innerHTML = value;
    gl.uniform1f(u_Contrast, value);
    updateCanvas();
}

function onHueChanged(value)
{
    document.getElementById("hue").innerHTML = value;
    gl.uniform1f(u_Hue, value);
    updateCanvas();
}

function onSaturationChanged(value)
{
    document.getElementById("saturation").innerHTML = value;
    gl.uniform1f(u_Saturation, value);
    updateCanvas();
}

function onLightnessChanged(value)
{
    document.getElementById("lightness").innerHTML = value;
    gl.uniform1f(u_Lightness, value);
    updateCanvas();
}

function onInputStageMinChanged(value)
{
    document.getElementById("inputMinStage").innerHTML = value;
    gl.uniform1f(u_InputMinStage, value);
    updateCanvas();
}

function onInputStageMaxChanged(value)
{
    document.getElementById("inputMaxStage").innerHTML = value;
    gl.uniform1f(u_InputMaxStage, value);
    updateCanvas();
}

function onGammaChanged(value)
{
    document.getElementById("gamma").innerHTML = value;
    gl.uniform1f(u_Gamma, value);
    updateCanvas();
}

function onOutputStageMinChanged(value)
{
    document.getElementById("outputMinStage").innerHTML = value;
    gl.uniform1f(u_OutputMinStage, value);
    updateCanvas();
}

function onOutputStageMaxChanged(value)
{
    document.getElementById("outputMaxStage").innerHTML = value;
    gl.uniform1f(u_OutputMaxStage, value);
    updateCanvas();
}
    
function onSharpenChecked(value)
{
    gl.uniform1i(u_Sharpen, value ? 1: 0);
    updateCanvas();
}

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Set the vertex information
    initVertexBuffers();
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Set texture
    if (!initTextures()) {
        console.log('Failed to intialize the texture.');
        return;
    }
}

function initVertexBuffers() {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -1.0,  1.0,   0.0, 1.0,
    -1.0, -1.0,   0.0, 0.0,
     1.0,  1.0,   1.0, 1.0,
     1.0, -1.0,   1.0, 0.0,
  ]);
  n = 4; // The number of vertices

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
}

function initTextures() {
  texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  textureMap = gl.createTexture();   // Create a texture object
  if (!textureMap) {
    console.log('Failed to create the texture object');
    return false;
  }
  
  textureColorBalance = gl.createTexture();   // Create a texture object
  if (!textureColorBalance) {
    console.log('Failed to create the texture object');
    return false;
  }
  // Get the storage location of u_SampleImage
  u_SampleImage = gl.getUniformLocation(gl.program, 'u_SampleImage');
  if (!u_SampleImage) {
    console.log('Failed to get the storage location of u_SampleImage');
    return false;
  }

  u_SamplerCurve = gl.getUniformLocation(gl.program, 'u_SamplerCurve');
  if (!u_SamplerCurve) {
    console.log('Failed to get the storage location of u_SamplerCurve');
    return false;
  }
  
  u_SamplerColorBalance = gl.getUniformLocation(gl.program, 'u_SamplerColorBalance');
  if (!u_SamplerColorBalance) {
    console.log('Failed to get the storage location of u_SamplerColorBalance');
    return false;
  }
  
  u_Brightness = gl.getUniformLocation(gl.program, 'u_Brightness');
  if (!u_Brightness) {
    console.log('Failed to get the storage location of u_Brightness');
    return false;
  }
  
  u_Contrast = gl.getUniformLocation(gl.program, 'u_Contrast');
  if (!u_Contrast) {
    console.log('Failed to get the storage location of u_Contrast');
    return false;
  }

  u_Hue = gl.getUniformLocation(gl.program, 'u_Hue');
  if (!u_Hue) {
    console.log('Failed to get the storage location of u_Hue');
    return false;
  }
  
  u_Saturation = gl.getUniformLocation(gl.program, 'u_Saturation');
  if (!u_Saturation) {
    console.log('Failed to get the storage location of u_Saturation');
    return false;
  }
  
  u_Lightness = gl.getUniformLocation(gl.program, 'u_Lightness');
  if (!u_Lightness) {
    console.log('Failed to get the storage location of u_Lightness');
    return false;
  }

  u_Sharpen = gl.getUniformLocation(gl.program, 'u_Sharpen');
  if (!u_Sharpen) {
    console.log('Failed to get the storage location of u_Sharpen');
    return false;
  }
  
  u_PreserveLuminosity = gl.getUniformLocation(gl.program, 'u_PreserveLuminosity');
  if (!u_PreserveLuminosity) {
    console.log('Failed to get the storage location of u_PreserveLuminosity');
    return false;
  }
  
  u_InvSize = gl.getUniformLocation(gl.program, 'u_InvSize');
  if (!u_InvSize) {
    console.log('Failed to get the storage location of u_InvSize');
    return false;
  }
  
  u_SharpenCov = gl.getUniformLocation(gl.program, 'u_SharpenCov');
  if (!u_SharpenCov) {
    console.log('Failed to get the storage location of u_SharpenCov');
    return false;
  }

  u_InputMinStage = gl.getUniformLocation(gl.program, 'u_InputMinStage');
  if (!u_InputMinStage) {
    console.log('Failed to get the storage location of u_InputMinStage');
    return false;
  }

  u_InputMaxStage = gl.getUniformLocation(gl.program, 'u_InputMaxStage');
  if (!u_InputMaxStage) {
    console.log('Failed to get the storage location of u_InputMaxStage');
    return false;
  }

  u_Gamma = gl.getUniformLocation(gl.program, 'u_Gamma');
  if (!u_Gamma) {
    console.log('Failed to get the storage location of u_Gamma');
    return false;
  }

  u_OutputMinStage = gl.getUniformLocation(gl.program, 'u_OutputMinStage');
  if (!u_OutputMinStage) {
    console.log('Failed to get the storage location of u_OutputMinStage');
    return false;
  }

  u_OutputMaxStage = gl.getUniformLocation(gl.program, 'u_OutputMaxStage');
  if (!u_OutputMaxStage) {
    console.log('Failed to get the storage location of u_OutputMaxStage');
    return false;
  }  
  
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ 
  
                    //Do the preprocess work
                    var canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
                    
                    var pixelData = canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
                    // do the image analysis

                    var points = [];
                    points[0] = {x: 0, y: 0};
                    points[1] = {x: 125, y: 125};
                    points[2] = {x: 255, y: 255};
                    
                    var res = createCurve(points);
                    //console.log(res);
                    
                    
                    var res2 = colorBalanceAdjust(0, 0, 0, BALANCE_MODE.MIDTONES);
                    
                    
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
                    // Enable texture unit0
                    gl.activeTexture(gl.TEXTURE0);
                    // Bind the texture object to the target
                    gl.bindTexture(gl.TEXTURE_2D, texture);

                    // Set the texture parameters
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    // Set the texture image
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                    
                    
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
                    // Enable texture unit0
                    gl.activeTexture(gl.TEXTURE1);
                    // Bind the texture object to the target
                    gl.bindTexture(gl.TEXTURE_2D, textureMap);

                    // Set the texture parameters
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    // Set the texture image
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 256, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, res);
                    
                    
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
                    // Enable texture unit0
                    gl.activeTexture(gl.TEXTURE2);
                    // Bind the texture object to the target
                    gl.bindTexture(gl.TEXTURE_2D, textureColorBalance);

                    // Set the texture parameters
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    // Set the texture image
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 256, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, res2);
                    
                    
                    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
                      
                    // Set the texture unit 0 to the sampler
                    gl.uniform1i(u_SampleImage, 0);
                    gl.uniform1i(u_SamplerCurve, 1);
                    gl.uniform1i(u_SamplerColorBalance, 2);
                    gl.uniform1f(u_Brightness, 0);
                    gl.uniform1f(u_Contrast, 0);
                    gl.uniform1f(u_Hue, 0);
                    gl.uniform1f(u_Saturation, 0);
                    gl.uniform1f(u_Lightness, 0);
                    gl.uniform1i(u_Sharpen, 0);
                    gl.uniform1i(u_PreserveLuminosity, 1);
                    gl.uniform2f(u_InvSize, 1 / image.width, 1/ image.height);
                    gl.uniform1fv(u_SharpenCov, [-1, -4, -7, -4, -1,   
                                                -4, -16, -26, -16, -4,   
                                                -7, -26, 505, -26, -7,  
                                                -4, -16, -26, -16, -4,   
                                                -1, -4, -7, -4, -1 ]);
                                                
                    gl.uniform1f(u_InputMinStage, 0);
                    gl.uniform1f(u_InputMaxStage, 255);
                    gl.uniform1f(u_Gamma, 1);
                    gl.uniform1f(u_OutputMinStage, 0);
                    gl.uniform1f(u_OutputMaxStage, 255);
                    
                    updateCanvas(); 
                 };
  // Tell the browser to load an image
  image.src = '../resources/view.jpg';

  return true;
}

function updateCanvas() {
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


function spline(x, y, n, t, m)
{
    var dy = [];
    var ddy = [];
    var z = [];
    for(var i = 0; i < n; i++) {
        dy[i] = 0;
        ddy[i] = 0;
    }
    dy[0] = -0.5;
    
    var h1;
    var s = [];
    var h0 = x[1] - x[0];
    
    
    s[0] = 3.0 * (y[1] - y[0]) / (2.0 * h0) - ddy[0] * h0 / 4.0;
    for( var j = 1; j <= n - 2; ++j )
    {
        h1 = x[j + 1] - x[j];
        var alpha = h0 / (h0 + h1);
        var beta = (1.0 - alpha) * (y[j] - y[j - 1]) / h0;
        beta = 3.0 * (beta + alpha * ( y[j + 1] - y[j] ) / h1);
        dy[j] = -alpha / (2.0 + (1.0 - alpha) * dy[j - 1]);
        s[j] = (beta - (1.0 - alpha) * s[j - 1]);
        s[j] = s[j] / (2.0 + (1.0 - alpha) * dy[j - 1]);
        h0 = h1;
    }
    dy[n-1] = (3.0*(y[n-1] - y[n-2]) / h1 + ddy[n-1] * h1/2.0 - s[n-2]) / (2.0 + dy[n-2]);

    for( var j = n - 2; j >= 0; --j )
    {
        dy[j] = dy[j] * dy[j + 1] + s[j];
    }

    for( var j = 0; j <= n - 2; ++j )
    {
        s[j] = x[j + 1] - x[j];
    }

    for( var j = 0; j <= n - 2; ++j )
    {
        h1 = s[j] * s[j];
        ddy[j] = 6.0 * (y[j+1] - y[j]) / h1 - 2.0 * (2.0 * dy[j] + dy[j+1]) / s[j];
    }

    h1 = s[n-2] * s[n-2];
    ddy[n-1] = 6.0 * (y[n-2] - y[n-1]) / h1 + 2.0 * (2.0 * dy[n-1] + dy[n-2]) / s[n-2];
    var g = 0.0;
    for(var i=0; i<=n-2; i++)
    {
        h1 = 0.5 * s[i] * (y[i] + y[i+1]);
        h1 = h1 - s[i] * s[i] * s[i] * (ddy[i] + ddy[i+1]) / 24.0;
        g = g + h1;
    }

    for(var j=0; j<=m-1; j++)
    {
        var i;
        if( t[j] >= x[n-1] ) {
            i = n - 2;
        } else {
            i = 0;
            while(t[j] > x[i+1]) {
                i = i + 1;
            }
        }
        h1 = (x[i+1] - t[j]) / s[i];
        h0 = h1 * h1;
        z[j] = (3.0 * h0 - 2.0 * h0 * h1) * y[i];
        z[j] = z[j] + s[i] * (h0 - h0 * h1) * dy[i];
        h1 = (t[j] - x[i]) / s[i];
        h0 = h1 * h1;
        z[j] = z[j] + (3.0 * h0 - 2.0 * h0 * h1) * y[i+1];
        z[j] = z[j] - s[i] * (h0 - h0 * h1) * dy[i+1];
    }
    return z;
}

function clampColor(value) {
    return Math.max(Math.min(value, 255), 0);
}

function createCurve(points) {
    for (var i = 0; i < points.length; i++) {
        points[i].x = Math.floor(points[i].x);
        points[i].y = Math.floor(points[i].y);
    }
    
    //if count of control points is less than 2, return linear output
    var colorMap = new Uint8Array(256 * 3);
    if (points.length < 2) {
        for (var i = 0; i < 256; i++) {
            colorMap[i * 3] = i;
            colorMap[i * 3 + 1] = i;
            colorMap[i * 3 + 2] = i;
        }
        return colorMap;
    }

    //if count of control points is 2, return linear output
    if (points.length === 2 ) {
        var delta_y = 0;
        if (points[1].x != points[0].x) {
            delta_y = (points[1].y - points[0].y) * 1.0 / (points[1].x - points[0].x);
        }

        //create output
        for (var i = 0; i < 256; ++i ) {
            if ( i < points[0].x ) {
                colorMap[i * 3] = points[0].y;
                colorMap[i * 3 + 1] = points[0].y;
                colorMap[i * 3 + 2] = points[0].y;
            } else if ( i >= points[0].x && i < points[1].x ) {
                colorMap[i * 3] = clampColor(points[0].y + delta_y * (i - points[0].x));
                colorMap[i * 3 + 1] = clampColor(points[0].y + delta_y * (i - points[0].x));
                colorMap[i * 3 + 2] = clampColor(points[0].y + delta_y * (i - points[0].x));
            } else {
                colorMap[i * 3] = points[1].y;
                colorMap[i * 3 + 1] = points[1].y;
                colorMap[i * 3 + 2] = points[1].y;
            }
        }
        return colorMap;
    }

    var x = [];
    var y = [];
    var startPoint, endPoint;
    
    for (var i = 0; i < points.length; i++) {
        if ( i == 0 ) {
            start_point = points[i];
        }
        x[i] = points[i].x - start_point.x;
        y[i] = points[i].y;
        endPoint = points[i];
    }


    //if start_point or endPoint is invalid
    if (start_point == points[points.length - 1] || start_point == endPoint) {
        for (var i = 0; i < 256; ++i ) {
            colorMap[i * 3] = i;
            colorMap[i * 3 + 1] = i;
            colorMap[i * 3 + 2] = i;
        }
        return colorMap;
    }
    
    var m = endPoint.x - start_point.x;
    var t = [];  //array of x-coordinate of output points
    var z = [];  //array of y-coordinate of output points
    //initialize array of x-coordinate
    for ( var i = 0; i< m; ++i ) {
        t[i] = i;
    }
    
    z = spline(x, y, points.length, t, m);
    
    //create output
    for ( var i = 0; i < 256; ++i ) {
        if ( i < start_point.x ) {
            colorMap[i * 3] = start_point.y;
            colorMap[i * 3 + 1] = start_point.y;
            colorMap[i * 3 + 2] = start_point.y;
        } else if ( i >= start_point.x && i < endPoint.x ) {
            colorMap[i * 3] = clampColor(z[i - start_point.x]);
            colorMap[i * 3 + 1] = clampColor(z[i - start_point.x]);
            colorMap[i * 3 + 2] = clampColor(z[i - start_point.x]);
        } else {
            colorMap[i * 3] = endPoint.y;
            colorMap[i * 3 + 1] = endPoint.y;
            colorMap[i * 3 + 2] = endPoint.y;
        }
    }

    return colorMap;
}

var BALANCE_MODE = {
    SHADOWS: 0,
    MIDTONES: 1,
    HIGHLIGHTS: 2
}

function colorBalanceAdjust(cyan, magenta, yellow, mode)
{
    //Make sure cyan, magenta, yellow are between -100 to 100
    
    var cyan_red = [0, 0, 0];
    var magenta_green = [0, 0, 0];
    var yellow_blue = [0, 0, 0];
    
    cyan_red[mode] = cyan;
    magenta_green[mode] = magenta;
    yellow_blue[mode] = yellow;
    
    var highlights_add = new Float32Array(256); 
    var midtones_add   = new Float32Array(256); 
    var shadows_add    = new Float32Array(256); 
    var highlights_sub = new Float32Array(256); 
    var midtones_sub   = new Float32Array(256); 
    var shadows_sub    = new Float32Array(256); 

    //initTransferArray();
    for (var i = 0; i < 256; i++)
    {
        highlights_add[i] = shadows_sub[255 - i] = (1.075 - 1 / (i / 16.0 + 1));
        var v = ((i - 127.0) / 127.0) * ((i - 127.0) / 127.0);
        midtones_add[i]   = midtones_sub[i]      = 0.667 * (1 - v);
        shadows_add[i]    = highlights_sub[i]    = 0.667 * (1 - v);
    }
    
    //create the table
    var cyan_red_transfer = [];
    var magenta_green_transfer = [];
    var yellow_blue_transfer = [];
    
    var r_lookup = new Uint8Array(256);
    var g_lookup = new Uint8Array(256);
    var b_lookup = new Uint8Array(256);
    var red, green, blue;
    
    cyan_red_transfer[BALANCE_MODE.SHADOWS]         = (cyan_red[BALANCE_MODE.SHADOWS] > 0) ? shadows_add : shadows_sub;
    cyan_red_transfer[BALANCE_MODE.MIDTONES]        = (cyan_red[BALANCE_MODE.MIDTONES] > 0) ? midtones_add : midtones_sub;
    cyan_red_transfer[BALANCE_MODE.HIGHLIGHTS]      = (cyan_red[BALANCE_MODE.HIGHLIGHTS] > 0) ? highlights_add : highlights_sub;
    magenta_green_transfer[BALANCE_MODE.SHADOWS]    = (magenta_green[BALANCE_MODE.SHADOWS] > 0) ? shadows_add : shadows_sub;
    magenta_green_transfer[BALANCE_MODE.MIDTONES]   = (magenta_green[BALANCE_MODE.MIDTONES] > 0) ? midtones_add : midtones_sub;
    magenta_green_transfer[BALANCE_MODE.HIGHLIGHTS] = (magenta_green[BALANCE_MODE.HIGHLIGHTS] > 0) ? highlights_add : highlights_sub;
    yellow_blue_transfer[BALANCE_MODE.SHADOWS]      = (yellow_blue[BALANCE_MODE.SHADOWS] > 0) ? shadows_add : shadows_sub;
    yellow_blue_transfer[BALANCE_MODE.MIDTONES]     = (yellow_blue[BALANCE_MODE.MIDTONES] > 0) ? midtones_add : midtones_sub;
    yellow_blue_transfer[BALANCE_MODE.HIGHLIGHTS]   = (yellow_blue[BALANCE_MODE.HIGHLIGHTS] > 0) ? highlights_add : highlights_sub;
    
    for (var i = 0; i < 256; i++)
    {
        red = i;
        green = i;
        blue = i;
        red += (  cyan_red[BALANCE_MODE.SHADOWS] * cyan_red_transfer[BALANCE_MODE.SHADOWS][red]
                + cyan_red[BALANCE_MODE.MIDTONES] * cyan_red_transfer[BALANCE_MODE.MIDTONES][red]
                + cyan_red[BALANCE_MODE.HIGHLIGHTS] * cyan_red_transfer[BALANCE_MODE.HIGHLIGHTS][red]);
        
        red = clampColor(red);
        
        green += ( magenta_green[BALANCE_MODE.SHADOWS] * magenta_green_transfer[BALANCE_MODE.SHADOWS][green]
                 + magenta_green[BALANCE_MODE.MIDTONES] * magenta_green_transfer[BALANCE_MODE.MIDTONES][green]
                 + magenta_green[BALANCE_MODE.HIGHLIGHTS] * magenta_green_transfer[BALANCE_MODE.HIGHLIGHTS][green]);
        
        green = clampColor(green);
        
        blue += ( yellow_blue[BALANCE_MODE.SHADOWS] * yellow_blue_transfer[BALANCE_MODE.SHADOWS][blue]
                + yellow_blue[BALANCE_MODE.MIDTONES] * yellow_blue_transfer[BALANCE_MODE.MIDTONES][blue]
                + yellow_blue[BALANCE_MODE.HIGHLIGHTS] * yellow_blue_transfer[BALANCE_MODE.HIGHLIGHTS][blue]);
        blue = clampColor (blue);
        
        r_lookup[i] = red;
        g_lookup[i] = green;
        b_lookup[i] = blue;
    }
    
    var colorMap = new Uint8Array(256 * 3);
    
    for (var i = 0; i < 256; i++) {
        colorMap[i * 3 ] = r_lookup[i];
        colorMap[i * 3 + 1] = g_lookup[i];
        colorMap[i * 3 + 2] = b_lookup[i];
    }
    
    return colorMap;
}





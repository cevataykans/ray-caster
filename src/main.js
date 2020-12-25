var elt;

var canvas;
var gl;

var program;

var NumVertices  = 36;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

var framebuffer;

var flag = true;

var color = new Uint8Array(4);

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
    ];
    
var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),   // white
    ];

const sphere1 = new Sphere(vec3(0,2.5,0), 1);
const cone1 = new Cone(vec3(0,0,0), 1, 3);

var shapes = [ new Sphere( vec4( -1.5, 0, 0, 0), 0.5), new Sphere( vec4( 2, 0, 0, 0), 1) ]; //TALHA IF YOU WANT YOUR SHAPES TO BE RENDERED YOU NEED TO PUT THEM INTO THIS LIST
var square = new Square( vec4( 0, 0, 0, 0));
square.addTriangle( vec4( 0.5, -0.5, -0.5 ), vec4( -0.5, -0.5, -0.5 ), vec4( 0.5, 0.5, -0.5 ) ); // front
square.addTriangle( vec4( -0.5, 0.5, -0.5 ), vec4( 0.5, 0.5, -0.5 ), vec4( -0.5, -0.5, -0.5 ) ); // front complementary
square.addTriangle( vec4( 0.5, -0.5, 0.5 ), vec4( -0.5, -0.5, 0.5 ), vec4( 0.5, 0.5, 0.5 ) ); // back
square.addTriangle( vec4( -0.5, 0.5, 0.5 ), vec4( 0.5, 0.5, 0.5 ), vec4( -0.5, -0.5, 0.5 ) ); // back complementary
square.addTriangle( vec4( 0.5, -0.5, -0.5 ), vec4( -0.5, -0.5, -0.5 ), vec4( 0.5, -0.5, 0.5 ) ); // bottom
square.addTriangle( vec4( -0.5, -0.5, 0.5 ), vec4( 0.5, -0.5, 0.5 ), vec4( -0.5, -0.5, -0.5 )  ); // bottom complementary
square.addTriangle( vec4( 0.5, 0.5, -0.5 ), vec4( -0.5, 0.5, -0.5 ), vec4( 0.5, 0.5, 0.5 ) ); // top
square.addTriangle( vec4( -0.5, 0.5, 0.5 ), vec4( 0.5, 0.5, 0.5 ), vec4( -0.5, 0.5, -0.5 ) ); // top complementary
square.addTriangle( vec4( -0.5, -0.5, -0.5 ), vec4( -0.5, -0.5, 0.5 ), vec4( -0.5, 0.5, -0.5 ) ); // right side
square.addTriangle( vec4( -0.5, 0.5, 0.5 ), vec4( -0.5, 0.5, -0.5 ), vec4( -0.5, -0.5, 0.5 ) ); // right side complementary
square.addTriangle( vec4( 0.5, -0.5, -0.5 ), vec4( 0.5, -0.5, 0.5 ), vec4( 0.5, 0.5, -0.5 ) ); // left side
square.addTriangle( vec4( 0.5, 0.5, 0.5 ), vec4( 0.5, 0.5, -0.5 ), vec4( 0.5, -0.5, 0.5 ) ); // left side complementary
shapes.push( square);

//var sceneLight = new DistantLight( 1, vec4(1, 0, 0, 0));
var sceneLight = new PointLight( 100, vec4( 0, 0, -1, 0));
console.log( "SCENE LIGHT");
console.log( sceneLight);

var time = 0;

var lightPosition = vec4(-1.0, -1.0, -1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

//var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
//var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45.0, 45.0, 45.0];

var thetaLoc;

var Index = 0;

var camModelViewLoc;
var camModelViewMatrix;
var projectionMatrixLoc;
var projectionMatrix;

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

    // shapes[ 1].addTriangle( vertices[a], vertices[b], vertices[c]);
    // shapes[ 1].addTriangle( vertices[a], vertices[c], vertices[d]);

     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);  
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);  
     texCoordsArray.push(texCoord[3]);
};


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    // experimental
    canvas.addEventListener("mousedown", getPosition, false);
    function getPosition(event)
    {
    var x = event.x;
    var y = event.y;

        console.log( "x:" + x + " y:" + y);
    }
    // end experimental
    
    var ctx = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}); // delete if not used
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    elt = document.getElementById("test");


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    
    gl.enable(gl.CULL_FACE);

    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, 
       gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

// Allocate a frame buffer object

   framebuffer = gl.createFramebuffer();
   gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);


// Attach color buffer

   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

// check for completeness

   //var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
   //if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    var imageSrc = document.getElementById("texImageMenu");
    imageSrc.addEventListener('change', function() {
        let selection = imageSrc.value;
        var img = document.createElement('img'); 
        //img.visibility = "hidden";
        if (selection == "No Image")
        {
            configureTextureNoImage(image2);
        }
        else
        {
            switch(selection)
            {
                case "Default":
                    img.src = "Images/Default.png";
                    break;
                case "1080x1080":
                    img.src = "Images/1080x1080.jpg";
                    break;
                case "Logo":
                    img.src = "Images/Logo.gif";
                    break;
                case "Rainbow":
                    img.src = "Images/Rainbow.jpg";
                    break;
            }
            configureTextureImage(img);
        }
    });
    configureTextureNoImage(image2);

    thetaLoc = gl.getUniformLocation(program, "theta");
    
    viewerPos = vec3(0.0, 0.0, -20.0 );

    projection = ortho(-1, 1, -1, 1, -100, 100);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular); 
    
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag};
    document.getElementById( "raycastButton").onclick = () =>
    {
        var raycaster = new RayCaster();
        raycaster.castRays();
    };
    
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );

    camModelViewLoc = gl.getUniformLocation(program, "camModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    // FPS => official tutorial on mozilla tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
    setupCamera();
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false); 
    // END FPS

    canvas.addEventListener("mousedown", function(event){
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.clear( gl.COLOR_BUFFER_BIT);
        gl.uniform3fv(thetaLoc, theta);
        for(var i=0; i<6; i++) {
            gl.uniform1i(gl.getUniformLocation(program, "i"), i+1);
            gl.drawArrays( gl.TRIANGLES, 6*i, 6 );
        }
        var x = event.clientX;
        var y = canvas.height -event.clientY;
          
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

        if(color[0]==255)
        if(color[1]==255) elt.innerHTML = "<div> cyan </div>";
        else if(color[2]==255) elt.innerHTML = "<div> magenta </div>";
        else elt.innerHTML = "<div> red </div>";
        else if(color[1]==255)
        if(color[2]==255) elt.innerHTML = "<div> blue </div>";
        else elt.innerHTML = "<div> yellow </div>";
        else if(color[2]==255) elt.innerHTML = "<div> green </div>";
        else elt.innerHTML = "<div> background </div>";
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.uniform1i(gl.getUniformLocation(program, "i"), 0);
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.uniform3fv(thetaLoc, theta);
        gl.drawArrays(gl.TRIANGLES, 0, 36);

    }); 
          
    executeTests();
    render();
}


var render = function(){
    gl.clear(gl.COLOR_BUFFER_BIT);  
    //if(flag) theta[axis] += 2.0;
    modelView = mat4();
    // modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    // modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    // modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    // lightPosition[0] = Math.sin(0.01*time);
    // lightPosition[1] = Math.sin(0.01*time);
    // lightPosition[2] = Math.cos(0.01*time);
    //console.log(lightPosition[0]);
    
    //time += 1;

    sphere1.render();
    cone1.render();

    // eye = cameraTransform[ "pos"];
    // let lookDirection = getLookDirection( 100, 2);
    // lookDirection = add( eye, lookDirection);
    moveCamera();

    camModelViewMatrix = getCameraModelView();
    projectionMatrix = perspective(camFovy, camAspect, camNearPers, camFarPers);
    gl.uniformMatrix4fv( camModelViewLoc, false, flatten(camModelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.uniform1i(gl.getUniformLocation(program, "i"),0);
    // gl.drawArrays( gl.TRIANGLES, 0, 36 );

    requestAnimFrame(render);
}

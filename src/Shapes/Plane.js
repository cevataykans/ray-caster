function Plane( center = vec3(0, 0, 0), side = 1) 
{
    this.center = center;
    this.side = side;
    this.vertices = [];
    this.points = [];
    this.colors = [];
    this.normals = [];
    this.texCoords = [];
    this.texCoord = [
        vec2(1, 1),
        vec2(1, 0),
        vec2(0, 0),
        vec2(0, 1)
    ];
    this.normal = 0;

    // other details such as material, color etc.
    this.color = vec4( 1.0, 1.0, 1.0, 1.0);

    this.calculateVertices = function() {
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] - this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] + this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] + this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] - this.side/2), this.center[2] + this.side/2, 1.0));
    }

    this.calculatePoints = function() {
        this.calculateVertices();
        var t1 = subtract(this.vertices[0], this.vertices[1]);
        var t2 = subtract(this.vertices[3], this.vertices[0]);

        var normal = cross(t1, t2);
        var normal = vec3(normal);
        this.normal = normalize(normal);

        this.points.push(this.vertices[1]); 
        this.colors.push(this.color);
        this.normals.push(this.normal); 
        this.texCoords.push(this.texCoord[0]);

        this.points.push(this.vertices[0]); 
        this.colors.push(this.color);
        this.normals.push(this.normal); 
        this.texCoords.push(this.texCoord[1]);

        this.points.push(this.vertices[3]); 
        this.colors.push(this.color);
        this.normals.push(this.normal);  
        this.texCoords.push(this.texCoord[2]);

        this.points.push(this.vertices[1]);  
        this.colors.push(this.color);
        this.normals.push(this.normal); 
        this.texCoords.push(this.texCoord[0]);

        this.points.push(this.vertices[3]); 
        this.colors.push(this.color);
        this.normals.push(this.normal); 
        this.texCoords.push(this.texCoord[2]);

        this.points.push(this.vertices[2]); 
        this.colors.push(this.color);
        this.normals.push(this.normal);  
        this.texCoords.push(this.texCoord[3]);
    }

    this.mapTexture = function(image = null) {
        let texture;
        if (image == null)
            texture = configureTextureNoImage(image2);
        else
            texture = configureTextureImage(image);
            
        framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
 
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        var tBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW );
        var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
    }


    // CEVAT THIS IS JUST A TEST, THIS IS HOW YOU CONSTRUCT A 
    // TEXTURE MAP ARRAY. IF YOU WANT TO GET THE RAYCAST RESULTS ON THE PLANE,
    // CONSTRUCT THE PIXEL ARRAY LIKE THIS. ARR HOLDS THE DATA,
    // ARR2 MAPS THE TEXTURE IN A 2-D PLANE. THIS IS FOR MANUAL TEXTURES
    // IF YOU WANT TO LOOK AT THE IMAGES, CHECK TEXTURE MAPPER THEY ARE EASIER
    // YOU JUST PASS THE IMAGE AND ITS FORMAT BUT THE SIZE OF IT NEEDS TO BE POWER OF 2.
    // --------- WHEN YOU ARE SURE YOU PASS CORRECT PIXEL ARRAY FORMAT,
    // YOU CAN DELETE BELOW, PASS YOUR PIXEL ARRAY AS A PARAMETER TO MAP CANVAS FUNCTION
    // AND NEED TO CHANGE THE ARR2 NAMES INSIDE THE FUNCTION WITH THE PARAMETERS
    var arr = new Array()
    for (var i =0; i<512; i++)  arr[i] = new Array();
    for (var i =0; i<512; i++) 
        for ( var j = 0; j < 512; j++) 
        arr[i][j] = new Float32Array(4);
    for (var i =0; i<512; i++) for (var j=0; j<512; j++) {
        arr[i][j] = [1, 0, 1, 1];
    }

    // Convert floats to ubytes for texture

    var arr2 = new Uint8Array(4*512*512);

    for ( var i = 0; i < 512; i++ ) 
        for ( var j = 0; j < 512; j++ ) 
        for(var k =0; k<4; k++) 
                arr2[4*512*i+4*j+k] = 255*arr[i][j][k];
    
    this.mapCanvasFromRaycast = function() {
        texture = gl.createTexture();
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, 
            gl.RGBA, gl.UNSIGNED_BYTE, arr2);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
            gl.LINEAR_MIPMAP_NEAREST  );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

        framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
 
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        var tBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW );
        var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
    }


    this.render = function() {
        var m = mat4();
        m = translate(this.center[0], this.center[1], this.center[2]);
        gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(m));

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);

        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
    }

    this.interactWithRay = function ( rayOrigin, rayDir) // DEPRECIATED!
    {
        // ray equation = rayOrigin + t * rayDir
        // Plane equation = ( p - p0 ) dot product N == 0 LET t be hitParam!
        
        var flag = dot( this.normal, rayDir);
        if ( flag > Number.EPSILON)
        {
            var originDifference = subtract( this.center, rayOrigin);
            var hitParam = dot( originDifference, this.normal) / flag;
            if ( hitPoint > 0)
            {
                var hitPoint = add( rayOrigin, multScalar( rayDir, hitParam ) );
                var hitDistance = efficientDistance( hitPoint, rayOrigin);
                return new InteractionResult( hitPoint, hitDistance, this.normal, this.color);
            }
        }
        return null;
    };
};
function Cube( center = vec3(0, 0, 0), side = 1) 
{
    this.center = center;
    this.side = side;
    this.color = new vec4(1, 1, 1, 1);
    this.vertices = []
    this.triangles = [];
    this.hitTriangle = null;
    this.points = [];
    this.colors = [];
    this.normals = [];
    this.texCoords = [];
    this.texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    this.material = new Material();

    this.calculateVertices = function() {
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] - this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] + this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] + this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] - this.side/2), this.center[2] + this.side/2, 1.0));
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] - this.side/2), (this.center[2] - this.side/2), 1.0));
        this.vertices.push(vec4((this.center[0] - this.side/2), (this.center[1] + this.side/2), (this.center[2] - this.side/2), 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] + this.side/2), (this.center[2] - this.side/2), 1.0));
        this.vertices.push(vec4((this.center[0] + this.side/2), (this.center[1] - this.side/2), (this.center[2] - this.side/2), 1.0));
    }

    this.calculateSide = function (a, b, c, d) {
        var t1 = subtract(this.vertices[b], this.vertices[a]);
        var t2 = subtract(this.vertices[c], this.vertices[b]);

        var normal = cross(t1, t2);
        var normal = vec3(normal);
        normal = normalize(normal);

        this.points.push(this.vertices[a]); 
        this.normals.push(normal); 
        this.texCoords.push(this.texCoord[0]);

        this.points.push(this.vertices[b]); 
        this.normals.push(normal); 
        this.texCoords.push(this.texCoord[1]);

        this.points.push(this.vertices[c]); 
        this.normals.push(normal);  
        this.texCoords.push(this.texCoord[2]);

        this.points.push(this.vertices[a]);  
        this.normals.push(normal); 
        this.texCoords.push(this.texCoord[0]);

        this.points.push(this.vertices[c]); 
        this.normals.push(normal); 
        this.texCoords.push(this.texCoord[2]);

        this.points.push(this.vertices[d]); 
        this.normals.push(normal);  
        this.texCoords.push(this.texCoord[3]);
    }

    this.calculatePoints = function () {
        this.calculateVertices();
        this.calculateSide( 1, 0, 3, 2 );
        this.calculateSide( 2, 3, 7, 6 );
        this.calculateSide( 3, 0, 4, 7 );
        this.calculateSide( 6, 5, 1, 2 );
        this.calculateSide( 4, 5, 6, 7 );
        this.calculateSide( 5, 4, 0, 1 );

        for (var i = 0; i < this.points.length; i++)
        {
            this.colors.push(this.color);
        }
    }

    this.mapTexture = function (image = null) {
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

    this.render = function () {      
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

    this.addTriangle = function( firstPoint, secPoint, thirdPoint)
    {
        var firstP = vec4(0, 0, 0, 0);
        var secP = vec4(0, 0, 0, 0);
        var thirdP = vec4(0, 0, 0, 0);
        for ( let i = 0; i < 3; i++) // MAKE DEEP COPY SO THAT PHYSICAL TRIANGLE IS NOT AFFECTED BY THE TRANSFORMATION //TODO: make physical apperance comply with virtual center!
        {
            firstP[ i] = firstPoint[ i];
            secP[ i] = secPoint[ i];
            thirdP[ i] = thirdPoint[ i];
        }

        firstP = add( this.center, firstP);
        secP = add( this.center, secP);
        thirdP = add( this.center, thirdP);

        var triangleToAdd = new Triangle( firstP, secP, thirdP);
        triangleToAdd.setSurfaceData( this.material); //TODO
        this.triangles.push( triangleToAdd);
    };

    this.getShapeSurfaceData = function( hitpoint, rayDir)
    {
        return this.hitTriangle.getShapeSurfaceData( hitpoint);
    };

    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        this.hitTriangle = null;
        var maxDistance = Number.MAX_VALUE;
        var interactionResult = null;
        var hitTriangleInteractionDetails = null;
        for ( let i = 0; i < this.triangles.length; i++)
        {
            interactionResult = this.triangles[ i].interactWithRay( rayOrigin, rayDir);
            if ( interactionResult)
            {
                if ( interactionResult.hitDistance < maxDistance)
                {
                    this.hitTriangle = this.triangles[ i];
                    maxDistance = interactionResult.hitDistance;
                    hitTriangleInteractionDetails = interactionResult;
                }
            }
        }
        return hitTriangleInteractionDetails ? hitTriangleInteractionDetails : null;
    };
};
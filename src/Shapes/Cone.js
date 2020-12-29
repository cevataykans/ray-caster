class Cone {
    constructor(center = vec4(0, 0, 0, 0), radius = 1, height = 2) {
        this.center = center;
        this.radius = radius;
        this.height = height;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.texPoints = [];
        this.sectorCount = 50;

        // other details such as material, color etc.
        this.color = vec4(1, 1, 1, 1.0);

        this.calculatePoints = function () {
            var cyclinderPointIndices = [];

            let x, y;

            let sectorStep =  2 * Math.PI / this.sectorCount;
            var sectorAngle;
            // Lower circle
            for ( let i = 0; i <= this.sectorCount; i++)
            {
                sectorAngle = sectorStep * i;
                x = this.radius * Math.cos( sectorAngle);
                y = this.radius * Math.sin( sectorAngle);

                // Push points
                cyclinderPointIndices.push( vec4( x, y, -this.height / 2, 1) );
            }

            // Upper circle
            for ( let i = 0; i <= this.sectorCount; i++)
            {
                // push points
                var temp = cyclinderPointIndices[ i];
                cyclinderPointIndices.push( vec4( 0, 0, temp[ 2] + this.height, 1) );
            }

            let upper = this.sectorCount + 1;
            for ( let i = 0; i < this.sectorCount; i++)
            {
                // side
                this.points.push( cyclinderPointIndices[ i]);
                this.points.push( cyclinderPointIndices[ i + 1]);
                this.points.push( cyclinderPointIndices[ i + 1 + upper]);

                this.points.push( cyclinderPointIndices[ i]);
                this.points.push( cyclinderPointIndices[ i + 1 + upper]);
                this.points.push( cyclinderPointIndices[ i + upper]);

                // lower circle
                this.points.push( cyclinderPointIndices[ i] );
                this.points.push( cyclinderPointIndices[ i + 1]);
                this.points.push( vec4( 0, 0, cyclinderPointIndices[ i][ 2], 1));

                // upper circle
                this.points.push( cyclinderPointIndices[ i + 1 + upper] );
                this.points.push( cyclinderPointIndices[ i + upper]);
                this.points.push( vec4( 0, 0, -cyclinderPointIndices[ i][ 2], 1));

                // Push colors

                // Push normals

                // Push textures
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);

                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);

                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);

                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
                this.texPoints.push(i/this.stackCount, i/this.sectorCount);
            }

            for (i = 0; i < this.sectorCount*12; i++)
            {
                this.colors.push(this.color);
            }
        };

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
            gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texPoints), gl.STATIC_DRAW );
            var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
            gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vTexCoord);
        }

        this.render = function () {
            var m = mat4();
            m = translate(this.center[0], this.center[1], this.center[2]);
            m = mult (m, translate(-this.center[0], -this.center[1], -this.center[2]));
            m = mult(m, rotate(-90, 1, 0, 0));
            m = mult (m, translate(this.center[0], this.center[1], this.center[2]));
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

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.points.length);
        };

        this.getShapeSurfaceData = function( hitpoint, rayDir)
        {
            // calculate gradient
            var normal = vec4( 2 * hitpoint[0], -2 * hitpoint[1], 2* hitpoint[2], 0);
            normal = normalize( normal);
            // put point on gradient

            // return and hope it works
            return new SurfaceData( normal, this.material, texture);
        };

        this.interactWithRay = function (rayOrigin, rayDir) 
        {
            var a = Math.pow( rayDir[0], 2) + Math.pow( rayDir[2], 2) - Math.pow( rayDir[1], 2);
            var b = 2 * ( rayOrigin[0] * rayDir[ 0] + rayOrigin[2] * rayDir[ 2] - rayOrigin[ 1] * rayDir[ 1]);
            var c = Math.pow( rayOrigin[0], 2) + Math.pow( rayOrigin[2], 2) - Math.pow( rayOrigin[1], 2);

            var interactionParams = solveEquation( a, b, c);
            if ( interactionParams.length === 0) // no intersection, return null!
            {
                return null;
            }
            else if ( interactionParams.length === 1)
            {
                // Find the real hit point with the returned parameter t
                var hitPoint = interactionParams[ 0];
                hitPoint = add( rayOrigin, multScalar( rayDir, hitPoint ) );
                if ( hitPoint[ 3] > 0)
                {
                    throw "Hit point error";
                }

                if ( hitPoint[ 1] < this.center[ 1] || hitPoint[1] > this.center[ 1] + this.height )
                {
                    return null;
                }

                // do not compare points, find normal, distance and other required details.
                var hitDistance = efficientDistance( rayOrigin, hitPoint);
                var interactionResult = new InteractionResult( hitPoint, hitDistance);
                return interactionResult;
            }
            else if ( interactionParams.length === 2)
            {
                // Find the real hit point with the returned parameter t
                var hitPoint1 = interactionParams[ 0];
                var hitPoint2 = interactionParams[ 1];

                hitPoint1 = add( rayOrigin, multScalar( rayDir, hitPoint1 ) );
                hitPoint2 = add( rayOrigin, multScalar( rayDir, hitPoint2 ) );

                // compare points, find normal, distance and other required details.
                var distance1 = efficientDistance( rayOrigin, hitPoint1);
                var distance2 = efficientDistance( rayOrigin, hitPoint2);

                var realHitPoint;
                var realHitDistance;
                if ( distance1 > distance2 )
                {
                    realHitPoint = hitPoint2;
                    realHitDistance = distance2;
                }
                else 
                {
                    realHitPoint = hitPoint1;
                    realHitDistance = distance1;
                }

                if ( realHitPoint[ 3] > 0)
                {
                    throw "Hit point error";
                }

                if ( realHitPoint[ 1] < this.center[ 1] || realHitPoint[1] > this.center[ 1] + this.height )
                {
                    return null;
                }

                var interactionResult = new InteractionResult(realHitPoint, realHitDistance);
                return interactionResult;
            }

            else {
                // ERROR
                throw "Interaction points cannot be more than 2!";
            }
        };
    }
};
class Sphere 
{
    constructor(center = vec3(0, 0, 0), radius = 1) 
    {
        this.center = center;
        this.radius = radius;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.stackCount = 20;
        this.sectorCount = 20;

        // other details such as material, color etc.
        this.color = vec4( 1.0, 0.5, 0.5, 1.0);

        this.calculatePoints = function () 
        {
            var spherePointIndices = [];

            var x, y, z, xyAngle;

            var sectorStep = 2 * Math.PI / this.sectorCount;
            var stackStep = Math.PI / this.stackCount;
            var sectorAngle, stackAngle;

            for (let i = 0; i <= this.stackCount; i++) {
                stackAngle = Math.PI / 2 - i * stackStep; // PI / 2 to - PI / 2
                xyAngle = Math.cos(stackAngle);
                z = this.radius * Math.sin(stackAngle);

                for (let j = 0; j <= this.sectorCount; j++) {
                    sectorAngle = j * sectorStep;

                    x = this.radius * xyAngle * Math.cos(sectorAngle);
                    y = this.radius * xyAngle * Math.sin(sectorAngle);

                    // push point!
                    spherePointIndices.push(vec4(x, y, z, 1));
                }
            }

            let upper, lower;
            for (let i = 0; i < this.stackCount; i++) {
                upper = i * (this.sectorCount + 1); // currentStack beginning
                lower = upper + this.sectorCount + 1; // nextStack beginning

                for (let j = 0; j < this.sectorCount; j++, upper++, lower++) {
                    if (i != 0) {
                        // Push real vertices
                        this.points.push(spherePointIndices[upper]);
                        this.points.push(spherePointIndices[upper + 1]);
                        this.points.push(spherePointIndices[lower]);

                        // push normals!
                        var upArrow = subtract(spherePointIndices[upper + 1], spherePointIndices[upper]);
                        var leftArrow = subtract(spherePointIndices[lower], spherePointIndices[upper]);
                        var normalToPush = normalize(cross(upArrow, leftArrow));
                        normalToPush = vec4(normalToPush);
                        normalToPush[3] = 0.0;

                        this.normals.push(normalToPush);
                        this.normals.push(normalToPush);
                        this.normals.push(normalToPush);

                        this.colors.push(this.color);
                        this.colors.push(this.color);
                        this.colors.push(this.color);
                    }

                    if (i != (this.stackCount - 1)) {
                        this.points.push(spherePointIndices[upper + 1]);
                        this.points.push(spherePointIndices[lower + 1]);
                        this.points.push(spherePointIndices[lower]);

                        // push normals!
                        var upArrow = subtract(spherePointIndices[upper + 1], spherePointIndices[lower]);
                        var leftArrow = subtract(spherePointIndices[lower + 1], spherePointIndices[lower]);
                        var normalToPush = normalize(cross(upArrow, leftArrow));
                        normalToPush = vec4(normalToPush);
                        normalToPush[3] = 0.0;

                        this.normals.push(normalToPush);
                        this.normals.push(normalToPush);
                        this.normals.push(normalToPush);

                        this.colors.push(this.color);
                        this.colors.push(this.color);
                        this.colors.push(this.color);
                    }
                }
            }
        };

        this.render = function () 
        {
            //this.calculatePoints();

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
        };

        this.getShapeSurfaceData = function( hitpoint, rayDir)
        {
            var normal = normalize( subtract( hitpoint, this.center) );
            var colorToReturn = [];
            for ( let i = 0; i < 3; i++)
            {
                colorToReturn.push( this.color[ i] * Math.max( 0, dot( normal, multScalar( rayDir, -1) )) );
            }
            colorToReturn.push( 1);
           
            var texture = vec2();
            texture[ 0] =  (1 + (Math.atan2( hitpoint[ 2], hitpoint[0] ) / Math.PI) ) * 0.5;
            texture[ 1] = Math.acos( hitpoint[ 1]) / Math.PI;
            return new SurfaceData( normal, colorToReturn, texture);
        };

        this.interactWithRay = function (rayOrigin, rayDir) 
        {
            //var a = dot( rayDir, rayDir);
            var a = 1;
            //var b = 2 * dot( rayDir, rayOrigin);
            var OMinusC = subtract( rayOrigin, this.center);
            var b = 2 * dot( rayDir, OMinusC);
            //var c = dot( rayOrigin, rayOrigin) -  Math.pow( this.radius, 2);
            var c = dot( OMinusC, OMinusC ) - Math.pow( this.radius, 2);

            var interactionParams = solveEquation( a, b, c);
            // add distance other information etc.
            if ( interactionParams.length === 0) // no intersection, return null!
            {
                return null;
            }
            else if ( interactionParams.length === 1)
            {
                // Find the real hit point with the returned parameter t
                var hitPoint = interactionParams[ 0];
                hitPoint = add( rayOrigin, multScalar( rayDir, hitPoint ) );

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
                var realHitNormal = normalize(subtract(realHitPoint, this.center));
                var hitColor = this.color;

                var interactionResult = new InteractionResult(realHitPoint, realHitDistance, realHitNormal, hitColor);
                return interactionResult;
            }

            else {
                // ERROR
                throw "Interaction points cannot be more than 2!";
            }
        };
    }
};
class Torus {
    constructor(center = vec3(0, 0, 0), innerRadius = 1, outerRadius = 1) {
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];
        this.stackCount = 100;
        this.sectorCount = 100;

        // other details such as material, color etc.
        this.color = vec4(1, 1, 1, 1.0);

        this.calculatePoints = function () {
            var torusPointIndices = [];
            var x, y, z;
            var sectorAngle, stackAngle;

            for (let i = 0; i <= this.stackCount; i++) {
                stackAngle = i/this.stackCount*2*Math.PI;
                z = this.innerRadius * Math.sin(i);

                for (let j = 0; j <= this.sectorCount; j++) {
                    sectorAngle = j/this.sectorCount*2*Math.PI

                    x = (this.outerRadius + this.innerRadius * Math.cos(stackAngle)) * Math.cos(sectorAngle);
                    y = (this.outerRadius + this.innerRadius * Math.cos(stackAngle)) * Math.sin(sectorAngle);

                    // push point!
                    torusPointIndices.push(vec4(x, y, z, 1));
                }
            }

            let upper, lower;
            for (let i = 0; i < this.stackCount; i++) {
                upper = i * (this.sectorCount + 1); // currentStack beginning
                lower = upper + this.sectorCount + 1; // nextStack beginning

                for (let j = 0; j < this.sectorCount; j++, upper++, lower++) {
                    // Push real vertices
                    this.points.push(torusPointIndices[upper]);
                    this.points.push(torusPointIndices[upper + 1]);
                    this.points.push(torusPointIndices[lower]);

                    this.points.push(torusPointIndices[lower]);
                    this.points.push(torusPointIndices[upper + 1]);
                    this.points.push(torusPointIndices[lower + 1]);

                    // push normals!
                    var upArrow = subtract(torusPointIndices[upper + 1], torusPointIndices[upper]);
                    var leftArrow = subtract(torusPointIndices[lower], torusPointIndices[upper]);
                    var normalToPush = normalize(cross(upArrow, leftArrow));
                    normalToPush = vec4(normalToPush);
                    normalToPush[3] = 0.0;

                    this.normals.push(normalToPush);
                    this.normals.push(normalToPush);
                    this.normals.push(normalToPush);

                    var upArrow = subtract(torusPointIndices[upper + 1], torusPointIndices[lower]);
                    var leftArrow = subtract(torusPointIndices[lower + 1], torusPointIndices[lower]);
                    var normalToPush = normalize(cross(upArrow, leftArrow));
                    normalToPush = vec4(normalToPush);
                    normalToPush[3] = 0.0;

                    this.normals.push(normalToPush);
                    this.normals.push(normalToPush);
                    this.normals.push(normalToPush);

                    this.colors.push(this.color);
                    this.colors.push(this.color);
                    this.colors.push(this.color);

                    this.colors.push(this.color);
                    this.colors.push(this.color);
                    this.colors.push(this.color);


                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);
                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);
                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);

                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);
                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);
                    this.texCoords.push(i/this.stackCount, j/this.sectorCount);
                }
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
            gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW );
            var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
            gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vTexCoord);
        }

        this.render = function () {
            var m = mat4();
            m = translate(-this.center[0], -this.center[1], -this.center[2]);
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

            gl.drawArrays(gl.TRIANGLES, 0, this.points.length / 3);
        };

        this.interactWithRay = function (rayOrigin, rayDir) {
        };
    }
};
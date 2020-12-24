class Cone {
    constructor(center = vec3(0, 0, 0), radius = 1, height = 2) {
        this.center = center;
        this.radius = radius;
        this.height = height;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.stackCount = 20;
        this.sectorCount = 20;

        // other details such as material, color etc.
        this.color = vec4(0, 0, 1, 1.0);

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
            }

            for (i = 0; i < this.sectorCount*12; i++)
            {
                this.colors.push(this.color);
            }
        };

        this.render = function () {
            this.calculatePoints();

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

        this.interactWithRay = function (rayOrigin, rayDir) {
        };
    }
};
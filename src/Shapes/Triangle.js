function Triangle( firstPoint, secPoint, thirdPoint) 
{
    this.firstPoint = firstPoint;
    this.secPoint = secPoint; // make this center! so that triangle faces outwards
    this.thirdPoint = thirdPoint;

    this.edgeAB = subtract( secPoint, firstPoint); // u is associated with B
    this.edgeAC = subtract( thirdPoint, firstPoint); // v is associated with C
    this.edgeBC = subtract( thirdPoint, secPoint);
    this.normal = cross( this.edgeAB, this.edgeAC);
    this.triCompleteArea = length( this.normal);
    this.normal = normalize( this.normal);
    this.normal = [ ...this.normal, 0];
    console.log( this.normal);
    console.log( firstPoint);
    this.D = dot( this.normal, this.firstPoint); 

    // other details such as material, color etc.
    this.color = vec4( 0, 1, 0, 1);
    this.ranColor1 = vec4(Math.random(), Math.random(), Math.random(), 1);
    this.ranColor2 = vec4(Math.random(), Math.random(), Math.random(), 1);
    this.ranColor3 = vec4(Math.random(), Math.random(), Math.random(), 1);
    this.u;
    this.v;
    this.material;

    this.setSurfaceData = function( materialOfParent) //TODO 
    {
        this.material = materialOfParent;
    };

    this.getShapeSurfaceData = function( hitpoint, rayDir) //TODO
    {
        this.ranColor1 = multScalar( this.ranColor1, this.u );
        this.ranColor1 = multScalar( this.ranColor2, this.v );
        this.ranColor3 = multScalar( this.ranColor3, (1 - (this.u + this.v)));
        
        var randColor = add( this.ranColor1, add( this.ranColor3, this.ranColor2));
        randColor[ 3] = 1;

        return new SurfaceData( this.normal, this.material, null);
    };

    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        // check triangle facing backward, do not render it!
        // if ( dot( rayDir, this.normal ) > 0)
        // {
        //     //console.log( "TRIANGLE FACING BACKWARD");
        //     return null;
        // }

        // check triangle and ray is parallel        
        var parallelFlag = dot( this.normal, rayDir);
        if ( Math.abs( parallelFlag) < Number.EPSILON)
        {
            //console.log( "TRIANGLE AND RAY ARE PARALLEL");
            return null; // a very small number, they are parallel, no intersection
        }

        // find intersection point param
        // console.log( "PARALLEL FLAG = " + parallelFlag);
        // console.log( "DOT NORMAL RAY ORIGIN = " + dot( this.normal, rayOrigin));
        // console.log( "D = " + this.D);
        // console.log( "TRI NORMAL = " + this.normal);
        var pointParam = ( -dot( this.normal, rayOrigin) + this.D) / parallelFlag;
        //console.log( "POINT PARAM = " + pointParam);
        if ( pointParam < 0)
        {
            //console.log( "POINT IS BEHIND CAMERA");
            return null; // point is behind camera, do not render it!
        }

        // real hit point
        var hitPoint = add( rayOrigin, multScalar( rayDir, pointParam ) );
        hitPoint = vec4( hitPoint[0], hitPoint[ 1], hitPoint[ 2]);
        var insideOutNormal;

        // for first edge
        var edgeHitPoint = subtract( hitPoint, this.firstPoint);
        insideOutNormal = cross( this.edgeAB, edgeHitPoint);
        insideOutNormal[ 3] = 0;
        if ( dot( this.normal, insideOutNormal) < 0)
        {
            //console.log( "POINT ON THE OUT OF AB");
            return null;
        }

        // for edge BC
        edgeHitPoint = subtract( hitPoint, this.secPoint);
        insideOutNormal = cross( this.edgeBC, edgeHitPoint);
        insideOutNormal[ 3] = 0;
        this.u = dot( this.normal, insideOutNormal);
        if ( this.u < 0)
        {
            //console.log( "POINT ON THE OUT OF BC");
            return null;
        }

        // for edge AC
        var lastEdge = subtract( this.firstPoint, this.thirdPoint);
        edgeHitPoint = subtract( hitPoint, this.thirdPoint);
        insideOutNormal = cross( lastEdge, edgeHitPoint);
        insideOutNormal[ 3] = 0;
        this.v = dot( this.normal, insideOutNormal);
        if ( this.v < 0)
        {
            //console.log( "POINT ON THE OUT OF CA");
            return null;
        }

        this.u = this.u / this.triCompleteArea;
        this.v = this.v / this.triCompleteArea;
        return new InteractionResult( hitPoint, efficientDistance( hitPoint, rayOrigin));
    };
};
function executeTests()
{
    console.log( "EUATION SOLVER TEST");
    console.log( solveEquation( 1, -4, 4));
    console.log( solveEquation( 1, -5, 4));
    console.log( solveEquation( 1, 0, -4));
    console.log( solveEquation( 1, -1, 4));
    console.log( "EQUATION SOLVER TEST END");
    console.log( "DISTANCE CALCULATOR TEST")
    console.log( realDistance( [ 3, 6, 0, 0], [6, 10, 0, 0]));
    console.log( realDistance( [ 1, 1, 1, 0], [1, 5, 1, 0]));
    console.log( efficientDistance( [ 2, 3, 4, 0], [4, -2, 1, 0]));
    console.log("DISTANCE CALCULATOR TEST END");
    console.log( "SPHERE TEST");
    var testSphere = new Sphere( vec4( 0, 0, 10, 0), 1);
    var rayOrigin = vec4( 0, 0, 0, 0);
    var rayDir = vec4( 0, 0, 1, 0);
    console.log( testSphere.interactWithRay( rayOrigin, rayDir));
    console.log( "SPHERE TEST END");

    console.log( "TRIANGLE TEST");
    var triangle = new Triangle( new vec4(-20, 0, 0), new vec4(-20, 10, 10), new vec4(-20, 0, 10));

    console.log( "TRIANGLE AB: " + triangle.edgeAB);
    console.log( "TRIANGLE AC: " + triangle.edgeAC);
    console.log( "TRIANGLE LENGTH/AREA: " + triangle.triCompleteArea);
    console.log( "TRIANGLE NORMAL: " + triangle.normal);
    rayOrigin = new vec4( 10, 0, 0, 0);
    rayDir = new vec4( -1, 0, 0, 0);
    var intersection = triangle.interactWithRay( rayOrigin, rayDir);
    if ( intersection != null)
    {
        console.log( "U : " + triangle.u);
        console.log( "V: " + triangle.v);
        console.log( intersection);
    }
    else
    {
        console.log( "NO INTERSECTION");
    }
    console.log( "TRIANGLE TEST END");
    console.log( "LIGHT TEST");
    var testMAtireal = new Material();
    console.log( multScalar( mult( multScalar( testMAtireal.albedo, 1.0 / Math.PI), sceneLight.lightAmount), Math.max( 0, dot( vec4( 1, 0, 0, 0), multScalar( rayDir, -1) ) ) ) );
    console.log( "LIGHT TEST END");
};
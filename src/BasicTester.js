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
    // var testSphere = new Sphere( vec4( 0, 0, 10, 0), 1);
    // var rayOrigin = vec4( 0, 0, 0, 0);
    // var rayDir = vec4( 0, 0, 1, 0);
    // console.log( testSphere.interactWithRay( rayOrigin, rayDir));
    console.log( "SPHERE TEST END");
};
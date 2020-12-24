var camNearOrtho = -15;
var camFarOrtho = 15;
var camRadius = 1;
var camTheta  = 0.0;
var camPhi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var camFovy = 60.0;  // Field-of-view in Y direction angle (in degrees)
var camAspect = 1.0;       // Viewport aspect ratio
var camNearPers = 0;
var camFarPers = 100;

var camSensitivity = 200.0;
var refreshRate = 1.0 / 60;
var camMoveSpeed = 0.25;

var isInFPS = false;
var perpectiveSettings;

var keyDowns = {
    "w": false,
    "a": false,
    "d": false,
    "s": false,
    "space": false,
    "alt": false
};

var camForward = [ 0, 0, 1];
var camUp = [ 0, 1, 0];
var camRight = [ -1, 0, 0];
var camPos = [ 0, 0, -5];
var camLocalEulerAngles = [ 0, 0, 0];

function setupCamera()
{
    function setupCameraController()
    {
        document.addEventListener( "keydown", (event) => {
            keyDowns[ event.key] = true;
        }, false);

        document.addEventListener( "keyup", (event) => {
            keyDowns[ event.key] = false;
        }, false);
    };
    setupCameraController();
};

function moveForward(dist)
{
    camPos[0] += camForward[0] * dist;
    camPos[1] += camForward[1] * dist;
    camPos[2] += camForward[2] * dist;
};

function moveUp(dist)
{
    camPos[0] += camUp[0] * dist;
    camPos[1] += camUp[1] * dist;
    camPos[2] += camUp[2] * dist;
};

function moveRight(dist)
{
    camPos[0] += camRight[0] * dist;
    camPos[1] += camRight[1] * dist;
    camPos[2] += camRight[2] * dist;
};

function lookLeftRight( angleRadians)
{
    camLocalEulerAngles[ 1] += angleRadians;

    // var rotationMatrix = rotate( camLocalEulerAngles[ 1], camUp);
    // camForward = multMV( rotationMatrix, [ ...camForward, 0]);
    // camForward = vec3( camForward[0], camForward[1], camForward[2]);
    // camRight = cross( camForward, camUp);
    // camRight = normalize( camRight);
};

function lookUpDown( angleRadians)
{
    if ( camLocalEulerAngles[ 0] + angleRadians < 80 && camLocalEulerAngles[ 0] + angleRadians > -80)
    {   
        camLocalEulerAngles[ 0] += angleRadians;
    }

    // var rotationMatrix = rotate( (camLocalEulerAngles[ 0] * Math.PI / 180), camRight);
    // camForward = multMV( rotationMatrix, [ ...camForward, 0]);
    // console.log( camForward);
    // camForward = vec3( camForward[0], camForward[1], camForward[2]);
    // camUp = cross( camForward, camRight);
    // camUp = normalize( camUp);
};

function getCameraModelView()
{
    return lookAt( camPos, add( camPos, camForward), camUp);
};

function moveCamera()
{
    if ( isInFPS)
    {
        if ( keyDowns[ "a"])
        {
            moveRight( -camMoveSpeed);
    
        }
        else if ( keyDowns[ "d"])
        {
            moveRight( camMoveSpeed);
        }
    
        if ( keyDowns[ "w"])
        {
            moveForward( camMoveSpeed);
    
        }
        else if ( keyDowns[ "s"])
        {
            moveForward( -camMoveSpeed);
    
        }
    
        if ( keyDowns[ "Shift"])
        {
            moveUp( camMoveSpeed);

        }
        else if ( keyDowns[ "Alt"])
        {
            moveUp( -camMoveSpeed);
            
        }
    }
};

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      document.addEventListener("mousemove", updateCameraAngle, false);
      isInFPS = true;
    } else {
      document.removeEventListener("mousemove", updateCameraAngle, false);
      isInFPS = false;
    }
  };

function updateCameraAngle(e)
{
    lookLeftRight( e.movementX / camSensitivity );
    lookUpDown(  e.movementY / camSensitivity );
    // cameraTransform[ "rot"][ 1] += ( e.movementX / camSensitivity);
    // cameraTransform[ "rot"][ 0] -= ( e.movementY / camSensitivity);

    // realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 0], 1, 0, 0), cameraOrientation);
    // realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 1], 0, 1, 0), realCamOrientation);
    // realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 2], 0, 0, 1), realCamOrientation);
};
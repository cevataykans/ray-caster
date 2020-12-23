var camNearOrtho = -15;
var camFarOrtho = 15;
var camRadius = 1;
var camTheta  = 0.0;
var camPhi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var camLeft = -15.0;
var camRight = 15.0;
var camYTop = 15.0;
var camBottom = -15.0;

var camFovy = 90.0;  // Field-of-view in Y direction angle (in degrees)
var camAspect = 1.0;       // Viewport aspect ratio
var camNearPers = 0;
var camFarPers = 100;

var camSensitivity = 50.0;

var eye;
const camAt = vec3(0.0, 0.0, 0.0);
const camUp = vec3( 0.0, 1.0, 0.0);
// Important!
var cameraOrientation = mat4( 1);
var realCamOrientation = cameraOrientation;

var isCameraOrtho = true;
var isInFPS = false;
var enableHardFocus = false;

var orthoSettings;
var perpectiveSettings;

var keyDowns = {
    "w": false,
    "a": false,
    "d": false,
    "s": false,
    "space": false,
    "alt": false
};

var cameraTransform = {
    "pos": [ 0.0, 0.0, -5],
    "rot": [ 0.0, 0.0, 0.0], 
    "scale": [ 1, 1, 1],
};

var cameraTFUIElements = [
    [],
    []
];

var refreshRate = 1.0 / 60;

function setupCamera()
{
    function setupOrthoCameraUI()
    {
        document.getElementById("radiusSliderID").oninput = function(event) {
            camRadius = event.target.value;
        };

        document.getElementById("thetaSlider").oninput = function(event) {
            camTheta = event.target.value * Math.PI / 180.0;
        };

        document.getElementById("phiSlider").oninput = function(event) {
            camPhi = event.target.value * Math.PI / 180.0;
        };

        document.getElementById("depthSlider").oninput = function(event) {
            camFarOrtho = event.target.value / 2;
            camNearOrtho = -event.target.value / 2;
        };

        document.getElementById("heightSlider").oninput = function(event) {
            camYTop = event.target.value / 2;
            camBottom = -event.target.value / 2;
        };
        document.getElementById("widthSlider").oninput = function(event) {
            camRight = event.target.value / 2;
            camLeft = -event.target.value / 2;
        };
    };

    function setupPrespectiveCameraSettings()
    {
        document.getElementById("zFarSlider").oninput = function(event) {
            camFarPers = event.target.value;
        };
        document.getElementById("zNearSlider").oninput = function(event) {
            camNearPers = event.target.value;
        };
        document.getElementById("aspectSlider").oninput = function(event) {
            camAspect = event.target.value;
        };
        document.getElementById("fovSlider").oninput = function(event) {
            camFovy = event.target.value;
        };
    };

    function setupCameraSelection()
    {
        orthoSettings = document.getElementsByName( "orthoSettings");
        perpectiveSettings = document.getElementsByName( "perspectiveSettings");

        let radioButtons = document.getElementsByName( "selectedCam");
        radioButtons[1].checked = true;
        isCameraOrtho = false;
        for ( let i = 0; i < radioButtons.length; i++)
        {
            radioButtons[ i].onclick = function( event)
            {
                isCameraOrtho = event.target.id === "orthoRadioButton";
                if ( isCameraOrtho)
                {
                    lockCameraSettings( false, true);
                }
                else
                {
                    lockCameraSettings( true, false);
                }
            }
        }
        lockCameraSettings( true, false);

        let hardFocusCheckBox = document.getElementById( "hardFocusCheckBox");
        hardFocusCheckBox.addEventListener( "input", (event) => {
            enableHardFocus = event.target.checked;
        }, false);
    };

    function setupCameraController()
    {
        document.addEventListener( "keydown", (event) => {
            keyDowns[ event.key] = true;
        }, false);

        document.addEventListener( "keyup", (event) => {
            keyDowns[ event.key] = false;
        }, false);
    };

    function setupCameraTransformUI()
    {
        let cameraTransformInputElements = document.getElementsByClassName( "camTransformInput");
        for ( let i = 0; i < 2; i++)
        {
            for ( let j = 0; j < 3; j++)
            {
                cameraTFUIElements[ i].push( cameraTransformInputElements[ i * 3 + j] );
                cameraTFUIElements[ i][j].oninput = updateCameraTransformLogic;
            }
        }
        updateCameraTransformUI();
        realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 0], 1, 0, 0), cameraOrientation);
        realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 1], 0, 1, 0), realCamOrientation);
        realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 2], 0, 0, 1), realCamOrientation);
    };


    //setupCameraSelection()
    //setupOrthoCameraUI();
    //setupPrespectiveCameraSettings();
    setupCameraController();
    //setupCameraTransformUI();
};

function moveCamera()
{
    if ( isInFPS)
    {
        if ( keyDowns[ "a"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(1.0, 0));
    
        }
        else if ( keyDowns[ "d"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(-1.0, 0));
    
        }
    
        if ( keyDowns[ "w"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(1.0, 2));
    
        }
        else if ( keyDowns[ "s"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(-1.0, 2));
    
        }
    
        if ( keyDowns[ "Shift"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(1.0, 1));

        }
        else if ( keyDowns[ "Alt"])
        {
            cameraTransform[ "pos"] = add( cameraTransform[ "pos"], getLookDirection(-1.0, 1));
            
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
    cameraTransform[ "rot"][ 1] += ( e.movementX / camSensitivity);
    cameraTransform[ "rot"][ 0] -= ( e.movementY / camSensitivity);

    realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 0], 1, 0, 0), cameraOrientation);
    realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 1], 0, 1, 0), realCamOrientation);
    realCamOrientation = mult( rotate(cameraTransform[ "rot"][ 2], 0, 0, 1), realCamOrientation);
};

function getLookDirection( distance, axis)
{
    let normalizedDirection = normalize( vec3( realCamOrientation[ axis]));
    for ( let i = 0; i < normalizedDirection.length; i++)
    {
        normalizedDirection[ i] *= distance;
    }
    return normalizedDirection;
};
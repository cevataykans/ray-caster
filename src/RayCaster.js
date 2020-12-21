var imageWidth = 720;
var imageHeight = 720;
var traceDepth = 3;
var shapes = [ {} ]; //TODO make it oop!
var numOfShapes = shapes.length; //TODO make it oop!
var fovAngle = 60.0;

var cameraToWorld;
console.log( "END");

function generateImage()
{
    var rayWorldOrigin;
    var rayWorlDir;

    function setupRaycaster()
    {
        cameraToWorld = camModelViewMatrix;
    };

    function castRays()
    {
        var pixelList = [];
        for( let i = 0; i < imageHeight; i++)
        {
            for ( let j = 0; j < imageWidth; j++)
            {
                var rayP = buildRay( j, i);
                var rayOrigin = vec4( 0, 0, 0, 0);
                // console.log( "Ray P:");
                // console.log( rayP);
                // console.log( "Ray Origin:: ");
                // console.log( rayOrigin);

                // console.log( "Cam to world");
                var rayPWorld = multMV( cameraToWorld, rayP);
                var rayOriginWorld = multMV( cameraToWorld, rayOrigin);
                // console.log( "Ray P World:");
                // console.log( rayPWorld);
                // console.log( "Ray Origin world: ");
                // console.log( rayOriginWorld);

                //var rayDirWorld = subtract( rayPWorld, rayOriginWorld);
                //rayDirWorld = normalize( rayDirWorld);

                //var colorAtPixel = traceRay( ray, normalize(ray), traceDepth);
                /*if ( colorAtPixel)
                {
                    //TODO store color!
                    console.log( colorAtPixel);
                }*/

                if ( (i == 0 && j == 0) || (i == 0 && j == imageWidth - 1) || (i == imageHeight - 1 && j == 0) || (i == imageHeight - 1 && j == imageWidth - 1) )
                {
                    console.log( "CAM TO WORLD");
                    console.log( cameraToWorld);
                    console.log( "Ray P World:");
                    console.log( rayPWorld);
                    console.log( "Ray Origin world: ");
                    console.log( rayOriginWorld);
                }
                return;
            }
        }
    
        function buildRay( pixelX, pixelY)
        {   
            //TODO build ray and return at pixel to world coordinate
            var aspectRatio = imageWidth / imageHeight;
            var fovAngleEffect = Math.tan( (fovAngle / 2) * Math.PI / 180);
    
            var pixelNDCx = (pixelX + 0.5) / imageWidth;
            var pixelNDCy = (pixelY + 0.5) / imageHeight;
    
            var pixelScreenX = ((2 * pixelNDCx) - 1 ) * aspectRatio * fovAngleEffect;
            var pixelScreenY = 1- (2 * pixelNDCy) * fovAngleEffect;
    
            return new vec4( pixelScreenX, pixelScreenY, -1, 0);
        };    
    
        function traceRay( rayOrigin, rayDir, traceDepth)
        {
            if ( traceDepth <= 0.1)
            {
                // return background color!
                return new vec3( 0, 0, 0, 1);
            }
    
            // define hit color,
    
            //TODO trace the ray!
            var closestObjectDetails = findClosestIntersectWithShape( rayOrigin, rayDir);
            if ( closestObjectDetails)
            {
                shadePoint( rayOrigin, rayDir, closestObjectDetails);
            }
            else
            {
                //TODO return outer space color; 
                return new vec4( 0, 0, 0, 1);
            }
        };
    
        function findClosestIntersectWithShape( rayOrigin, rayDir)
        {
            //TODO find closest interaction point with and 
            var maxDistance = Number.MAX_SAFE_INTEGER;
            var closestShapeDetails = null;
            for ( let curShapeIndex = 0; curShapeIndex < numOfShapes; curShapeIndex++)
            {
                var shapeIntersection = intersectWithShape( rayOrigin, rayDir, shapes[ curShapeIndex]); // RETURN intersection detauils such as distance, surface normal, pointer to surface color etc.
                // TODO check if this intersection is closer than the max distance, if so, set the closest object with its insersection details!
            }
            // return shape with intersection details!
            return closestShapeDetails;
        };
    
        function intersectWithShape( ray, rayDir, shape)
        {
    
        };
    
        function shadePoint(rayOrigin, rayDir, shapeToShadeDetails) // return color emitted by surface in ray interaction
        {
            //TODO if check reflection and rafraction of the shapeToShadeDetails.materialType
    
            //TODO check reflection of the shapeToShadeDetails.materialType
    
            //TODO  else shade it with pong model by checking first shadow
    
        };
    
        function shadeShadow( rayOrigin, rayDir, shapeToShadeDetails)
        {
    
        };
    };

    setupRaycaster();
    castRays();
};
var imageWidth = 512;
var imageHeight = 512;
var traceDepth = 1;

var hitCount = 0;
var camTf;
var projectionMat;
console.log( "END");

function RayCaster()
{
    this.pixelList = [];
    this.backgroundColor = vec4( 0, 0, 0, 0.3);
    var normalShadowBias = Math.pow( 10, -5);

    this.castRays = function()
    {
        this.pixelList = [];
        hitCount = 0;
        for( let i = 0; i < imageHeight; i++)
        {
            for ( let j = 0; j < imageWidth; j++)
            {
                var rayP = this.buildRay( j, i);
                var rayOrigin = vec4( 0, 0, 0, 0);

                // var rotateAroundX = rotate( camTf["rot"][0], [1, 0, 0]);
                // var rotateAroundY = rotate( camTf["rot"][1], [0, 1, 0]);
                // var rotateAroundZ = rotate( camTf["rot"][2], [0, 0, 1]);
                // console.log( "ROTATE X");
                // console.log( rotateAroundX);
                // console.log( "ROTATE Y");
                // console.log( rotateAroundY);
                // console.log( "ROTATE Z");
                // console.log( rotateAroundZ);

                var rayPWorld = rayP;
                // rayPWorld = multMV( rotateAroundX, rayPWorld);
                // rayPWorld = multMV( rotateAroundY, rayPWorld);
                // rayPWorld = multMV( rotateAroundZ, rayPWorld);
                rayPWorld = add( [...camPos, 0 ], rayPWorld);

                var rayOriginWorld = rayOrigin;
                // rayOriginWorld = multMV( rotateAroundX, rayOriginWorld);
                // rayOriginWorld = multMV( rotateAroundY, rayOriginWorld);
                // rayOriginWorld = multMV( rotateAroundZ, rayOriginWorld);
                rayOriginWorld = add( [...camPos, 0 ], rayOriginWorld);
                
                // console.log( "CAM TF POS");
                // console.log( camTf["pos"]);
                // console.log( "FOUND ORIGIN");
                // console.log( rayOriginWorld);

                var rayDirWorld = subtract( rayPWorld, rayOriginWorld);
                rayDirWorld = normalize( rayDirWorld);
                // console.log( "DIRECTION");
                // console.log( rayDirWorld);
                if ( rayDirWorld[ 3] > 0 || rayOriginWorld[ 3] > 0)
                {
                    console.log( "PROBLEM! RAY START");
                }

                var colorAtPixel = this.traceRay( rayOriginWorld, rayDirWorld, traceDepth);
                if ( colorAtPixel)
                {
                    //TODO store color!
                    //console.log( colorAtPixel);
                    this.pixelList.push( colorAtPixel);
                }

                //if ( (i == 0 && j == 0) || (i == 0 && j == imageWidth - 1) || (i == imageHeight - 1 && j == 0) || (i == imageHeight - 1 && j == imageWidth - 1) )
                if ( i ==  Math.floor( (imageWidth / 2) ) && j == Math.floor( (imageHeight / 2) ) )
                {
                    // console.log( "CAM TF POS");
                    // console.log( camPos);

                    // console.log( "Ray P World:");
                    // console.log( rayPWorld);
                    // console.log( "Ray Origin world: ");
                    // console.log( rayOriginWorld);
                    // console.log( "DIRECTION");
                    // console.log( rayDirWorld);
                }
                // return;

            }
        }
        console.log( "Image dim is:" + 512 * 512);
        console.log( "PIXEL LIST LENGTH");
        console.log( this.pixelList.length);
        console.log( "HIT COUNT");
        console.log( hitCount);    
        this.debugImage( this.pixelList);
    };

    this.buildRay = function( pixelX, pixelY)
    {   
        // build ray and return at pixel to world coordinate
        var aspectRatio = imageWidth / imageHeight;
        var fovAngleEffect = Math.tan( (camFovy / 2) * (Math.PI / 180));

        var pixelNDCx = (pixelX + 0.5) / imageWidth;
        var pixelNDCy = (pixelY + 0.5) / imageHeight;

        var pixelScreenX = ((2 * pixelNDCx) - 1 ) * aspectRatio * fovAngleEffect;
        var pixelScreenY = (1 - (2 * pixelNDCy)) * fovAngleEffect;

        return new vec4( -pixelScreenX, pixelScreenY, 1, 0);
    };    


    this.traceRay = function( rayOrigin, rayDir, traceDepth)
    {
        if ( traceDepth <= 0.1) // to account for floating points in 0 just in case.
        {
            // return background color!
            return this.backgroundColor;
        }

        //TODO trace the ray!
        var closestObject = this.findClosestIntersectWithShape( rayOrigin, rayDir);
        if ( closestObject)
        {
            hitCount++;
            return this.shadePoint( rayOrigin, rayDir, traceDepth - 1, closestObject);
        }
        else
        {
            //return outer space color; 
            return this.backgroundColor;
        }
    };

    this.findClosestIntersectWithShape = function( rayOrigin, rayDir, distanceLimit = null)
    {
        //find closest interaction point with and 
        var maxDistance = Number.MAX_SAFE_INTEGER;
        var closestShape = null;
        var shapeIntersectionData = null;
        var intersectionDataToReturn = null;
        for ( let curShapeIndex = 0; curShapeIndex < shapes.length; curShapeIndex++)
        {
            shapeIntersectionData = shapes[ curShapeIndex].interactWithRay( rayOrigin, rayDir);
            if ( shapeIntersectionData)
            {
                // check if this intersection is closer than the max distance, if so, set the closest object with its insersection details!
                if ( shapeIntersectionData.hitDistance < maxDistance)
                {
                    closestShape = shapes[ curShapeIndex];
                    maxDistance = shapeIntersectionData.hitDistance;
                    intersectionDataToReturn = shapeIntersectionData;
                }
            }
        }

        // if this is a secondary ray that could be shot to a point source light, check if ray found a valid shape
        if ( !intersectionDataToReturn || ( distanceLimit && intersectionDataToReturn.hitDistance > distanceLimit))
        {
            return null;
        }

        // return shape with intersection details!
        return { shape: closestShape, hitpoint: intersectionDataToReturn.hitPoint };
    };

    var first = true;
    this.shadePoint = function(rayOrigin, rayDir, depth, hitObject) // return color emitted by surface in ray interaction
    {
        var hitPoint = hitObject.hitpoint; //TODO REFACTOR, simplify
        if ( hitPoint[3] > 0)
        {
            throw "INVALID HIT POINT";
        }
        // surface specific shader data
        var hitShape = hitObject.shape;
        var surfaceDetails = hitShape.getShapeSurfaceData( hitPoint, rayDir);
        var shapeAlbedo = surfaceDetails.material.albedo;
        var hitNormal = surfaceDetails.hitNormal;

        // Light sahder specific data
        var lightShaderData = sceneLight.getLightShadingData( hitPoint);
        var reverseLightDir = multScalar( lightShaderData.lightDirection, -1);
        var lightAmount = lightShaderData.lightAmount;
        var lightTravelLimit = lightShaderData.travelLimit;

        //TODO if check reflection and rafraction of the shapeToShadeDetails.materialType

        //TODO check reflection of the shapeToShadeDetails.materialType

        //TODO  else shade it with pong model by checking first shadow
        
        // Diffuse shading 
        var colorToReturn = multScalar( mult( multScalar( shapeAlbedo, 1.0 / Math.PI), lightAmount), Math.max( 0, dot( hitNormal, reverseLightDir ) ) );

        // send shadow secondary ray!
        var hitOrigin = add( hitPoint, multScalar( hitNormal, normalShadowBias) );
        if ( hitOrigin[ 3] > 0 && first)
        {
            throw "JUST BEFORE SHADOWING";
        }
        var closestObject = lightTravelLimit ? this.findClosestIntersectWithShape( hitOrigin, reverseLightDir, lightTravelLimit) : this.findClosestIntersectWithShape( hitOrigin, reverseLightDir);
        if ( closestObject)
        {
            // shade as shadow
            colorToReturn[ 0] = 0;
            colorToReturn[ 1] = 0;
            colorToReturn[ 2] = 0;
        }
        colorToReturn[ 3] = 1;
        return colorToReturn;
    };

    this.debugImage = function(pixelList)
    {
        console.log( "Painting");
        var debugCanvas = document.getElementById('rayCastCanvas');
        ctx = debugCanvas.getContext('2d');
        ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
        ctx.clearRect(0, 0, imageWidth, imageHeight);
        var id = ctx.getImageData(0, 0, imageWidth, imageHeight);
        var pixels = id.data;
      
        for ( let row = 0; row < imageHeight; row++)
        {
            for ( let col = 0; col < imageWidth; col++)
            {
                var listIndex = (row * id.width + col);
                var off = listIndex * 4;
                pixels[off] = this.pixelList[listIndex][0] * 255;
                pixels[off + 1] = this.pixelList[listIndex][1] * 255;
                pixels[off + 2] = this.pixelList[listIndex][2] * 255;
                pixels[off + 3] = this.pixelList[listIndex][3] * 255;
            }
        }
        ctx.putImageData(id, 0, 0);
        console.log( "Painting done");
    };
};
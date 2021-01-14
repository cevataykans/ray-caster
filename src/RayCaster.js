var imageWidth = 512;
var imageHeight = 512;
var traceDepth = 10;

var hitCount = 0;
var camTf;

function RayCaster()
{
    this.pixelList = [];
    this.backgroundColor = vec4( 1, 1, 1, 0.3);
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

                var colorAtPixel = this.traceRay( rayOriginWorld, rayDirWorld, traceDepth, RayType.PRIMARY);
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


    this.traceRay = function( rayOrigin, rayDir, traceDepth, rayType)
    {
        if ( traceDepth <= 0.1) // to account for floating points in 0 just in case.
        {
            // return background color!
            return this.backgroundColor;
        }

        //TODO trace the ray!
        var closestObject = this.findClosestIntersectWithShape( rayOrigin, rayDir, null, rayType);
        if ( closestObject)
        {
            hitCount++;
            return this.shadePoint( rayOrigin, rayDir, traceDepth, closestObject);
        }
        else
        {
            //return outer space color; 
            return this.backgroundColor;
        }
    };

    this.findClosestIntersectWithShape = function( rayOrigin, rayDir, distanceLimit = null, rayType = null)
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
                // ignore
                if ( rayType && rayType === RayType.SHADOW && shapes[curShapeIndex].material.type === MaterialTypes.refractandreflect)
                {
                    console.log( "IGNORED!");
                    continue;
                }

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
        var shapeMaterialType = surfaceDetails.material.type;
        var hitNormal = surfaceDetails.hitNormal;
        var hitOrigin = add( hitPoint, multScalar( hitNormal, normalShadowBias) );
        var hitColor = surfaceDetails.material.color;
        var hitIor = surfaceDetails.material.ior;
        var hitSpecularN = surfaceDetails.material.specularN;
        if ( hitOrigin[ 3] > 0)
        {
            throw "JUST BEFORE SHADOWING";
        }

        var diffuseColor = vec4( 0, 0, 0, 0);
        var specularColor = vec4( 0, 0, 0, 0);
        var colorToReturn = vec4( 0, 0, 0, 0);

        if ( shapeMaterialType === MaterialTypes.reflection ) //TODO check reflection of the shapeToShadeDetails.materialType
        {
            var reflectionVector = reflectVector( rayDir, hitNormal);
            reflectionVector = normalize( reflectionVector);
            colorToReturn = add( colorToReturn, multScalar( this.traceRay( hitOrigin, reflectionVector, depth - 1, RayType.OTHER ), 0.8 ) );
        }
        else if ( shapeMaterialType === MaterialTypes.refractandreflect ) //TODO if check reflection and rafraction of the shapeToShadeDetails.materialType
        {
            var refractionColor = vec4( 0, 0, 0, 0);
            var fresnelCofactor = fresnelComputation( rayDir, hitNormal, hitIor);
            var outside = dot( rayDir, hitNormal) < 0;
            var bias = multScalar( hitNormal, normalShadowBias);

            if ( fresnelCofactor < 1) // compute refraction if it is not a total internal reflection
            {
                var refractDir = refractVector( rayDir, hitNormal, hitIor);
                refractDir = normalize( refractDir);
                if ( length( refractDir) <= 0)
                {
                    throw "NOOOO";
                }
                var refractionOrigin = outside ? subtract( hitPoint, bias) : add( hitPoint, bias);
                refractionColor = this.traceRay( refractionOrigin, refractDir, depth - 1, RayType.OTHER );
            }

            var reflectionDir = reflectVector( rayDir, hitNormal);
            reflectionDir = normalize( reflectionDir);
            var reflectionOrigin = outside ? add( hitPoint, bias) : subtract( hitPoint, bias);
            var reflectionColor = this.traceRay( reflectionOrigin, reflectionDir, depth - 1, RayType.OTHER );

            colorToReturn = add( colorToReturn, add( multScalar(reflectionColor, fresnelCofactor ), multScalar( refractionColor, ( 1 - fresnelCofactor) ) ) );
        }
        else if ( shapeMaterialType === MaterialTypes.diffuse ) //TODO  else shade it with pong model by checking first shadow
        {
            // Diffuse shading 
            for ( let lightSrcInd = 0; lightSrcInd < lightSources.length; lightSrcInd++) // send ray for each light source!
            {
                // Light sahder specific data
                var lightShaderData = lightSources[lightSrcInd].getLightShadingData( hitPoint);
                var reverseLightDir = multScalar( lightShaderData.lightDirection, -1);
                var lightIntensity = lightShaderData.lightIntensity;
                var lightTravelLimit = lightShaderData.travelLimit;
                var lightAmount;
                if ( lightShaderData.lightType === LightTypes.POINT)
                {
                    lightAmount = multScalar(  multScalar( hitColor, lightIntensity), 1.0 / ( 4 * Math.PI * lightTravelLimit) );
                }
                else if ( lightShaderData.lightType === LightTypes.DISTANT)
                {
                    lightAmount = multScalar( hitColor, lightIntensity);
                }
                
                diffuseColor = multScalar( mult( multScalar( shapeAlbedo, 1.0 / Math.PI), lightAmount), Math.max( 0, dot( hitNormal, reverseLightDir ) ) );
    
                // send shadow secondary ray!
                var closestObject = lightTravelLimit ? this.findClosestIntersectWithShape( hitOrigin, reverseLightDir, lightTravelLimit, RayType.SHADOW) : this.findClosestIntersectWithShape( hitOrigin, reverseLightDir, null, RayType.SHADOW);
                if ( closestObject)
                {
                    // shade as shadow
                    diffuseColor[ 0] = 0;
                    diffuseColor[ 1] = 0;
                    diffuseColor[ 2] = 0;
                }
                colorToReturn = add( colorToReturn, diffuseColor);
            }
        }
        else if ( shapeMaterialType === MaterialTypes.pong) //TODO pong illumination with specular addition
        {
            // Diffuse and specular shading
            for ( let lightSrcInd = 0; lightSrcInd < lightSources.length; lightSrcInd++) // send ray for each light source!
            {
                // Light sahder specific data
                var lightShaderData = lightSources[lightSrcInd].getLightShadingData( hitPoint);
                var reverseLightDir = multScalar( lightShaderData.lightDirection, -1);
                var lightIntensity = lightShaderData.lightIntensity;
                var lightTravelLimit = lightShaderData.travelLimit;
                var lightAmount;
                if ( lightShaderData.lightType === LightTypes.POINT)
                {
                    lightAmount = multScalar(  multScalar( hitColor, lightIntensity), 1.0 / ( 4 * Math.PI * lightTravelLimit) );
                }
                else if ( lightShaderData.lightType === LightTypes.DISTANT)
                {
                    lightAmount = multScalar( hitColor, lightIntensity);
                }
    
                // shade diffuse
                tempDiffuseColor = multScalar( mult( multScalar( shapeAlbedo, 1.0 / Math.PI), lightAmount), Math.max( 0, dot( hitNormal, reverseLightDir ) ) );
    
                // shade specular
                var lightReflectDir = reflectVector( lightShaderData.lightDirection, hitNormal);
                lightReflectDir = normalize( lightReflectDir);
                tempSpecularColor =  multScalar( lightAmount, Math.pow( Math.max( 0, dot( lightReflectDir, multScalar( rayDir, -1) ) ), hitSpecularN) );

                // send shadow secondary ray!
                var closestObject = lightTravelLimit ? this.findClosestIntersectWithShape( hitOrigin, reverseLightDir, lightTravelLimit, RayType.SHADOW) : this.findClosestIntersectWithShape( hitOrigin, reverseLightDir, null, RayType.SHADOW);
                if ( closestObject)
                {
                    // shade as shadow
                    tempDiffuseColor[ 0] = 0;
                    tempDiffuseColor[ 1] = 0;
                    tempDiffuseColor[ 2] = 0;
                    tempSpecularColor[ 0] = 0;
                    tempSpecularColor[ 1] = 0;
                    tempSpecularColor[ 2] = 0;
                }
                diffuseColor = add( diffuseColor, tempDiffuseColor);
                specularColor = add( specularColor, tempSpecularColor);
            }
            // add specular and diffuse color, then return
            diffuseColor = mult( diffuseColor, surfaceDetails.material.diffuse);
            specularColor = mult( specularColor, surfaceDetails.material.specular);
            colorToReturn = add( colorToReturn, add( diffuseColor, specularColor ));
        }

        colorToReturn[ 3] = 1;
        return colorToReturn;
    };
};
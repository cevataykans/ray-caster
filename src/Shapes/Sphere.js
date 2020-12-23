function Sphere( center, radius) 
{
    this.center = center;
    this.radius = radius;

    // other details such as material, color etc.
    this.color = vec4( 1.0, 0.5, 0.5, 1.0);


    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        //var a = dot( rayDir, rayDir);
        var a = 1;
        //var b = 2 * dot( rayDir, rayOrigin);
        var OMinusC = subtract( rayOrigin, this.center);
        var b = 2 * dot( rayDir, OMinusC);
        //var c = dot( rayOrigin, rayOrigin) -  Math.pow( this.radius, 2);
        var c = dot( OMinusC, OMinusC ) - Math.pow( this.radius, 2);

        var interactionParams = solveEquation( a, b, c);
        // add distance other information etc.
        if ( interactionParams.length === 0) // no intersection, return null!
        {
            return null;
        }
        else if ( interactionParams.length === 1)
        {
            // Find the real hit point with the returned parameter t
            var hitPoint = interactionParams[ 0];

            hitPoint = add( rayOrigin, multScalar( rayDir, hitPoint ) );

            // do not compare points, find normal, distance and other required details.
            var hitDistance = realDistance( rayOrigin, hitPoint);
            var hitNormal = normalize( subtract( hitPoint, this.center) );
            var hitColor = this.color;

            var interactionResult = new InteractionResult( hitPoint, hitDistance, hitNormal, hitColor);
            return interactionResult;
        }
        else if ( interactionParams.length === 2)
        {
            // Find the real hit point with the returned parameter t
            var hitPoint1 = interactionParams[ 0];
            var hitPoint2 = interactionParams[ 1];

            hitPoint1 = add( rayOrigin, multScalar( rayDir, hitPoint1 ) );
            hitPoint2 = add( rayOrigin, multScalar( rayDir, hitPoint2 ) );

            // compare points, find normal, distance and other required details.
            var distance1 = realDistance( rayOrigin, hitPoint1);
            var distance2 = realDistance( rayOrigin, hitPoint2);

            var realHitPoint;
            var realHitDistance;
            var realHitNormal;
            if ( distance1 > distance2 )
            {
                realHitPoint = hitPoint2;
                realHitDistance = distance2;
            }
            else
            {
                realHitPoint = hitPoint1;
                realHitDistance = distance1;
            }
            var realHitNormal = normalize( subtract( realHitPoint, this.center) );
            var hitColor = this.color;

            var interactionResult = new InteractionResult( realHitPoint, realHitDistance, realHitNormal, hitColor);
            return interactionResult;
        }
        else
        {
            // ERROR
            throw "Interaction points cannot be more than 2!";
        }
    };
};
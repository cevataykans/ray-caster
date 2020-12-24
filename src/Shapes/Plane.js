function Plane( center, normal) 
{
    this.center = center;
    this.normal = normal;

    // other details such as material, color etc.
    this.color = vec4( 0.0, 1.0, 1.0, 1.0);
    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        // ray equation = rayOrigin + t * rayDir
        // Plane equation = ( p - p0 ) dot product N == 0 LET t be hitParam!
        
        var flag = dot( this.normal, rayDir);
        if ( flag > Number.EPSILON)
        {
            var originDifference = subtract( this.center, rayOrigin);
            var hitParam = dot( originDifference, this.normal) / flag;
            if ( hitPoint > 0)
            {
                var hitPoint = add( rayOrigin, multScalar( rayDir, hitParam ) );
                var hitDistance = efficientDistance( hitPoint, rayOrigin);
                return new InteractionResult( hitPoint, hitDistance, this.normal, this.color);
            }
        }
        return null;
    };
};
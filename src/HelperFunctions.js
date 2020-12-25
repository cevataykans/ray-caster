function solveEquation( a, b, c)
{
    // f(x) = at^2 + bt + c 

    var discriminant = Math.pow( b, 2) - 4 * a * c;
    var intersectionPoints = [];
    if ( discriminant == 0)
    {
        var intersectionPoint = ( -b ) / ( 2 * a );

        if ( intersectionPoint > 0)
        {
            intersectionPoints.push( intersectionPoint);
        }
    }
    else if ( discriminant > 0) // intersects at only one point!
    {
       var intersectionPoint1 = ( (-b) + Math.sqrt( discriminant) ) / ( 2 * a);
       var intersectionPoint2 = ( (-b) - Math.sqrt( discriminant) ) / ( 2 * a);

       if ( intersectionPoint1 > 0)
       {
            intersectionPoints.push( intersectionPoint1);
       }
       
       if ( intersectionPoint2 > 0)
       {
            intersectionPoints.push( intersectionPoint2);
       }
    }
    return intersectionPoints;
};

function realDistance( u, v)
{
    var distance = 0;
    for ( let i = 0; i < u.length; i++)
    {
        distance += Math.pow( (u[i] - v[i]), 2 );
    }
    return Math.sqrt( distance);
}

function efficientDistance( u, v)
{
    var distance = 0;
    for ( let i = 0; i < u.length; i++)
    {
        distance += Math.pow( (u[i] - v[i]), 2 );
    }
    return distance;
}

function InteractionResult( point, distance)
{
    this.hitPoint = point;
    this.hitDistance = distance;
};

function SurfaceData( normal, material, texture)
{
    this.hitNormal = normal;
    this.material = material;
    this.hitTexture = texture;
};

function shortenVector( vector, length)
{
    var shortenedVector = [];
    for ( let i = 0; i < length; i++)
    {
        shortenedVector[ i] = vector[ i];
    }
    return shortenedVector;
};

function reflectVector( incoming, surfaceNormal)
{
    var outgoing = vec4( 0, 0, 0, 0);
    outgoing = subtract( incoming, multScalar( surfaceNormal, 2 * dot( incoming, surfaceNormal) ) );
    return outgoing;
}

var MaterialTypes = {
    diffuse: 0,
    reflection: 1,
    refract: 2,
}

function Material( type, color, albedo = vec4( 0.18, 0.18, 0.18, 1))
{
    this.type = type;
    this.albedo = albedo;
    this.color = color;
};
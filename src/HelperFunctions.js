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
};

function efficientDistance( u, v)
{
    var distance = 0;
    for ( let i = 0; i < u.length; i++)
    {
        distance += Math.pow( (u[i] - v[i]), 2 );
    }
    return distance;
};

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
};

function refractVector( incoming, surfaceNormal, ior)
{
    var cosIncomingNormal = dot( incoming, surfaceNormal);
    var normal = [ ...surfaceNormal];
    if ( cosIncomingNormal < -1) //CLAMP
    {
        cosIncomingNormal = -1;
    }
    else if ( cosIncomingNormal > 1)
    {
        cosIncomingNormal = 1;
    }

    var etai = 1; // we assume air is always have 1 as ior
    var etat = ior;

    if ( cosIncomingNormal < 0) // check if the ray coming from inside the shape or outside
    {
        cosIncomingNormal = -cosIncomingNormal;
    }
    else
    {
        var temp = etai;
        etai = etat;
        etat = temp;
        normal = multMV( normal, -1);
    }

    var eta = etai / etat;
    var k = 1 - ( eta * eta * (1 - cosIncomingNormal * cosIncomingNormal));
    return k < 0 ? vec4( 0, 0, 0, 0) : add( multScalar( incoming, eta), multScalar( normal, (eta * cosIncomingNormal * Math.sqrt(k))) );
};

function fresnelComputation( incoming, surfaceNormal, ior)
{
    var fresnelFactor = 1;
    var cosIncomingNormal = dot( incoming, surfaceNormal);
    if ( cosIncomingNormal < -1) //CLAMP
    {
        cosIncomingNormal = -1;
    }
    else if ( cosIncomingNormal > 1)
    {
        cosIncomingNormal = 1;
    }
    
    var etai = 1; // we assume air is always have 1 as ior
    var etat = ior;
    if ( cosIncomingNormal > 0)
    {
        var temp = etai;
        etai = etat;
        etat = temp;
    }

    var sint = (etai / etat) * Math.sqrt( Math.max( 0, 1 - cosIncomingNormal * cosIncomingNormal ) );
    if ( sint < 1) // not total internal reflection
    {
        var cost = Math.sqrt( Math.max( 0, 1 - sint * sint ) );
        cosIncomingNormal = Math.abs( cosIncomingNormal);
        var Rs = ( (etat * cosIncomingNormal) - (etai * cost) ) / ( (etat * cosIncomingNormal) + (etai * cost) ) ;
        var Rp = ( (etai * cosIncomingNormal) - (etat * cost) ) / ( (etai * cosIncomingNormal) + (etat * cost) );
        fresnelFactor = ( (Rs * Rs) + (Rp * Rp) ) / 2;
    }
    return fresnelFactor
}



var MaterialTypes = {
    diffuse: 0,
    reflection: 1,
    refractandreflect: 2,
    pong: 3,
};

function Material( type, color, ior = 1, albedo = vec4( 0.18, 0.18, 0.18, 1))
{
    this.type = type;
    this.albedo = albedo;
    this.color = color;
    this.ior = ior;
};
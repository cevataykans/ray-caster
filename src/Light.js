var LightTypes = {
    DISTANT: 0,
    POINT: 1,
};

var RayType = {
    SHADOW: 0,
    PRIMARY: 1,
    OTHER: 2,
};

var lightSources = []; // GLOBAL LIGHT SOURCES USED BY THE RAY TRACING
//lightSources.push( new PointLight( 500, vec4( 0, 1, -1, 0)));
//lightSources.push( new PointLight( 350, vec4( -1, 0, 0, 0)));
lightSources.push( new DistantLight( 20, vec4( 1, 0, 0, 0) ) );
//lightSources.push( new PointLight( 500, vec4( 2, 0, 0, 0)));
//lightSources.push( new PointLight( 500, vec4( 0, 0, -2, 0)));

function DistantLight( intensity, direction = vec4( 0, 0, 1, 0), color = vec4( 0, 0, 1, 1))
{
    this.lightType = LightTypes.DISTANT; 
    this.lightDir = direction; 
    this.lightIntensity = intensity; 
    this.lightColor = color; 
    this.lightAmount = multScalar( this.lightColor, this.lightIntensity);

    this.getLightShadingData = function(target)
    {
        return new LightShadingData(  this.lightType, this.lightIntensity, this.lightDir);
    };
};

function PointLight( intensity,  pos = vec4( 0, 0, 0, 0), color = vec4( 1, 0, 0, 1) )
{
    this.lightType = LightTypes.POINT;
    this.lightPos = pos;
    this.lightIntensity = intensity;
    this.lightColor = color;

    this.getLightShadingData = function(target)
    {
        var lightDir = subtract( target, this.lightPos);
        var radius2 = dot( lightDir, lightDir);
        normalize( lightDir);
        
        //var lightAmount = multScalar(  multScalar( this.lightColor, this.lightIntensity ), 1.0 / ( 4 * Math.PI * radius2) );
        return new LightShadingData( this.lightType, this.lightIntensity, lightDir, radius2);
    };
};

function LightShadingData( type, intensity, direction, rayTravelLimit = null)
{
    this.lightType = type;
    this.lightIntensity = intensity;
    this.lightDirection = direction;
    this.travelLimit = rayTravelLimit;
};
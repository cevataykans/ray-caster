var LightTypes = {
    DISTANT: 0,
    POINT: 1,
};

var lightSources = []; // GLOBAL LIGHT SOURCES USED BY THE RAY TRACING
lightSources.push( new PointLight( 500, vec4( 0, 1, -1, 0)));
lightSources.push( new PointLight( 350, vec4( -2.5, -1, -1, 0)));

//TODO, TALHA, please move the light attributes here, put whatever you need, please do not touch those that are marked as RC which means used by ray caster at the moment, 
// if you wish, you can use the same position, intensity, color etc used by the ray caster to have a single system
function DistantLight( intensity, direction = vec4( 0, 0, 1, 0), color = vec4( 0, 0, 1, 1))
{
    this.lightType = LightTypes.DISTANT; //RC
    this.lightDir = direction; //RC
    this.lightIntensity = intensity; //RC
    this.lightColor = color; //RC
    this.lightAmount = multScalar( this.lightColor, this.lightIntensity); //RC

    this.getLightShadingData = function(target)
    {
        return new LightShadingData(  this.lightType, this.lightAmount, this.lightDir);
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
        
        var lightAmount = multScalar(  multScalar( this.lightColor, this.lightIntensity ), 1.0 / ( 4 * Math.PI * radius2) );
        return new LightShadingData( this.lightType, lightAmount, lightDir, radius2);
    };
};

function LightShadingData( type, amount, direction, rayTravelLimit = null)
{
    this.lightType = type;
    this.lightAmount = amount;
    this.lightDirection = direction;
    this.travelLimit = rayTravelLimit;
};
function DistantLight( intensity, direction = vec4( 0, 0, 1, 0), color = vec4( 0, 0, 1, 1)) //TODO, TALHA, please move the light attributes here, put whatever you need, please do not touch those that are marked as RC which means used by ray caster at the moment, 
{ // if you wish, you can use the same position, intensity, color etc used by the ray caster to have a single system
    this.lightDir = direction;
    this.lightIntensity = intensity; //RC
    this.lightColor = color; //RC
    this.lightAmount = multScalar( this.lightColor, this.lightIntensity); //RC

    this.getLightDirection = function( target)
    {
        return this.lightDir;
    };

    this.getLightColor = function()
    {
        return this.lightColor;
    }
};

function PointLight( intensity,  pos = vec4( 0, 0, 0, 0), color = vec4( 1, 0, 0, 1) )
{
    this.lightPos = pos;
    this.lightIntensity = intensity;
    this.lightColor = color;

    this.getLightDirection = function( target)
    {
        return normalize( subtract( target, this.lightPos)); // sends a light ray from light source to the specified target
    };

    this.getLightColor = function()
    {
        return this.lightColor;
    }
}
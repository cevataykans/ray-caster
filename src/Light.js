function Light( intensity, color = vec4( 0, 0, 1, 1)) //TODO, TALHA, please move the light attributes here, put whatever you need, please do not touch those that are marked as RC which means used by ray caster at the moment, 
{ // if you wish, you can use the same position, intensity, color etc used by the ray caster to have a single system
    this.lightPos = vec4( 0, 0, -2, 0 ); //RC
    this.lightDir = vec4( 1, 0, 0, 0);
    this.lightIntensity = intensity; //RC
    this.lightColor = color; //RC
    this.lightAmount = multScalar( this.lightColor, this.lightIntensity); //RC
};
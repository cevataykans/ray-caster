function Square( center) 
{
    this.center = center;
    this.triangles = [];
    this.hitTriangle = null;

    // other details such as material, color etc.
    this.color = vec4( 1.0, 0.0, 0.0, 1.0);
    this.material = new Material();

    this.addTriangle = function( firstPoint, secPoint, thirdPoint)
    {
        var firstP = vec4();
        var secP = vec4();
        var thirdP = vec4();
        for ( let i = 0; i < 3; i++) // MAKE DEEP COPY SO THAT PHYSICAL TRIANGLE IS NOT AFFECTED BY THE TRANSFORMATION //TODO: make physical apperance comply with virtual center!
        {
            firstP[ i] = firstPoint[ i];
            secP[ i] = secPoint[ i];
            thirdP[ i] = thirdPoint[ i];
        }

        firstP = add( this.center, firstP);
        secP = add( this.center, secP);
        thirdP = add( this.center, thirdP);

        var triangleToAdd = new Triangle( firstP, secP, thirdP);
        triangleToAdd.setSurfaceData( this.material); //TODO
        this.triangles.push( triangleToAdd);
    };

    this.getShapeSurfaceData = function( hitpoint, rayDir)
    {
        return this.hitTriangle.getShapeSurfaceData( hitpoint);
    };

    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        this.hitTriangle = null;
        var maxDistance = Number.MAX_VALUE;
        var interactionResult = null;
        var hitTriangleInteractionDetails = null;
        for ( let i = 0; i < this.triangles.length; i++)
        {
            interactionResult = this.triangles[ i].interactWithRay( rayOrigin, rayDir);
            if ( interactionResult)
            {
                if ( interactionResult.hitDistance < maxDistance)
                {
                    this.hitTriangle = this.triangles[ i];
                    maxDistance = interactionResult.hitDistance;
                    hitTriangleInteractionDetails = interactionResult;
                }
            }
        }
        return hitTriangleInteractionDetails ? hitTriangleInteractionDetails : null;
    };
};
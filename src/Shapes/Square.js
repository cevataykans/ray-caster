function Square( center, triangles) 
{
    this.center = center;
    this.triangles = [];
    this.hitTriangle = null;

    // other details such as material, color etc.
    this.color = vec4( 1.0, 0.5, 0.5, 1.0);

    this.addTriangle = function( firstPoint, secPoint, thirdPoint)
    {
        firstPoint[ 3] = 0;
        secPoint[ 3] = 0;
        thirdPoint[ 3] = 0;

        firstPoint = add( this.center, firstPoint);
        secPoint = add( this.center, secPoint);
        thirdPoint = add( this.center, thirdPoint);

        var triangleToAdd = new Triangle( firstPoint, secPoint, thirdPoint);
        triangleToAdd.setSurfaceData( this.color); //TODO
        this.triangles.push( triangleToAdd);
    };

    this.getShapeSurfaceData = function( hitpoint)
    {
        return this.hitTriangle.getShapeSurfaceData( hitpoint);
    };

    this.interactWithRay = function ( rayOrigin, rayDir)
    {
        this.hitTriangle = null;
        var maxDistance = Number.MAX_VALUE;
        var interactionResult = null;
        for ( let i = 0; i < this.triangles.length; i++)
        {
            interactionResult = this.triangles[ i].interactWithRay( rayOrigin, rayDir);
            if ( interactionResult)
            {
                if ( interactionResult.hitDistance < maxDistance)
                {
                    this.hitTriangle = this.triangles[ i];
                    maxDistance = interactionResult.hitDistance;
                }
            }
        }
        return interactionResult ? interactionResult : null;
    };
};
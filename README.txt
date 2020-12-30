MADE BY

Talha Şen - 21702020
Cevat Aykan Sevinç - 21703201

HOW TO COMPILE

Enter src directory. Right click main.html. Choose your favorite web browser to launch the application. If project does not launch up, try changing your browser to Chrome. If you can see the world, you can click on the canvas and move with w a s d. Our movement is limited. The reason is stated in available features last paragraph. You can press cast rays button to generate an image and view it. If you launch main.html and do not see anything on your screen, please check issues just below and the next paragraph.

To view the initial scene and use the raycast function, you need to open a local server or otherwise chrome will block the image because of anonymous crosspath. You can open the project on VS Code and install Live Server extension and then open the main html with live server to view the scene. However, if this does not work, yo ucan still press ray cast button and observe the result.

TO VIEW OUR SCENE (IMPORTANT AS WE COULD NOT SHOW THIS ON THE DEMO ALTHOUGH SUPPORTED):

If an object is in front of an object and blocks the light, the shadow of this object would be cast on the behind object. We could not show this on the demo as we needed to create a scene accordingly. To view this effect, default scene is set so that when you press cast rays button, object on the right blocks directed light that has direction on +x, and the shape behind has a spherical shadow on it. This can be seen on the lines in main.js 38-39 (to really see that they are aligned). Default scene has only directed lights. To put on point lights, open Light.js file. Uncomment the lines 13-14-16-17. If you wish you can comment directed light. Enter the website and reload it, This time, you can see the pong, diffuse, reflection all together by pressing cast rays button again.


ISSUES:

In Talha's computer textures work fine and are displayed on the world space. However, In Cevat's computer, textures are broken (does not load) and due to this error you cannot see anything on the world space. We could not solve this bug. If you inspect your console and it says texture error, there is no way to view world space. However, ray casting is still functional as it is independent of world view. If you press ray cast button, the generated image will be displayed on a second canvas and you can see how shapes are ray casted.

AVAILABLE FEATURES:

We believe we have a ray caster that accomplishes required base functionalities. Our ray caster supports spheres, cubes, cones. Moreover, we have a distant light and point light sources for light illumination. We have 3 types of materials: reflective, pong and diffuse. You can set different material types in the code for the shapes to observe how they behave in the world. Depending on the material type, generated image changes. You can put shapes next to each other to intersect them to observe how they behave, again. By using Pong or diffuse materials, we have solid or shiny objects. We do not have any transparent material type. If an object is in front of another object, then the shadow of the first object that is closer to the light source will be reflected on the behind shape.

When ray cast finishes, we display the result on a second canvas and as a texture on a plane in the world space. We have a very simple skybox and standard texture implementation. However, ray casting does not support textures. We shade colors. For cube, we used face normals.

One thing you should be aware of the cone support is that our cone equation is x^2 + z^2 = y^2. We used infinite cone equation. We clipped the cone so that it has a height and it does not grow in the negative y direction. As a result cone is upside down only. We did not correct it due to time constraints. Our cubes consist of 6 triangles that are intersected with rays. Using this triangle support, any complex shape can be generated that would have a ray cast support. 

Our camera can only move forward, back, left or right. You cannot change camera rotation. This is because, once rotated, casted rays are going in directions they should not go. We could not implement a free-flow FPS camera for this reason. We can only transport rays according to the camera position. 


BONUSES:

WE DO NOT HAVE ANY BONUSES (such as bump mapping or transparent objects). In the code you can see a fourth type of material called refraction and reflection. We attempted to implement a transparent object but we failed. We have a toloid as a shape in the physical world. However, toloid is not supported by the ray caster as the intersection is a quadratic equation and due to time constraints, we could not find the time to implement ray cast support. 
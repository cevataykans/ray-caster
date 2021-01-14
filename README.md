# Ray Caster

I collaborated with my dear colleague [Talha Sen](https://github.com/talhasen123 "Talha's Github") to implement this project.

This project is an implementation of a very basic ray caster using WebGL and vanilla JS. This project allowed me to understand how ray casting works and why it could be more advantageous to render pipelines.

### Published At: [Take me to the web page!](https://cevataykans.github.io/ray-caster/ "Ray Caster")

## My Contributions

I was responsible for the ray caster itself. Firstly, I introduced casting rays by going from pixel coordinates to world coordinates. Next, I implemented primary rays and casted them for intersection test. Moreover, I added shapes for intersection test. Currently, the ray caster supports spheres, triangles and the infinite cone. By using triangles, any mesh can be ray casted (although it would take too long to calculate!). After ray-shape interaction test, I shaded the pixel by casting secondary rays (shadow and reflection, refraction is not supported). For this, I added 3 material types: pong, diffuse and reflective. Furthermore, I added point and distant light sources.

## How to Run

Enter src directory. Right click main.html. Choose your favorite web browser to launch the application. If project does not launch up, try changing your browser to Chrome. If you can see the world, you can click on the canvas and move with w a s d. Our movement is limited. The reason is stated in available features last paragraph. You can press cast rays button to generate an image and view it. If you launch main.html and do not see anything on your screen, please check issues just below and the next paragraph.

## Basic Demo

If an object is in front of an object and blocks the light, the shadow of this object would be cast on the behind object. To view this effect, default scene is set so that when you press cast rays button, object on the right blocks directed light that has direction on +x, and the shape behind has a spherical shadow on it. This can be seen on the lines in main.js 38-39 (to really see that they are aligned). Default scene has only directed lights. To put on point lights, open Light.js file. Uncomment the lines 13-14-16-17. If you wish you can comment directed light. Enter the website and reload it, This time, you can see the pong, diffuse, reflection all together by pressing cast rays button again.

## Issues

Originally, our project supported textures and featured a world scene. However, this created an issue for some users. As a result, I decided to remove textures and the world scene from this distribution. You may only observe ray casting which is implemented by me.

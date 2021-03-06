// http://devlog-martinsh.blogspot.com.es/2011/03/glsl-dithering.html

precision mediump float;

uniform sampler2D u_modVCanvas;
varying vec2 vUv;

uniform float scale;

float find_closest(int x, int y, float c0) {
	vec4 dither[4];

	dither[0] = vec4( 1.0, 33.0, 9.0, 41.0);
	dither[1] = vec4(49.0, 17.0, 57.0, 25.0);
	dither[2] = vec4(13.0, 45.0, 5.0, 37.0);
	dither[3] = vec4(61.0, 29.0, 53.0, 21.0);

	float limit = 0.0;
	// GLSL array index must be constant
	if(x == 0 && y == 0) limit = (dither[0][0]+1.0)/64.0;
	if(x == 0 && y == 1) limit = (dither[0][1]+1.0)/64.0;
	if(x == 0 && y == 2) limit = (dither[0][2]+1.0)/64.0;
	if(x == 0 && y == 3) limit = (dither[0][3]+1.0)/64.0;

	if(x == 1 && y == 0) limit = (dither[1][0]+1.0)/64.0;
	if(x == 1 && y == 1) limit = (dither[1][1]+1.0)/64.0;
	if(x == 1 && y == 2) limit = (dither[1][2]+1.0)/64.0;
	if(x == 1 && y == 3) limit = (dither[1][3]+1.0)/64.0;

	if(x == 2 && y == 0) limit = (dither[2][0]+1.0)/64.0;
	if(x == 2 && y == 1) limit = (dither[2][1]+1.0)/64.0;
	if(x == 2 && y == 2) limit = (dither[2][2]+1.0)/64.0;
	if(x == 2 && y == 3) limit = (dither[2][3]+1.0)/64.0;

	if(x == 3 && y == 0) limit = (dither[3][0]+1.0)/64.0;
	if(x == 3 && y == 1) limit = (dither[3][1]+1.0)/64.0;
	if(x == 3 && y == 2) limit = (dither[3][2]+1.0)/64.0;
	if(x == 3 && y == 3) limit = (dither[3][3]+1.0)/64.0;


	if(c0 < limit) {
		return 0.0;
	} else {
		return 1.0;
	}
}

void main() {

	vec2 uv = vUv;

	vec4 lum = vec4(0.299, 0.587, 0.114, 0.0);
	float grayscale = dot(texture2D(u_modVCanvas, uv), lum);
	vec3 rgb = texture2D(u_modVCanvas, uv).rgb;

	vec2 xy = gl_FragCoord.xy * scale;
	int x = int(mod(xy.x, 4.0));
	int y = int(mod(xy.y, 4.0));

	vec3 finalRGB;

	finalRGB.r = find_closest(x, y, rgb.r);
	finalRGB.g = find_closest(x, y, rgb.g);
	finalRGB.b = find_closest(x, y, rgb.b);

	float final = find_closest(x, y, grayscale);

	gl_FragColor = vec4(finalRGB, texture2D(u_modVCanvas, uv).a);
}
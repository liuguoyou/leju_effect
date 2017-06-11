#define GLSLIFY 1
varying vec4 coord;
varying vec4 compositeCoord;

uniform float feather;
uniform float invert;
uniform float angle;
uniform vec2 position;
uniform vec2 size;
uniform float opacity;
uniform float alpha;

uniform sampler2D texture;
uniform vec2 imgSize;

float random(vec3 scale, float seed) {
    /* use the fragment position for a different seed per-pixel */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main() {
  vec4 col = texture2D(texture, coord.xy);
  float blur = min(1.0 - feather, 0.990);
  float rads = radians(angle);
  float s = sin(rads);
  float c = cos(rads);

    vec2 coords = (compositeCoord.xy - 0.5 - position) * imgSize;
    coords = (vec2(
      coords.x * c - coords.y * s,
    coords.x * s + coords.y * c
  ) / imgSize + position) / size;

    vec2 offset = 1.0 + (1.0 - vec2(feather));
  float dist = distance(coords * offset, position / size * offset);
  dist += random(vec3(12.9898, 78.233, 151.7182), 1.0)/50.0 * (1.0 - blur);

  float mask = smoothstep(1.0, blur, dist);

  if (invert > 0.0) mask = 1.0 - mask;

  float a = clamp(col.a * alpha + mask * opacity, 0.0, 1.0);
    gl_FragColor = vec4(col.rgb, a);
}
export const pointVert = /* glsl */ `
attribute float aSize;
attribute float aAlpha;
attribute float aRing;
attribute vec3 aColor;
uniform float uPixelRatio;
varying float vAlpha;
varying float vRing;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp(-mv.z, 1.0, 20.0);
  gl_PointSize = aSize * uPixelRatio * (9.0 / depth);
  vAlpha = aAlpha; vRing = aRing; vColor = aColor;
}`;

export const pointFrag = /* glsl */ `
precision highp float;
varying float vAlpha;
varying float vRing;
varying vec3 vColor;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float disc = 1.0 - smoothstep(0.30, 0.46, d);
  float ang = atan(p.x, -p.y);
  float frac = (ang + 3.14159265) / 6.2831853;
  float ringMask = smoothstep(0.70, 0.76, d) - smoothstep(0.88, 0.94, d);
  float arc = step(frac, vRing) * ringMask;
  float a = max(disc, arc * 0.85) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

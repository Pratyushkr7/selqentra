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
  vAlpha = aAlpha;
  vRing = aRing;
  vColor = aColor;
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
  // confidence ring: an arc whose length is proportional to vRing, drawn clockwise from the top
  float ang = atan(p.x, -p.y);          // -PI..PI, 0 at top
  float frac = (ang + 3.14159265) / 6.2831853;
  float ringMask = smoothstep(0.70, 0.76, d) - smoothstep(0.88, 0.94, d);
  float arc = step(frac, vRing) * ringMask;
  float a = max(disc, arc * 0.85) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

export const lineVert = /* glsl */ `
attribute float aT;      // 0 at record end, 1 at node end
attribute float aDraw;   // per-line draw progress
attribute float aStale;
attribute float aAlpha;
varying float vT;
varying float vDraw;
varying float vStale;
varying float vAlpha;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vT = aT; vDraw = aDraw; vStale = aStale; vAlpha = aAlpha;
}`;

export const lineFrag = /* glsl */ `
precision highp float;
uniform vec3 uCobalt;
uniform vec3 uSteel;
uniform vec3 uCyan;
uniform float uRecency;
varying float vT;
varying float vDraw;
varying float vStale;
varying float vAlpha;
void main() {
  if (vT > vDraw) discard;
  float head = smoothstep(vDraw - 0.08, vDraw, vT);
  vec3 c = mix(uCobalt, uCyan, head * 0.6);
  float staleMix = vStale * uRecency;
  c = mix(c, uSteel, staleMix);
  float a = (0.26 - staleMix * 0.16) * vAlpha;
  gl_FragColor = vec4(c, a);
}`;

export const planeVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

export const planeFrag = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;
void main(){
  vec2 g = abs(fract(vUv * vec2(14.0, 8.0)) - 0.5);
  float line = 1.0 - smoothstep(0.47, 0.5, max(g.x, g.y));
  float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(0.0, 0.18, 1.0 - vUv.x) * smoothstep(0.0, 0.25, vUv.y) * smoothstep(0.0, 0.25, 1.0 - vUv.y);
  float a = (line * 0.28 + 0.03) * edge * uOpacity;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`;

export const nodeVert = /* glsl */ `
attribute float aAlpha;
uniform float uPixelRatio;
varying float vAlpha;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = 16.0 * uPixelRatio * (9.0 / clamp(-mv.z, 1.0, 20.0));
  vAlpha = aAlpha;
}`;

export const nodeFrag = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main(){
  vec2 p = abs(gl_PointCoord - 0.5) * 2.0;
  float dia = p.x + p.y;                 // diamond
  float outer = 1.0 - smoothstep(0.78, 0.9, dia);
  float inner = 1.0 - smoothstep(0.42, 0.5, dia);
  float a = (outer - inner * 0.55) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}`;

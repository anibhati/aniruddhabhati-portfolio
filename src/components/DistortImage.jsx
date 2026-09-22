import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * 0.5 + 0.5;
  v.y = 1.0 - v.y;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D tex;
uniform vec2 mouse;
uniform float hover;
uniform float time;
uniform vec2 res;
uniform vec2 img;
void main() {
  // object-fit: cover
  vec2 s = res / img;
  float sc = max(s.x, s.y);
  vec2 size = img * sc;
  vec2 uv = (v * res + (size - res) * 0.5) / size;

  vec2 dir = v - mouse;
  float d = length(dir * vec2(res.x / res.y, 1.0));
  float w = smoothstep(0.45, 0.0, d) * hover;
  uv += normalize(dir + 1e-5) * w * 0.02 * sin(d * 28.0 - time * 5.0);

  float a = 0.008 * w;
  gl_FragColor = vec4(
    texture2D(tex, uv + vec2(a, 0.0)).r,
    texture2D(tex, uv).g,
    texture2D(tex, uv - vec2(a, 0.0)).b,
    1.0
  );
}`;

export default function DistortImage({ src, alt, className = "" }) {
  const canvas = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    const gl = c && c.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) {
      setFallback(true);
      return;
    }

    const shader = (type, text) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, text);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const U = { mouse: u("mouse"), hover: u("hover"), time: u("time"), res: u("res"), img: u("img") };

    const image = new Image();
    const state = { hover: 0, hoverTo: 0, m: [0.5, 0.5], mTo: [0.5, 0.5], start: performance.now() };
    let raf = 0;
    let ready = false;
    let disposed = false;

    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, c.width, c.height);
    };
    const draw = () => {
      if (!ready) return;
      gl.uniform2f(U.res, c.width, c.height);
      gl.uniform2f(U.img, image.naturalWidth, image.naturalHeight);
      gl.uniform2f(U.mouse, state.m[0], state.m[1]);
      gl.uniform1f(U.hover, state.hover);
      gl.uniform1f(U.time, (performance.now() - state.start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    // only animate while hovered or easing out, so idle photos cost nothing
    const loop = () => {
      state.hover += (state.hoverTo - state.hover) * 0.08;
      state.m[0] += (state.mTo[0] - state.m[0]) * 0.15;
      state.m[1] += (state.mTo[1] - state.m[1]) * 0.15;
      draw();
      if (state.hoverTo > 0 || state.hover > 0.002) raf = requestAnimationFrame(loop);
      else {
        state.hover = 0;
        draw();
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      state.mTo = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    const onEnter = () => {
      state.hoverTo = 1;
      kick();
    };
    const onLeave = () => {
      state.hoverTo = 0;
      kick();
    };

    image.onload = () => {
      if (disposed) return;
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      ready = true;
      resize();
      draw();
    };
    image.onerror = () => !disposed && setFallback(true);
    image.src = src;

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(c);

    const interactive =
      window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (interactive) {
      c.addEventListener("pointermove", onMove);
      c.addEventListener("pointerenter", onEnter);
      c.addEventListener("pointerleave", onLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerenter", onEnter);
      c.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src]);

  if (fallback) return <Photo src={src} alt={alt} className={className} label={`Add ${src}`} />;
  return <canvas ref={canvas} className={className} role="img" aria-label={alt} />;
}

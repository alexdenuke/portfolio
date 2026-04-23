"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

const vertexShader = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) { \
  int index = 0; \
  for (int i = 0; i < 2; i++) { \
     ColorStop currentColor = colors[i]; \
     bool isInBetween = currentColor.position <= factor; \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  } \
  ColorStop currentColor = colors[index]; \
  ColorStop nextColor = colors[index + 1]; \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.54);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.1 + uTime * 0.08, uTime * 0.22)) * 0.46 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.18);
  float intensity = 0.58 * height;

  float midPoint = 0.18;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function colorToRgbTuple(hex: string) {
  const color = new Color(hex);

  return [color.r, color.g, color.b];
}

export function HeroAuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(max-width: 1023px)");

    let frameId = 0;
    let isVisible = true;
    let isReducedMotion = reducedMotionQuery.matches;
    let isMobile = mobileQuery.matches;
    let isTablet = tabletQuery.matches;

    const renderer = new Renderer({
      alpha: true,
      antialias: !isMobile,
      premultipliedAlpha: true,
      dpr: 1,
    });
    const { gl } = renderer;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = "block h-full w-full";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const desktopStops = ["#081013", "#0c7b63", "#6ef0bf"];
    const mobileStops = ["#071012", "#0a5f4c", "#59d8ab"];

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0.82 },
        uBlend: { value: 0.72 },
        uResolution: { value: [1, 1] },
        uColorStops: {
          value: desktopStops.map(colorToRgbTuple),
        },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const syncQuality = () => {
      isMobile = mobileQuery.matches;
      isTablet = tabletQuery.matches;

      renderer.dpr = Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1 : isTablet ? 1.25 : 1.6,
      );

      program.uniforms.uAmplitude.value = isMobile ? 0.58 : isTablet ? 0.68 : 0.82;
      program.uniforms.uBlend.value = isMobile ? 0.92 : 0.78;
      program.uniforms.uColorStops.value = (isMobile ? mobileStops : desktopStops).map(
        colorToRgbTuple,
      );
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const renderScale = isMobile ? 0.72 : isTablet ? 0.84 : 1;

      renderer.setSize(width * renderScale, height * renderScale);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      renderer.render({ scene: mesh });
    };

    const renderFrame = (time: number) => {
      program.uniforms.uTime.value = time;
      renderer.render({ scene: mesh });
    };

    const loop = (time: number) => {
      if (!isVisible || isReducedMotion) {
        return;
      }

      renderFrame(time * 0.01);
      frameId = window.requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (frameId || isReducedMotion || !isVisible) {
        return;
      }

      frameId = window.requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (!frameId) {
        return;
      }

      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const handleMotionChange = () => {
      isReducedMotion = reducedMotionQuery.matches;

      if (isReducedMotion) {
        stopLoop();
        renderFrame(24);
        return;
      }

      startLoop();
    };

    const handleQualityChange = () => {
      syncQuality();
      resize();
      startLoop();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;

        if (!isVisible) {
          stopLoop();
          return;
        }

        startLoop();
      },
      { threshold: 0.08 },
    );
    intersectionObserver.observe(container);

    reducedMotionQuery.addEventListener("change", handleMotionChange);
    mobileQuery.addEventListener("change", handleQualityChange);
    tabletQuery.addEventListener("change", handleQualityChange);

    syncQuality();
    resize();

    if (isReducedMotion) {
      renderFrame(24);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleQualityChange);
      tabletQuery.removeEventListener("change", handleQualityChange);

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="h-full w-full" />;
}

import * as THREE from "three";

export type EarthMaps = {
  day: THREE.CanvasTexture;
  night: THREE.CanvasTexture;
  clouds: THREE.CanvasTexture;
};

const WIDTH = 768;
const HEIGHT = 384;

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function fade(t: number) {
  return t * t * (3 - 2 * t);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let octave = 0; octave < 5; octave += 1) {
    value += amplitude * noise(x * frequency, y * frequency);
    frequency *= 2;
    amplitude *= 0.5;
  }
  return value;
}

function canvasTexture(
  width: number,
  height: number,
  paint: (data: Uint8ClampedArray) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create Earth texture context");
  }
  const image = context.createImageData(width, height);
  paint(image.data);
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createEarthMaps(): EarthMaps {
  const day = canvasTexture(WIDTH, HEIGHT, (data) => {
    for (let y = 0; y < HEIGHT; y += 1) {
      const v = y / HEIGHT;
      const latitude = Math.abs(v - 0.5) * 2;
      for (let x = 0; x < WIDTH; x += 1) {
        const u = x / WIDTH;
        const warpX = fbm(u * 2.2, v * 3.4);
        const warpY = fbm(u * 2.2 + 5.2, v * 3.4 + 1.3);
        const elevation = fbm(u * 3.1 + warpX * 1.15, v * 5.4 + warpY * 1.15);
        const ice = latitude > 0.82 || (latitude > 0.72 && elevation > 0.48);
        const land = elevation > 0.55 && latitude < 0.9;
        const index = (y * WIDTH + x) * 4;

        let r = 8;
        let g = 28;
        let b = 52;
        const depth = fbm(u * 8, v * 8);
        r += depth * 10;
        g += depth * 18;
        b += depth * 22;

        if (land) {
          const arid = fbm(u * 7 + 2, v * 7);
          if (arid > 0.58) {
            r = 92;
            g = 84;
            b = 62;
          } else {
            r = 38;
            g = 68;
            b = 48;
          }
          r += (elevation - 0.55) * 40;
          g += (elevation - 0.55) * 28;
        }

        if (ice) {
          r = 214;
          g = 222;
          b = 228;
        }

        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }
  });

  const night = canvasTexture(WIDTH, HEIGHT, (data) => {
    for (let y = 0; y < HEIGHT; y += 1) {
      const v = y / HEIGHT;
      const latitude = Math.abs(v - 0.5) * 2;
      for (let x = 0; x < WIDTH; x += 1) {
        const u = x / WIDTH;
        const elevation = fbm(u * 3.1 + fbm(u * 2.2, v * 3.4) * 1.15, v * 5.4);
        const land = elevation > 0.56 && latitude < 0.78;
        const cluster = fbm(u * 18, v * 18);
        const index = (y * WIDTH + x) * 4;
        const light = land && cluster > 0.72 && hash(x * 0.37, y * 0.41) > 0.55;

        data[index] = light ? 196 : 0;
        data[index + 1] = light ? 168 : 0;
        data[index + 2] = light ? 120 : 0;
        data[index + 3] = 255;
      }
    }
  });

  const clouds = canvasTexture(WIDTH, HEIGHT, (data) => {
    for (let y = 0; y < HEIGHT; y += 1) {
      const v = y / HEIGHT;
      for (let x = 0; x < WIDTH; x += 1) {
        const u = x / WIDTH;
        const density = fbm(u * 4.5 + 8, v * 7.5);
        const index = (y * WIDTH + x) * 4;
        const alpha = Math.max(0, (density - 0.52) * 520);
        data[index] = 236;
        data[index + 1] = 240;
        data[index + 2] = 244;
        data[index + 3] = Math.min(180, alpha);
      }
    }
  });

  return { day, night, clouds };
}

export function disposeEarthMaps(maps: EarthMaps) {
  maps.day.dispose();
  maps.night.dispose();
  maps.clouds.dispose();
}

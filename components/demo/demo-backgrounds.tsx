"use client";

import {
  GrainGradient,
  MeshGradient,
  Warp,
  Dithering,
  Swirl,
  Waves,
  Voronoi,
  GodRays,
} from "@paper-design/shaders-react";

/**
 * Juno brand palette — all demo styles pull from these so screenshots stay
 * on-brand no matter which look you pick.
 *   primary  #3366FF   accent #33A9FF
 *   light bg #EDF2FF   dark bg #000000
 */
const C = {
  primary: "#3366FF",
  accent: "#33A9FF",
  blueMid: "#5b8aff",
  blueDeep: "#1a3a6b",
  blueLight: "#c2d9ff",
  paleBlue: "#c2d4ff",
  paper: "#EDF2FF",
  ink: "#000000",
  navy: "#060d1a",
  navy2: "#0a1628",
};

const fill = { height: "100%", width: "100%" } as const;

/**
 * Keep the WebGL drawing buffer around after each frame so the canvas can be
 * read back with toDataURL() — without this, downloads capture a blank canvas.
 */
const glAttrs = { preserveDrawingBuffer: true } as const;

export type DemoStyle = {
  id: string;
  name: string;
  blurb: string;
  /** preferred text colour over this background for the overlay */
  overlay: "light" | "dark";
  render: (dark: boolean) => React.ReactNode;
};

export const DEMO_STYLES: DemoStyle[] = [
  {
    id: "grain-corners",
    name: "Grain — Corners",
    blurb: "The About-page look. Soft grainy gradient pooling in the corners.",
    overlay: "dark",
    render: (dark) => (
      <GrainGradient
        style={fill}
        webGlContextAttributes={glAttrs}
        colorBack={dark ? C.navy : C.paleBlue}
        colors={
          dark
            ? [C.blueDeep, C.primary, C.accent]
            : [C.primary, C.blueMid, C.accent]
        }
        speed={0.3}
        softness={0.6}
        intensity={0.5}
        noise={0.2}
        shape="corners"
      />
    ),
  },
  {
    id: "grain-blob",
    name: "Grain — Blob",
    blurb: "Same grain engine, organic blob motion. Great for hero backdrops.",
    overlay: "light",
    render: (dark) => (
      <GrainGradient
        style={fill}
        webGlContextAttributes={glAttrs}
        colorBack={dark ? C.ink : C.paper}
        colors={
          dark
            ? [C.blueDeep, C.primary, C.accent]
            : [C.primary, C.accent, C.blueMid]
        }
        speed={0.4}
        softness={0.8}
        intensity={0.55}
        noise={0.25}
        shape="blob"
      />
    ),
  },
  {
    id: "mesh",
    name: "Mesh Gradient",
    blurb: "The Research-page look. Smooth flowing colour mesh.",
    overlay: "light",
    render: (dark) => (
      <MeshGradient
        style={fill}
        webGlContextAttributes={glAttrs}
        colors={
          dark
            ? [C.navy2, C.blueDeep, C.primary, C.accent]
            : [C.paper, C.primary, C.accent, C.blueLight]
        }
        speed={0.18}
        distortion={0.5}
        swirl={0.15}
      />
    ),
  },
  {
    id: "warp",
    name: "Warp — Ink",
    blurb: "Liquid noise fields warping through the palette. Premium, moody.",
    overlay: "light",
    render: (dark) => (
      <Warp
        style={fill}
        webGlContextAttributes={glAttrs}
        colors={
          dark
            ? [C.ink, C.blueDeep, C.primary, C.accent]
            : [C.paper, C.blueMid, C.primary, C.accent]
        }
        speed={0.35}
        proportion={0.4}
        softness={1}
        distortion={0.25}
        swirl={0.8}
        swirlIterations={10}
        scale={0.9}
      />
    ),
  },
  {
    id: "dithering",
    name: "Dithering — Retro",
    blurb: "Pixel-dither over a swirl. Matches the terminal / retro side art.",
    overlay: "light",
    render: (dark) => (
      <Dithering
        style={fill}
        webGlContextAttributes={glAttrs}
        colorBack={dark ? C.ink : C.paper}
        colorFront={dark ? C.accent : C.primary}
        shape="swirl"
        type="4x4"
        pxSize={2.5}
        speed={0.4}
        scale={0.9}
      />
    ),
  },
  {
    id: "swirl",
    name: "Swirl",
    blurb: "Concentric bands twisting from the centre. Bold, hypnotic.",
    overlay: "light",
    render: (dark) => (
      <Swirl
        style={fill}
        webGlContextAttributes={glAttrs}
        colorBack={dark ? C.ink : C.paper}
        colors={
          dark
            ? [C.blueDeep, C.primary, C.accent]
            : [C.primary, C.accent, C.blueLight]
        }
        twist={0.35}
        center={0.2}
        proportion={0.5}
        speed={0.4}
        scale={1.1}
      />
    ),
  },
  {
    id: "waves",
    name: "Waves",
    blurb: "Clean flowing line texture. Subtle, editorial, calm.",
    overlay: "dark",
    render: (dark) => (
      <Waves
        style={fill}
        webGlContextAttributes={glAttrs}
        colorFront={dark ? C.primary : C.primary}
        colorBack={dark ? C.navy : C.paper}
        shape={1}
        frequency={1.2}
        amplitude={0.5}
        spacing={0.7}
        proportion={0.45}
        rotation={20}
        scale={1}
      />
    ),
  },
  {
    id: "voronoi",
    name: "Voronoi",
    blurb: "Faceted cell pattern. Techy, structured, distinct.",
    overlay: "light",
    render: (dark) => (
      <Voronoi
        style={fill}
        webGlContextAttributes={glAttrs}
        colors={
          dark
            ? [C.navy2, C.blueDeep, C.primary, C.accent]
            : [C.paper, C.blueLight, C.primary, C.accent]
        }
        stepsPerColor={2}
        speed={0.3}
        scale={0.8}
      />
    ),
  },
  {
    id: "god-rays",
    name: "God Rays",
    blurb: "Light radiating from centre. Dramatic, aspirational.",
    overlay: "light",
    render: (dark) => (
      <GodRays
        style={fill}
        webGlContextAttributes={glAttrs}
        colorBack={dark ? C.ink : C.paper}
        colors={[C.primary, C.accent, C.blueMid]}
        midSize={0.3}
        speed={0.3}
      />
    ),
  },
];

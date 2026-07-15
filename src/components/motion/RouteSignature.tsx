"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Stop {
  x: number;
  y: number;
  label: string;
  sub: string;
}

const stops: Stop[] = [
  { x: 236, y: 133, label: "Tbilisi", sub: "Day 1" },
  { x: 165, y: 105, label: "Kutaisi", sub: "Day 2" },
  { x: 105, y: 121, label: "Batumi", sub: "Day 3" },
];

// Georgia's national border, simplified from real coordinates (equirectangular
// projection at ~42°N) and scaled to a 340x196 viewBox. Not hand-stylized -
// this is the actual outline at low vertex density.
const GEORGIA_SILHOUETTE =
  "M94.4,143.1 L100.9,118.1 L90,78.2 L64.9,56.6 L40.9,49.9 L25,31.9 L30.3,25 " +
  "L67,35 L130.9,44.5 L189.9,72.6 L197.5,83.4 L223.9,74.3 L264.3,86.5 " +
  "L277.6,110.5 L304.9,124.1 L293.6,132.2 L315,163.9 L309.1,170.7 " +
  "L285.7,167.3 L253.4,150.4 L242.7,160 L182.4,169.1 L140.6,140.4 Z";

// The full route is two cubic-bezier segments sharing an anchor at Kutaisi.
// Kept as separate strings (instead of one path) so each segment's length can
// be measured on its own - that's what lets the dots sync to where the line
// actually is, instead of a guessed time offset.
const SEGMENT_TBILISI_KUTAISI = "M236,133 C 210,125 190,110 165,105";
const SEGMENT_KUTAISI_BATUMI = "M165,105 C 145,101 122,108 105,121";
const ROUTE_PATH = `${SEGMENT_TBILISI_KUTAISI} C 145,101 122,108 105,121`;

interface RouteSignatureProps {
  className?: string;
  dark?: boolean;
}

export function RouteSignature({
  className,
  dark = true,
}: RouteSignatureProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const segmentRefs = useRef<[SVGPathElement | null, SVGPathElement | null]>([
    null,
    null,
  ]);
  const dotRefs = useRef<Array<SVGGElement | null>>([]);

  useEffect(() => {
    const path = pathRef.current;
    const [segment1, segment2] = segmentRefs.current;
    if (!path || !segment1 || !segment2) return;

    const length = path.getTotalLength();
    const dots = dotRefs.current.filter(Boolean) as SVGGElement[];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      gsap.set(dots, { opacity: 1, scale: 1 });
      return;
    }

    // Measure how far along the drawn line each stop actually sits, so the
    // dot for a stop only lights up once the line has reached it - Tbilisi at
    // 0%, Kutaisi at the shared-anchor point, Batumi at 100%.
    const segment1Length = segment1.getTotalLength();
    const segment2Length = segment2.getTotalLength();
    const totalLength = segment1Length + segment2Length;
    const stopFractions = [0, segment1Length / totalLength, 1];

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: "center" });

    const lineDuration = 1.8;
    const tl = gsap.timeline({ delay: 0.5, repeat: -1, repeatDelay: 1.6 });
    tl.to(path, {
      strokeDashoffset: 0,
      duration: lineDuration,
      ease: "power2.inOut",
    });
    dots.forEach((dot, i) => {
      tl.to(
        dot,
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" },
        stopFractions[i] * lineDuration,
      );
    });
    tl.to({}, { duration: 1.4 });
    tl.to([path], {
      strokeDashoffset: -length,
      duration: 0.6,
      ease: "power1.in",
    });
    tl.set(path, { strokeDashoffset: length });
    tl.set(dots, { opacity: 0, scale: 0.4 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 340 196"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <path
        d={GEORGIA_SILHOUETTE}
        fill={dark ? "rgba(255,255,255,0.06)" : "rgba(28,25,23,0.05)"}
        stroke={dark ? "rgba(245,183,0,0.35)" : "rgba(180,83,9,0.25)"}
        strokeWidth="1.5"
      />
      <path
        ref={pathRef}
        d={ROUTE_PATH}
        fill="none"
        stroke="#F5B700"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        ref={(el) => {
          segmentRefs.current[0] = el;
        }}
        d={SEGMENT_TBILISI_KUTAISI}
        fill="none"
        stroke="none"
        aria-hidden="true"
      />
      <path
        ref={(el) => {
          segmentRefs.current[1] = el;
        }}
        d={SEGMENT_KUTAISI_BATUMI}
        fill="none"
        stroke="none"
        aria-hidden="true"
      />
      {stops.map((stop, i) => (
        <g
          key={stop.label}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          transform={`translate(${stop.x}, ${stop.y})`}
        >
          <circle r="5.5" fill="#F5B700" stroke="#1c1917" strokeWidth="2" />
          <text
            x="11"
            y="-7"
            className={`text-[11px] font-semibold ${dark ? "fill-white" : "fill-stone-900"}`}
          >
            {stop.label}
          </text>
          <text
            x="11"
            y="7"
            className={`text-[9px] font-medium uppercase tracking-wide ${dark ? "fill-amber-200" : "fill-amber-700"}`}
          >
            {stop.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

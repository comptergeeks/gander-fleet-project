"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
    details: {
      model: string;
      plane_id: string;
      tail_number: string;
      location?: string;
      origin?: string;
      destination?: string;
    };
  }>;
  lineColor?: string;
}

export function WorldMap({ dots = [], lineColor = "#0ea5e9" }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const theme = "dark";

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const isMoving = (dot: MapProps["dots"][0]) => {
    return (
      Math.abs(dot.start.lat - dot.end.lat) > 0.01 ||
      Math.abs(dot.start.lng - dot.end.lng) > 0.01
    );
  };

  const handleMouseEnter = (
    point: { x: number; y: number },
    dot: MapProps["dots"][0],
    moving: boolean,
  ) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (point.x / 800) * rect.width;
    const y = (point.y / 400) * rect.height;

    const content = (
      <div className="bg-black/80 text-white p-2 rounded-lg shadow-lg text-sm">
        <div className="font-semibold">{dot.details.model}</div>
        <div>ID: {dot.details.plane_id}</div>
        <div>Tail: {dot.details.tail_number}</div>
        {moving ? (
          <div className="text-gray-300">
            {dot.details.origin} → {dot.details.destination}
          </div>
        ) : (
          <div className="text-gray-300">
            Location: {dot.details.location || "Unknown"}
          </div>
        )}
      </div>
    );

    setHoveredPoint({ x, y, content });
  };

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const moving = isMoving(dot);
          const dotColor = moving ? "#ef4444" : "#22c55e";

          return (
            <g key={`path-group-${i}`}>
              {moving && (
                <motion.path
                  d={createCurvedPath(startPoint, endPoint)}
                  fill="none"
                  stroke={dotColor}
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.5 * i,
                    ease: "easeOut",
                  }}
                />
              )}
              <g
                onMouseEnter={() => handleMouseEnter(startPoint, dot, moving)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={startPoint.x}
                  cy={startPoint.y}
                  r="2"
                  fill={dotColor}
                />
                <circle
                  cx={startPoint.x}
                  cy={startPoint.y}
                  r="2"
                  fill={dotColor}
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from="2"
                    to="8"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={startPoint.x}
                  cy={startPoint.y}
                  r="10"
                  fill="transparent"
                />
              </g>
              {moving && (
                <g
                  onMouseEnter={() => handleMouseEnter(endPoint, dot, moving)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="2"
                    fill={dotColor}
                  />
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="2"
                    fill={dotColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="8"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="10"
                    fill="transparent"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {hoveredPoint && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: hoveredPoint.x + 10,
            top: hoveredPoint.y - 10,
          }}
        >
          {hoveredPoint.content}
        </div>
      )}
    </div>
  );
}

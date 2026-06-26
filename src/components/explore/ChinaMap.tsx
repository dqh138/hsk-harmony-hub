import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid, geoBounds } from "d3-geo";
import geoData from "@/data/china-geo.json";
import { PROVINCE_BY_GEONAME, type Province } from "@/data/provinces";
import { cn } from "@/lib/utils";

type Props = {
  selectedId?: string;
  onSelect: (province: Province) => void;
};

type HoverInfo = {
  province: Province;
  x: number;
  y: number;
};

const ChinaMap = ({ selectedId, onSelect }: Props) => {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const geographies = useMemo(() => geoData as unknown as object, []);

  return (
    <div className="relative h-full w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 600, center: [104, 36] }}
        width={900}
        height={700}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6}>
          <Geographies geography={geographies}>
            {({ geographies: geos, projection }) =>
              geos.map((geo) => {
                const name = geo.properties?.name as string | undefined;
                const province = name ? PROVINCE_BY_GEONAME.get(name) : undefined;
                const isSelected = province?.id === selectedId;
                const isHovered = hover?.province.id === province?.id;

                // Compute label position + size from geo bbox
                const bounds = geoBounds(geo);
                const [[lng0, lat0], [lng1, lat1]] = bounds;
                const span = Math.max(lng1 - lng0, lat1 - lat0);
                const labelSize = Math.max(6, Math.min(15, span * 0.85));
                const centroidLngLat = geoCentroid(geo);
                const projected = projection(centroidLngLat);

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onMouseEnter={(evt) => {
                        if (!province) return;
                        setHover({ province, x: evt.clientX, y: evt.clientY });
                      }}
                      onMouseMove={(evt) => {
                        if (!province) return;
                        setHover({ province, x: evt.clientX, y: evt.clientY });
                      }}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => province && onSelect(province)}
                      style={{
                        default: {
                          fill: isSelected ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.18)",
                          stroke: "hsl(var(--primary) / 0.7)",
                          strokeWidth: 0.6,
                          outline: "none",
                          transition: "fill 150ms ease",
                        },
                        hover: {
                          fill: "hsl(var(--primary) / 0.55)",
                          stroke: "hsl(var(--accent))",
                          strokeWidth: 1.2,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "hsl(var(--primary))",
                          outline: "none",
                        },
                      }}
                      className={cn(isHovered && "drop-shadow-md")}
                    />
                    {province && projected && (
                      <g pointerEvents="none" transform={`translate(${projected[0]}, ${projected[1]})`}>
                        <text
                          textAnchor="middle"
                          dy="0.3em"
                          style={{
                            fontSize: labelSize,
                            fontWeight: 600,
                            fill: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                            paintOrder: "stroke",
                            stroke: "hsl(var(--background))",
                            strokeWidth: 2.5,
                            strokeLinejoin: "round",
                          }}
                        >
                          {province.nameCn}
                        </text>
                        {province.capital && province.capital !== province.nameCn && (
                          <text
                            textAnchor="middle"
                            dy="1.4em"
                            style={{
                              fontSize: Math.max(5, labelSize * 0.6),
                              fontWeight: 400,
                              fill: "hsl(var(--muted-foreground))",
                              paintOrder: "stroke",
                              stroke: "hsl(var(--background))",
                              strokeWidth: 2,
                              strokeLinejoin: "round",
                            }}
                          >
                            ★ {province.capital}
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span>{hover.province.emoji}</span>
            <span>{hover.province.nameCn}</span>
          </div>
          <div className="text-muted-foreground">{hover.province.nameVn}</div>
          {hover.province.capital && (
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              首府 {hover.province.capital} · {hover.province.capitalVn}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChinaMap;

"use client";

import type { LocationsLocations } from "@/graphql/generated/graphql";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

export default function LocationMap({ location, mapZoom = "15" }: LocationsLocations) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error("Missing Google Maps API key");
    return null;
  }

  const coordinates = location?.split(",").map(parseFloat) ?? [0, 0];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={{ lat: coordinates[0], lng: coordinates[1] }}
        defaultZoom={Number(mapZoom)}
        className="map-holder"
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "DEMO_MAP_ID"}
        streetViewControl={false}
        scaleControl={false}
        mapTypeControl={false}
        scrollwheel={false}
      >
        <AdvancedMarker position={{ lat: coordinates[0], lng: coordinates[1] }} />
      </Map>
    </APIProvider>
  );
}

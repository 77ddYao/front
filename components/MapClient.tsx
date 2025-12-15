'use client';

import { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

const AMAP_KEY = '2c2d7c99732a8cf2688ff0a58acedf0c';

export default function MapClient({ ships, trackData, mapView, onSelectShip }: any) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      const AMap = await AMapLoader.load({ key: AMAP_KEY, version: '2.0' });
      const map = new AMap.Map(mapRef.current!, { zoom: 10, center: [-80.18479, 25.77272] });

      if (mapView === 'satellite') map.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()]);

      // 添加船舶
      ships.forEach((ship: any) => {
        const marker = new AMap.Marker({ position: [ship.position.lng, ship.position.lat], title: ship.name, content: '🚢' });
        marker.on('click', () => onSelectShip(ship));
        marker.setMap(map);
      });

      // 绘制轨迹
      if (trackData?.length) {
        const polyline = new AMap.Polyline({ path: trackData.map((p: any) => [p.longitude, p.latitude]), strokeColor: '#3366FF', strokeWeight: 4 });
        polyline.setMap(map);
        map.setFitView([polyline]);
      }
    };

    initMap();
  }, [ships, trackData, mapView]);

  return <div ref={mapRef} className="w-full h-[500px]" />
}

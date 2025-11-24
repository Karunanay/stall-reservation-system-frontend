"use client";

import { Flex, Button } from "@radix-ui/themes";
import { MapContainer } from "./MapContainer";
import { OverviewMap } from "./OverviewMap";
import { generateStalls } from "@/utils/layoutGenerator";
import { useState, useMemo } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export function BookfairMap() {
  const [view, setView] = useState<'overview' | 'detail'>('overview');
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);

  // Generate data for 3 maps once and persist it
  const maps = useMemo(() => [1, 2, 3].map(id => ({
      id,
      stalls: generateStalls(id)
  })), []);

  const hallStats = useMemo(() => maps.map(map => ({
      id: map.id,
      total: map.stalls.length,
      available: map.stalls.filter((s: any) => s.status === 'available').length
  })), [maps]);

  const handleHallSelect = (hallId: number) => {
      setSelectedHallId(hallId);
      setView('detail');
  };

  const handleBack = () => {
      setView('overview');
      setSelectedHallId(null);
  };

  const selectedMap = maps.find(m => m.id === selectedHallId);

  return (
    <Flex direction="column" gap="2" width="100%" height="100%">
      {view === 'detail' && (
        <Button 
            variant="ghost" 
            onClick={handleBack} 
            style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
        >
            <ArrowLeftIcon /> Back to Overview
        </Button>
      )}

      <Flex style={{ flex: 1, minHeight: 0, width: '100%' }}>
        {view === 'overview' ? (
            <OverviewMap onHallSelect={handleHallSelect} hallStats={hallStats} />
        ) : (
            selectedMap && (
                <MapContainer mapId={selectedMap.id} stalls={selectedMap.stalls} />
            )
        )}
      </Flex>
    </Flex>
  );
}
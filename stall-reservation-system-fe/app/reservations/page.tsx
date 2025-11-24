"use client";

import { Flex, Text, Container, Box } from "@radix-ui/themes";
import { BookfairMap } from "@/components/BookfairMap";

export default function ReservationsPage() {
  return (
    <div style={{ height: 'calc(100vh - 65px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Container size="4" p="4" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Flex direction="column" align="center" gap="4" style={{ height: '100%' }}>
          <Flex direction="column" align="center" gap="2" style={{ flexShrink: 0 }}>
            <Text size="8" weight="bold">Stall Reservations</Text>
            <Text size="4" color="gray">Select a hall and stall to reserve</Text>
          </Flex>
          
          <Box style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <BookfairMap />
          </Box>
        </Flex>
      </Container>
    </div>
  );
}
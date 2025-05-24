import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Entity } from '@anduril-industries/lattice-sdk/src/anduril/entitymanager/v1/entity.pub_pb';

interface EntityDetailsProps {
  entity: Entity | undefined;
}

export function EntityDetails({ entity }: EntityDetailsProps): React.ReactElement | null {
  if (!entity) {
    return <p>No entity selected</p>;
  }

  return (
    <Card className="entity-details-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Entity Details
        </Typography>
        <Typography sx={{ mb: 1 }}>
          ID: {entity.entityId}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Name: {entity.aliases?.name ?? 'N/A'}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Latitude: {entity.location?.position?.latitudeDegrees?.toFixed(6) ?? 'N/A'}
        </Typography>
        <Typography>
          Longitude: {entity.location?.position?.longitudeDegrees?.toFixed(6) ?? 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
}

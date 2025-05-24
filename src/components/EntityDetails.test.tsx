import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EntityDetails } from './EntityDetails';
import { Entity } from '@anduril-industries/lattice-sdk/src/anduril/entitymanager/v1/entity.pub_pb';

// Mock Entity type for easier test data creation.
// Actual Entity fields might be optional due to protobuf generation.
type MockEntity = Partial<Entity> & {
  entityId: string; // Ensure entityId is always present for these tests
  aliases?: Partial<Entity['aliases']>;
  location?: Partial<Entity['location']> & {
    position?: Partial<Entity['location']['position']>;
  };
};


describe('EntityDetails Component', () => {
  it('renders placeholder text when no entity is provided', () => {
    render(<EntityDetails entity={undefined} />);
    expect(screen.getByText('No entity selected')).toBeInTheDocument();
  });

  const fullMockEntity: MockEntity = {
    entityId: 'test-id-123',
    aliases: { name: 'Test Entity Alpha' },
    location: {
      position: {
        latitudeDegrees: 34.052235,
        longitudeDegrees: -118.243683,
      },
    },
  };

  it('renders entity details when a full entity is provided', () => {
    render(<EntityDetails entity={fullMockEntity as Entity} />);
    expect(screen.getByText(`ID: ${fullMockEntity.entityId}`)).toBeInTheDocument();
    expect(screen.getByText(`Name: ${fullMockEntity.aliases!.name}`)).toBeInTheDocument();
    expect(screen.getByText('Latitude: 34.052235')).toBeInTheDocument();
    expect(screen.getByText('Longitude: -118.243683')).toBeInTheDocument();
  });

  const entityWithoutName: MockEntity = {
    entityId: 'test-id-456',
    location: {
      position: {
        latitudeDegrees: 35.123456,
        longitudeDegrees: -119.654321,
      },
    },
  };

  it('renders "N/A" for name if aliases.name is missing', () => {
    render(<EntityDetails entity={entityWithoutName as Entity} />);
    expect(screen.getByText(`ID: ${entityWithoutName.entityId}`)).toBeInTheDocument();
    expect(screen.getByText('Name: N/A')).toBeInTheDocument();
    expect(screen.getByText('Latitude: 35.123456')).toBeInTheDocument();
    expect(screen.getByText('Longitude: -119.654321')).toBeInTheDocument();
  });
  
  const entityWithoutAliases: MockEntity = {
    entityId: 'test-id-456-no-aliases',
    location: {
      position: {
        latitudeDegrees: 35.123456,
        longitudeDegrees: -119.654321,
      },
    },
  };

  it('renders "N/A" for name if aliases object itself is missing', () => {
    render(<EntityDetails entity={entityWithoutAliases as Entity} />);
    expect(screen.getByText(`ID: ${entityWithoutAliases.entityId}`)).toBeInTheDocument();
    expect(screen.getByText('Name: N/A')).toBeInTheDocument();
  });


  const entityWithoutLocation: MockEntity = {
    entityId: 'test-id-789',
    aliases: { name: 'Test Entity Beta' },
  };

  it('renders "N/A" for latitude and longitude if location is missing', () => {
    render(<EntityDetails entity={entityWithoutLocation as Entity} />);
    expect(screen.getByText(`ID: ${entityWithoutLocation.entityId}`)).toBeInTheDocument();
    expect(screen.getByText(`Name: ${entityWithoutLocation.aliases!.name}`)).toBeInTheDocument();
    expect(screen.getByText('Latitude: N/A')).toBeInTheDocument();
    expect(screen.getByText('Longitude: N/A')).toBeInTheDocument();
  });

  const entityWithoutPosition: MockEntity = {
    entityId: 'test-id-000',
    aliases: { name: 'Test Entity Gamma' },
    location: {}, // Location object exists, but no position
  };

  it('renders "N/A" for latitude and longitude if location.position is missing', () => {
    render(<EntityDetails entity={entityWithoutPosition as Entity} />);
    expect(screen.getByText(`ID: ${entityWithoutPosition.entityId}`)).toBeInTheDocument();
    expect(screen.getByText(`Name: ${entityWithoutPosition.aliases!.name}`)).toBeInTheDocument();
    expect(screen.getByText('Latitude: N/A')).toBeInTheDocument();
    expect(screen.getByText('Longitude: N/A')).toBeInTheDocument();
  });
  
  const entityWithNullPositionFields: MockEntity = {
    entityId: 'test-id-nulls',
    aliases: { name: 'Test Entity Delta' },
    location: {
      position: {
        latitudeDegrees: undefined, // Explicitly undefined
        longitudeDegrees: null as any, // Explicitly null (cast to any to bypass strict null checks if needed for mock)
      },
    },
  };

  it('renders "N/A" for latitude and longitude if their values are null/undefined', () => {
    render(<EntityDetails entity={entityWithNullPositionFields as Entity} />);
    expect(screen.getByText('Latitude: N/A')).toBeInTheDocument();
    expect(screen.getByText('Longitude: N/A')).toBeInTheDocument();
  });

});

// Basic setup comment for Vitest (if not already configured):
// 1. Install Vitest and testing-library:
//    `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event`
//    or
//    `yarn add --dev vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event`
// 2. Configure Vite (`vite.config.ts` or `vite.config.js`):
//    /// <reference types="vitest" />
//    import { defineConfig } from 'vite';
//    import react from '@vitejs/plugin-react';
//
//    export default defineConfig({
//      plugins: [react()],
//      test: {
//        globals: true,
//        environment: 'jsdom',
//        setupFiles: './src/setupTests.ts', // Optional setup file
//      },
//    });
// 3. Create a setup file (e.g., `src/setupTests.ts`) (Optional):
//    import '@testing-library/jest-dom';
// 4. Add test script to `package.json`:
//    "scripts": {
//      "test": "vitest",
//      "coverage": "vitest run --coverage"
//    }
// Note: `@testing-library/jest-dom` provides custom matchers like `toBeInTheDocument`.
// Ensure `jsdom` is installed for a browser-like environment.
// The `MockEntity` type helps in creating test data and ensuring type safety.
// The `as Entity` cast is used because `Partial<Entity>` isn't strictly `Entity`.
// For protobufs, fields are often optional, so `Partial` is a good fit for mocks.

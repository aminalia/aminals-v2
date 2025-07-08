# CLAUDE.md - Frontend

This file provides specific guidance for working with the Aminals frontend application.

## Frontend Overview

The frontend is a Next.js application that provides the user interface for interacting with the Aminals decentralized pet platform. It connects to Ethereum via wagmi/viem and queries blockchain data through The Graph Protocol.

## Architecture

### Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI component library
- **wagmi/viem**: Ethereum interaction library
- **RainbowKit**: Wallet connection UI
- **TanStack Query**: Data fetching and caching
- **The Graph Protocol**: Blockchain data indexing

### Key Dependencies

- `wagmi`: Ethereum interactions and contract calls
- `@tanstack/react-query`: Data fetching, caching, and state management
- `@rainbow-me/rainbowkit`: Wallet connection interface
- `@graphprotocol/client-cli`: GraphQL client for The Graph
- `@radix-ui/themes`: UI component library
- `lucide-react`: Icon library

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run prettier:fix

# Generate contract types from ABIs
npm run wagmi:generate

# Build GraphQL client
npm run graphclient:build
```

## File Structure

### Pages (`/pages`)

- `index.tsx`: Home page with Aminals grid
- `aminals/[id].tsx`: Individual Aminal detail page
- `breeding/`: Breeding auction pages
- `genes/`: Gene NFT pages
- `leaderboard/`: Aminal leaderboard
- `about.tsx`: About page

### Components (`/src/components`)

#### Action Components (`/actions`)
- `breed-button.tsx`: Breeding functionality
- `call-skill-button.tsx`: Execute Aminal skills
- `feed-button.tsx`: Feed Aminals (increase energy)
- `vote-button.tsx`: Voting on proposals
- `endauction-button.tsx`: End breeding auctions

#### UI Components
- `aminal-card.tsx`: Individual Aminal display
- `aminal-grid.tsx`: Grid layout for Aminals
- `gene-card.tsx`: Gene NFT display
- `auction-card.tsx`: Breeding auction display
- `trait-selector.tsx`: Trait selection interface
- `countdown-timer.tsx`: Auction countdown display

#### Base UI (`/ui`)
- Reusable components based on Radix UI
- `button.tsx`, `card.tsx`, `input.tsx`, etc.

### Resources (`/src/resources`)

Data fetching layer with TanStack Query hooks:

- `aminals.ts`: Aminal data queries
- `auctions.ts`: Breeding auction data
- `genes.ts`: Gene NFT data
- `skills.ts`: Skill system data
- `*.graphql`: GraphQL query definitions

### Contracts (`/src/contracts`)

- `generated.ts`: Auto-generated contract types from wagmi

## Key Patterns

### Data Fetching

Uses TanStack Query for all data fetching:

```typescript
// Example from aminals.ts
export const useAminals = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
) => {
  return useQuery<Aminal[]>({
    queryKey: [BASE_KEY, filter, sort, userAddress],
    queryFn: async () => {
      const response = await execute(AminalsListDocument, {
        first: 100,
        skip: 0,
        address: userAddress,
      });
      // Process and return data
    },
  });
};
```

### Contract Interactions

Uses wagmi hooks for blockchain interactions:

```typescript
// Example pattern
const { writeContract, isPending } = useWriteContract();

const handleAction = () => {
  writeContract({
    address: contractAddress,
    abi: aminalAbi,
    functionName: 'someFunction',
    args: [arg1, arg2],
  });
};
```

### Component Structure

Components follow a consistent pattern:
- Props interface definition
- Main component with hooks
- Event handlers
- JSX return with Tailwind styling

## Important Notes

### Contract Address Management

- Factory address is hardcoded in `wagmi.config.ts`
- Individual Aminal contract addresses are dynamic
- Contract addresses are environment-specific (currently Sepolia)

### GraphQL Integration

- GraphQL client is auto-generated from schema
- Queries are defined in `.graphql` files
- Execute function is imported from `.graphclient`

### State Management

- React Query handles server state
- Local state uses React hooks
- Wallet state managed by wagmi/RainbowKit

### Styling

- Tailwind CSS for utility classes
- Radix UI for accessible components
- Custom CSS in `globals.css` for global styles

## Development Workflow

1. **Contract Changes**: Run `npm run wagmi:generate` to update types
2. **GraphQL Changes**: Run `npm run graphclient:build` to update client
3. **Development**: Use `npm run dev` for hot reloading
4. **Type Checking**: Run `npm run typecheck` before commits
5. **Linting**: Run `npm run lint` to check code quality

## Testing

Currently uses Next.js default testing setup. Tests should be added for:
- Component rendering
- Contract interaction flows
- Data fetching logic
- User interaction scenarios

## Deployment

The frontend is designed to be deployed on standard Next.js hosting platforms:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom Node.js server

## Integration Points

### Smart Contracts
- Connects to deployed contracts via wagmi
- Contract ABIs imported from `../out/` directory
- Addresses configured in `wagmi.config.ts`

### Graph Protocol
- Queries indexed blockchain data
- GraphQL schema defined in `/graph` directory
- Client auto-generated from schema

### Wallet Integration
- RainbowKit for wallet connection
- wagmi for contract interactions
- Supports multiple wallet providers
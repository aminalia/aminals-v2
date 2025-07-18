# CLAUDE.md - Frontend

This file provides specific guidance for working with the Aminals frontend application.

## Frontend Overview

The frontend is a Next.js application that provides the user interface for interacting with the Aminals decentralized pet platform. It connects to Ethereum via wagmi/viem and queries blockchain data through The Graph Protocol.

**Recent Refactoring**: The frontend has been refactored with a comprehensive design system, reusable components, and improved UX consistency.

## Architecture

### Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Headless UI component library
- **wagmi/viem**: Ethereum interaction library
- **RainbowKit**: Wallet connection UI
- **TanStack Query**: Data fetching and caching
- **The Graph Protocol**: Blockchain data indexing
- **Class Variance Authority (CVA)**: Component variant management

### Key Dependencies

- `wagmi`: Ethereum interactions and contract calls
- `@tanstack/react-query`: Data fetching, caching, and state management
- `@rainbow-me/rainbowkit`: Wallet connection interface
- `@graphprotocol/client-cli`: GraphQL client for The Graph
- `@radix-ui/themes`: UI component library
- `lucide-react`: Icon library
- `class-variance-authority`: Component variant system
- `tailwind-merge`: Tailwind class merging utility

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
- `aminal-card.tsx`: Individual Aminal display (refactored with design system)
- `aminal-grid.tsx`: Grid layout for Aminals
- `gene-card.tsx`: Gene NFT display
- `auction-card.tsx`: Breeding auction display
- `trait-selector.tsx`: Trait selection interface
- `countdown-timer.tsx`: Auction countdown display

#### Base UI (`/ui`)
- Enhanced components with design system integration
- `button.tsx`: Multiple variants (default, success, love, energy, feed, breed, skill)
- `badge.tsx`: Semantic color variants (success, warning, error, love, energy, neutral)
- `card.tsx`: Consistent card components
- `loading-spinner.tsx`: Loading states for different contexts
- `empty-state.tsx`: Standardized empty state components
- `filter-bar.tsx`: Reusable filter and sort interface
- `stats-grid.tsx`: Flexible statistics display component

### Design System (`/src/theme`)

- `tokens.ts`: Design tokens combining colors, spacing, typography
- `colors.ts`: Comprehensive color palette with semantic meanings
- `spacing.ts`: Spacing scale and layout tokens
- `typography.ts`: Typography scale and text styles
- `index.ts`: Theme system entry point

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

- **Design System**: Centralized design tokens in `/src/theme/`
- **Tailwind CSS**: Extended with custom design tokens
- **CSS Variables**: Used for consistent theming
- **Component Variants**: CVA (Class Variance Authority) for component variants
- **Radix UI**: Accessible headless components as foundation
- **Custom CSS**: Global styles and CSS variables in `globals.css`

## Development Workflow

1. **Contract Changes**: Run `npm run wagmi:generate` to update types
2. **GraphQL Changes**: Run `npm run graphclient:build` to update client
3. **Development**: Use `npm run dev` for hot reloading
4. **Type Checking**: Run `npm run typecheck` before commits
5. **Linting**: Run `npm run lint` to check code quality

## Design System Usage

### Using Design Tokens

```typescript
// Import design tokens
import { colors, spacing, typography } from '@/theme'

// Use in components
<div className="bg-love-100 text-love-700 p-4">
  Love-themed content
</div>

// Access tokens programmatically
const loveColor = colors.love[600]
```

### Component Variants

```typescript
// Button variants
<Button variant="feed" size="lg">Feed Aminal</Button>
<Button variant="breed" size="sm">Breed</Button>
<Button variant="skill">Use Skill</Button>

// Badge variants
<Badge variant="love">❤️ 15.2</Badge>
<Badge variant="energy">⚡ 8.5</Badge>
<Badge variant="success">Active</Badge>
```

### Reusable Components

```typescript
// Loading states
<PageLoadingSpinner />
<CardLoadingSpinner />
<ButtonLoadingSpinner />

// Empty states
<EmptyState icon="🐾" title="No Aminals found" description="..." />
<NoAminalsFound />
<NoGenesFound />

// Filter interface
<AminalsFilterBar
  activeFilter={filter}
  onFilterChange={setFilter}
  activeSort={sort}
  onSortChange={setSort}
  resultsCount={aminals.length}
/>
```

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

## Component Reusability

### AminalCard Component
The `AminalCard` component is designed to be reused across different pages:
- **Homepage**: Grid display of all Aminals
- **Gene Detail Page**: Shows Aminals that use a specific gene
- **Profile Page**: Shows user's Aminals
- **Breeding Page**: Shows breeding partners

### Consistent UX Patterns
- **Loading States**: Consistent loading indicators across the app
- **Empty States**: Standardized empty state messages with appropriate icons
- **Filter/Sort**: Reusable filter bar component for consistent interaction
- **Stats Display**: Flexible stats grid for different data types

### Design System Benefits
- **Consistency**: All components use the same color palette and spacing
- **Maintainability**: Changes to design tokens update the entire app
- **Accessibility**: Built-in focus states and ARIA labels
- **Performance**: Reduced CSS bundle size through utility classes
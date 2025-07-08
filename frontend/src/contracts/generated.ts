//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Aminal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_factory', internalType: 'address', type: 'address' },
      { name: '_momAddress', internalType: 'address', type: 'address' },
      { name: '_dadAddress', internalType: 'address', type: 'address' },
      {
        name: '_visuals',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_aminalIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_loveVRGDA', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'INITIAL_ENERGY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ENERGY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SKILL_COST',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_BREEDING_LOVE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_FEED_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminalIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'breedableWith',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'breeding',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct GeneRenderer.TokenURIParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'attributes', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'constructTokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dadAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [
      { name: '', internalType: 'contract AminalFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneFactory',
    outputs: [
      { name: '', internalType: 'contract GeneRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalId', internalType: 'uint256', type: 'uint256' }],
    name: 'generateAttributesList',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalVisualsByID',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEnergy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getLoveByUser',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getParents',
    outputs: [
      { name: 'mom', internalType: 'address', type: 'address' },
      { name: 'dad', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalLove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTreasuryBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVisuals',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'partner', internalType: 'address', type: 'address' }],
    name: 'isBreedableWith',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'lovePerUser',
    outputs: [{ name: 'love', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'loveVRGDA',
    outputs: [
      { name: '', internalType: 'contract AminalVRGDA', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'momAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'payout',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'partner', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setBreedableWith',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_breeding', internalType: 'bool', type: 'bool' }],
    name: 'setBreeding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'squeak',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'useSkill',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'visuals',
    outputs: [
      { name: 'backId', internalType: 'uint256', type: 'uint256' },
      { name: 'armId', internalType: 'uint256', type: 'uint256' },
      { name: 'tailId', internalType: 'uint256', type: 'uint256' },
      { name: 'earsId', internalType: 'uint256', type: 'uint256' },
      { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
      { name: 'faceId', internalType: 'uint256', type: 'uint256' },
      { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
      { name: 'miscId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'partner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'BreedableSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingEnergy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EnergyLost',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'loveGained',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'love',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energyGained',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeedAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LoveConsumed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'cost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
    ],
    name: 'SkillUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'love',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Squeak',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TreasuryTransferred',
  },
  { type: 'error', inputs: [], name: 'InsufficientEnergy' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InsufficientTreasury' },
  { type: 'error', inputs: [], name: 'NotEnoughEnergy' },
  { type: 'error', inputs: [], name: 'NotEnoughEther' },
  { type: 'error', inputs: [], name: 'NotEnoughLove' },
  { type: 'error', inputs: [], name: 'NotRegisteredSkill' },
  { type: 'error', inputs: [], name: 'SkillCallFailed' },
  { type: 'error', inputs: [], name: 'SkillNotSupported' },
  { type: 'error', inputs: [], name: 'TreasuryTransferFailed' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AminalFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_BREEDING_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_ENERGY_REQUIRED',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_LOVE_REQUIRED',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRAIT_CATEGORIES',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_BASE_PRICE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_LOGISTIC_ASYMPTOTE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_PRICE_DECAY',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_TIME_SCALE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'aminalsByIndex',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalOne', internalType: 'address', type: 'address' },
      { name: 'aminalTwo', internalType: 'address', type: 'address' },
    ],
    name: 'breedAminals',
    outputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneAuction',
    outputs: [
      { name: '', internalType: 'contract GeneAuction', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalByIndex',
    outputs: [
      { name: 'aminalAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAminalVisualsByAddress',
    outputs: [
      {
        name: 'visuals',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialAminalSpawned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_geneAuction', internalType: 'address', type: 'address' },
      { name: '_aminalProposals', internalType: 'address', type: 'address' },
      { name: '_genes', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAminal',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'loveVRGDA',
    outputs: [
      { name: '', internalType: 'contract AminalVRGDA', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposals',
    outputs: [
      { name: '', internalType: 'contract AminalProposals', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'parentOne', internalType: 'address', type: 'address' },
      { name: 'parentTwo', internalType: 'address', type: 'address' },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
    ],
    name: 'spawnAminal',
    outputs: [
      { name: 'childAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_visuals',
        internalType: 'struct IAminalStructs.Visuals[]',
        type: 'tuple[]',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'spawnInitialAminals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAminals',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'child',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'parentOne',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'parentTwo',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'backId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'armId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tailId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'earsId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'bodyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'faceId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'mouthId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'miscId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AminalSpawned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalOne',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'aminalTwo',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BreedAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
] as const

export const aminalFactoryAddress =
  '0x93Ac7da955FE0180a87Fa7A1197e572A3B0e7c82' as const

export const aminalFactoryConfig = {
  address: aminalFactoryAddress,
  abi: aminalFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneAuction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geneAuctionAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_Genes', internalType: 'address', type: 'address' },
      { name: '_geneRegistry', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GENE_REMOVAL_THRESHOLD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRAIT_CATEGORIES',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TREASURY_TRANSFER_PERCENTAGE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOTING_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminalFactory',
    outputs: [
      { name: '', internalType: 'contract IAminalFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminalsContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'auctionCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'auctions',
    outputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'geneIds', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'bulkVoteOnGenes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAuction',
    outputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneRegistry',
    outputs: [
      { name: '', internalType: 'contract GeneRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAuctionInfo',
    outputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'getCategoryVoting',
    outputs: [
      {
        name: '',
        internalType: 'struct GeneAuction.CategoryVoteInfo',
        type: 'tuple',
        components: [
          { name: 'highestVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'winningGeneId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'proposedGenes',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'tiedGenes', internalType: 'uint256[]', type: 'uint256[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGeneRemovalVotes',
    outputs: [
      { name: 'removalVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGeneVotes',
    outputs: [{ name: 'totalVotes', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getParentTraits',
    outputs: [
      {
        name: 'parentOneTraits',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
      {
        name: 'parentTwoTraits',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVote',
    outputs: [{ name: 'voteWeight', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVotedGene',
    outputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVotingPower',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'isVotingActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposeGene',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'settleAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_aminalsContract', internalType: 'address', type: 'address' },
      { name: '_aminalFactory', internalType: 'address', type: 'address' },
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteOnGene',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
      { name: 'voteWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteToRemoveGene',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'geneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
    ],
    name: 'BulkVoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GeneCreatorPayout',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GeneProposed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'voteWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GeneRemovalVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'GeneRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GeneVoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'aminalOne',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'aminalTwo',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
      {
        name: 'totalTreasuryTransferred',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingSettled',
  },
  { type: 'error', inputs: [], name: 'GeneAlreadyRemoved' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InvalidCategory' },
  { type: 'error', inputs: [], name: 'InvalidGene' },
  { type: 'error', inputs: [], name: 'NoVotingPower' },
  { type: 'error', inputs: [], name: 'OnlyAminals' },
  { type: 'error', inputs: [], name: 'VotingAlreadySettled' },
  { type: 'error', inputs: [], name: 'VotingNotActive' },
  { type: 'error', inputs: [], name: 'VotingNotEnded' },
] as const

export const geneAuctionAddress =
  '0xF391678A18693AD00bd6d0151563B160c28F8657' as const

export const geneAuctionConfig = {
  address: geneAuctionAddress,
  abi: geneAuctionAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geneRegistryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_geneNFT', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SVG_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_CREATION_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'createGene',
    outputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneCategories',
    outputs: [
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneCreators',
    outputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneNFT',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneRegistry',
    outputs: [{ name: 'isFromFactory', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneSVGs',
    outputs: [{ name: 'svg', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'svg', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'getGenesByCategory',
    outputs: [
      { name: 'geneIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    name: 'getGenesByCreator',
    outputs: [
      { name: 'geneIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidGene',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalGenesCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      { name: 'svg', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'GeneCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'error', inputs: [], name: 'EmptySVG' },
  { type: 'error', inputs: [], name: 'InsufficientFee' },
  { type: 'error', inputs: [], name: 'InvalidSVG' },
  { type: 'error', inputs: [], name: 'SVGTooLarge' },
] as const

export const geneRegistryAddress =
  '0xaB4F70c7D3dd3f34906592fe8096dBCd673fE65d' as const

export const geneRegistryConfig = {
  address: geneRegistryAddress,
  abi: geneRegistryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Genes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genesAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'aminalFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneRegistry',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'geneSVGs',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'geneVisualsCat',
    outputs: [
      {
        name: '',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'geneSVG', internalType: 'string', type: 'string' },
      {
        name: 'visualsCategory',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'geneRegistry_', internalType: 'address', type: 'address' },
    ],
    name: 'setRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalFactory_', internalType: 'address', type: 'address' },
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'geneRegistry',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RegistrySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Setup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'AlreadySetup' },
  { type: 'error', inputs: [], name: 'OnlyAminalsFactory' },
  { type: 'error', inputs: [], name: 'OnlyAminalsFactoryOrRegistry' },
  { type: 'error', inputs: [], name: 'OnlyNFTOwner' },
  { type: 'error', inputs: [], name: 'OnlyRegistry' },
] as const

export const genesAddress =
  '0x82d725b4809a9f7495318ef1395e0F8d27FCe7A2' as const

export const genesConfig = { address: genesAddress, abi: genesAbi } as const

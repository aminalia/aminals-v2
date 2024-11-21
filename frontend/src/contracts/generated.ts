import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Aminals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_visualsAuction', internalType: 'address', type: 'address' },
      { name: '_aminalProposals', internalType: 'address', type: 'address' },
      { name: '_genesNFT', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'yesNo', internalType: 'bool', type: 'bool' },
    ],
    name: '_vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'arm', internalType: 'string', type: 'string' }],
    name: 'addArm',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'background', internalType: 'string', type: 'string' }],
    name: 'addBackground',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'body', internalType: 'string', type: 'string' }],
    name: 'addBody',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'ear', internalType: 'string', type: 'string' }],
    name: 'addEar',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'face', internalType: 'string', type: 'string' }],
    name: 'addFace',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'misc', internalType: 'string', type: 'string' }],
    name: 'addMisc',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'mouth', internalType: 'string', type: 'string' }],
    name: 'addMouth',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tail', internalType: 'string', type: 'string' }],
    name: 'addTail',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalId', internalType: 'uint256', type: 'uint256' }],
    name: 'aminals',
    outputs: [
      { name: 'momId', internalType: 'uint256', type: 'uint256' },
      { name: 'dadId', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'energy', internalType: 'uint256', type: 'uint256' },
      { name: 'breeding', internalType: 'bool', type: 'bool' },
      { name: 'exists', internalType: 'bool', type: 'bool' },
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
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'arms',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'backgrounds',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'bodies',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalIdOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalIdTwo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'breedWith',
    outputs: [{ name: 'ret', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalId', internalType: 'uint256', type: 'uint256' },
      { name: 'skillAddress', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'callSkill',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'aminalId', internalType: 'uint256', type: 'uint256' },
      { name: 'skillAddress', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'callSkillInternal',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct NFTDescriptor.TokenURIParams',
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
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalIdOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalIdTwo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'disableBreedable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'ears',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'faces',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalId', internalType: 'uint256', type: 'uint256' }],
    name: 'feed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'generateAttributesList',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_image', internalType: 'string', type: 'string' },
      { name: '_attributes', internalType: 'string', type: 'string' },
    ],
    name: 'genericDataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genesNFT',
    outputs: [{ name: '', internalType: 'contract GenesNFT', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getAminalLoveByIdByUser',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalLoveTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getEnergy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'category', internalType: 'uint256', type: 'uint256' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVisuals',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastAminalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalId', internalType: 'uint256', type: 'uint256' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'loveDrivenPrice',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'miscs',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'mouths',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
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
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
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
    inputs: [
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'skillName', internalType: 'string', type: 'string' },
      { name: 'skillAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposeAddSkill',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'skillAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposeRemoveSkill',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'faddress', internalType: 'address', type: 'address' },
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeSkill',
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
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
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
      { name: 'id', internalType: 'uint256', type: 'uint256' },
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
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'breeding', internalType: 'bool', type: 'bool' },
    ],
    name: 'setBreeding',
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'skills',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'backId', internalType: 'uint256', type: 'uint256' },
      { name: 'armId', internalType: 'uint256', type: 'uint256' },
      { name: 'tailId', internalType: 'uint256', type: 'uint256' },
      { name: 'earsId', internalType: 'uint256', type: 'uint256' },
      { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
      { name: 'faceId', internalType: 'uint256', type: 'uint256' },
      { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
      { name: 'miscId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'spawnAminal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      { name: 'aminalId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tails',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
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
    type: 'function',
    inputs: [],
    name: 'visualsAuction',
    outputs: [
      { name: '', internalType: 'contract VisualsAuction', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalID', internalType: 'uint256', type: 'uint256' },
      { name: 'proposalID', internalType: 'uint256', type: 'uint256' },
      { name: 'yesNo', internalType: 'bool', type: 'bool' },
    ],
    name: 'voteSkill',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'skillName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'skillAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AddSkillProposal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
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
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
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
    name: 'FeedAminal',
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
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'skillAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RemoveSkillProposal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SkillAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SkillRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'yesNo', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SkillVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'mom', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'dad', internalType: 'uint256', type: 'uint256', indexed: true },
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
    name: 'SpawnAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
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
      {
        name: 'love',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Squeak',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'visualId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: false,
      },
      { name: 'svg', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TraitAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'AminalDoesNotExist' },
  { type: 'error', inputs: [], name: 'NotEnoughEther' },
  { type: 'error', inputs: [], name: 'NotSpawnable' },
] as const

export const aminalsAddress =
  '0xe8c32532c1599279a8016c7b3a5fc777f22c672c' as const

export const aminalsConfig = {
  address: aminalsAddress,
  abi: aminalsAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VisualsAuction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const visualsAuctionAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_generatornessSourceContract',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_generatornessSourceBalance',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GENERATOR_SOURCE_BALANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GENERATOR_SOURCE_CONTRACT',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminals',
    outputs: [{ name: '', internalType: 'contract Aminals', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'auctionCnt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'auctions',
    outputs: [
      { name: 'aminalIdOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalIdTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'childAminalId', internalType: 'uint256', type: 'uint256' },
      { name: 'ended', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'visualsIds', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'bulkVoteVisual',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'endAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionID', internalType: 'uint256', type: 'uint256' }],
    name: 'getAuctionByID',
    outputs: [
      {
        name: '',
        internalType: 'struct VisualsAuction.Auction',
        type: 'tuple',
        components: [
          { name: 'aminalIdOne', internalType: 'uint256', type: 'uint256' },
          { name: 'aminalIdTwo', internalType: 'uint256', type: 'uint256' },
          { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
          {
            name: 'visualIds',
            internalType: 'uint256[8][10]',
            type: 'uint256[8][10]',
          },
          {
            name: 'visualIdVotes',
            internalType: 'uint256[8][10]',
            type: 'uint256[8][10]',
          },
          {
            name: 'visualNoVotes',
            internalType: 'uint256[8][10]',
            type: 'uint256[8][10]',
          },
          { name: 'childAminalId', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerId', internalType: 'uint256[8]', type: 'uint256[8]' },
          { name: 'ended', internalType: 'bool', type: 'bool' },
        ],
      },
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
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'visualId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposeVisual',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'visualId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeVisual',
    outputs: [],
    stateMutability: 'payable',
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
    inputs: [{ name: '_aminals', internalType: 'address', type: 'address' }],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalIdOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalIdTwo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'startAuction',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'visualId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteVisual',
    outputs: [],
    stateMutability: 'payable',
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
        name: 'aminalIdOne',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'aminalIdTwo',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'childAminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'winningIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
    ],
    name: 'EndAuction',
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
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'visualId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'ProposeVisual',
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
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'visualId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'RemoveVisual',
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
        name: 'visualId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'userLoveVote',
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
    ],
    name: 'RemoveVisualVote',
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
        name: 'aminalIdOne',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'aminalIdTwo',
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
        name: 'visualIds',
        internalType: 'uint256[8][10]',
        type: 'uint256[8][10]',
        indexed: false,
      },
    ],
    name: 'StartAuction',
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
        name: 'visualId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'catEnum',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'userLoveVote',
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
    ],
    name: 'VisualsVote',
  },
] as const

export const visualsAuctionAddress =
  '0xe4d8c56167c6508588a84a64d9234bad238cd95b' as const

export const visualsAuctionConfig = {
  address: visualsAuctionAddress,
  abi: visualsAuctionAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__
 */
export const useReadAminals = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"aminals"`
 */
export const useReadAminalsAminals = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'aminals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"arms"`
 */
export const useReadAminalsArms = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'arms',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"backgrounds"`
 */
export const useReadAminalsBackgrounds = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'backgrounds',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadAminalsBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"bodies"`
 */
export const useReadAminalsBodies = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'bodies',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"constructTokenURI"`
 */
export const useReadAminalsConstructTokenUri =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'constructTokenURI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"dataURI"`
 */
export const useReadAminalsDataUri = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'dataURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"ears"`
 */
export const useReadAminalsEars = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'ears',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"faces"`
 */
export const useReadAminalsFaces = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'faces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"generateAttributesList"`
 */
export const useReadAminalsGenerateAttributesList =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'generateAttributesList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"genericDataURI"`
 */
export const useReadAminalsGenericDataUri = /*#__PURE__*/ createUseReadContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'genericDataURI' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"getAminalLoveByIdByUser"`
 */
export const useReadAminalsGetAminalLoveByIdByUser =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'getAminalLoveByIdByUser',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"getAminalLoveTotal"`
 */
export const useReadAminalsGetAminalLoveTotal =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'getAminalLoveTotal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"getAminalVisualsByID"`
 */
export const useReadAminalsGetAminalVisualsById =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'getAminalVisualsByID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"getEnergy"`
 */
export const useReadAminalsGetEnergy = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'getEnergy',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"getVisuals"`
 */
export const useReadAminalsGetVisuals = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'getVisuals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"lastAminalId"`
 */
export const useReadAminalsLastAminalId = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'lastAminalId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"loveDrivenPrice"`
 */
export const useReadAminalsLoveDrivenPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'loveDrivenPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"miscs"`
 */
export const useReadAminalsMiscs = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'miscs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"mouths"`
 */
export const useReadAminalsMouths = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'mouths',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"name"`
 */
export const useReadAminalsName = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAminalsOwner = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadAminalsOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"proposals"`
 */
export const useReadAminalsProposals = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"skills"`
 */
export const useReadAminalsSkills = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'skills',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAminalsSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadAminalsSymbol = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"tails"`
 */
export const useReadAminalsTails = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'tails',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadAminalsTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"visualsAuction"`
 */
export const useReadAminalsVisualsAuction = /*#__PURE__*/ createUseReadContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'visualsAuction' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__
 */
export const useWriteAminals = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"_vote"`
 */
export const useWriteAminalsVote = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: '_vote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addArm"`
 */
export const useWriteAminalsAddArm = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addArm',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addBackground"`
 */
export const useWriteAminalsAddBackground =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addBackground',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addBody"`
 */
export const useWriteAminalsAddBody = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addBody',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addEar"`
 */
export const useWriteAminalsAddEar = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addEar',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addFace"`
 */
export const useWriteAminalsAddFace = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addFace',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addMisc"`
 */
export const useWriteAminalsAddMisc = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addMisc',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addMouth"`
 */
export const useWriteAminalsAddMouth = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addMouth',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addTail"`
 */
export const useWriteAminalsAddTail = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'addTail',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteAminalsApprove = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"breedWith"`
 */
export const useWriteAminalsBreedWith = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'breedWith',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"callSkill"`
 */
export const useWriteAminalsCallSkill = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'callSkill',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"callSkillInternal"`
 */
export const useWriteAminalsCallSkillInternal =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'callSkillInternal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"disableBreedable"`
 */
export const useWriteAminalsDisableBreedable =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'disableBreedable',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"feed"`
 */
export const useWriteAminalsFeed = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'feed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"proposeAddSkill"`
 */
export const useWriteAminalsProposeAddSkill =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'proposeAddSkill',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"proposeRemoveSkill"`
 */
export const useWriteAminalsProposeRemoveSkill =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'proposeRemoveSkill',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"removeSkill"`
 */
export const useWriteAminalsRemoveSkill = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'removeSkill',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAminalsRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteAminalsSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteAminalsSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"setBreeding"`
 */
export const useWriteAminalsSetBreeding = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'setBreeding',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"spawnAminal"`
 */
export const useWriteAminalsSpawnAminal = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'spawnAminal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"spawnInitialAminals"`
 */
export const useWriteAminalsSpawnInitialAminals =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'spawnInitialAminals',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"squeak"`
 */
export const useWriteAminalsSqueak = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'squeak',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteAminalsTransferFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'transferFrom' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAminalsTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"voteSkill"`
 */
export const useWriteAminalsVoteSkill = /*#__PURE__*/ createUseWriteContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'voteSkill',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__
 */
export const useSimulateAminals = /*#__PURE__*/ createUseSimulateContract({
  abi: aminalsAbi,
  address: aminalsAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"_vote"`
 */
export const useSimulateAminalsVote = /*#__PURE__*/ createUseSimulateContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: '_vote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addArm"`
 */
export const useSimulateAminalsAddArm = /*#__PURE__*/ createUseSimulateContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'addArm' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addBackground"`
 */
export const useSimulateAminalsAddBackground =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addBackground',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addBody"`
 */
export const useSimulateAminalsAddBody =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addBody',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addEar"`
 */
export const useSimulateAminalsAddEar = /*#__PURE__*/ createUseSimulateContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'addEar' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addFace"`
 */
export const useSimulateAminalsAddFace =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addFace',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addMisc"`
 */
export const useSimulateAminalsAddMisc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addMisc',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addMouth"`
 */
export const useSimulateAminalsAddMouth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addMouth',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"addTail"`
 */
export const useSimulateAminalsAddTail =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'addTail',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateAminalsApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"breedWith"`
 */
export const useSimulateAminalsBreedWith =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'breedWith',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"callSkill"`
 */
export const useSimulateAminalsCallSkill =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'callSkill',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"callSkillInternal"`
 */
export const useSimulateAminalsCallSkillInternal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'callSkillInternal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"disableBreedable"`
 */
export const useSimulateAminalsDisableBreedable =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'disableBreedable',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"feed"`
 */
export const useSimulateAminalsFeed = /*#__PURE__*/ createUseSimulateContract({
  abi: aminalsAbi,
  address: aminalsAddress,
  functionName: 'feed',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"proposeAddSkill"`
 */
export const useSimulateAminalsProposeAddSkill =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'proposeAddSkill',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"proposeRemoveSkill"`
 */
export const useSimulateAminalsProposeRemoveSkill =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'proposeRemoveSkill',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"removeSkill"`
 */
export const useSimulateAminalsRemoveSkill =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'removeSkill',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAminalsRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateAminalsSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateAminalsSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"setBreeding"`
 */
export const useSimulateAminalsSetBreeding =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'setBreeding',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"spawnAminal"`
 */
export const useSimulateAminalsSpawnAminal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'spawnAminal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"spawnInitialAminals"`
 */
export const useSimulateAminalsSpawnInitialAminals =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'spawnInitialAminals',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"squeak"`
 */
export const useSimulateAminalsSqueak = /*#__PURE__*/ createUseSimulateContract(
  { abi: aminalsAbi, address: aminalsAddress, functionName: 'squeak' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateAminalsTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAminalsTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aminalsAbi}__ and `functionName` set to `"voteSkill"`
 */
export const useSimulateAminalsVoteSkill =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aminalsAbi,
    address: aminalsAddress,
    functionName: 'voteSkill',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__
 */
export const useWatchAminalsEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: aminalsAbi,
  address: aminalsAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"AddSkillProposal"`
 */
export const useWatchAminalsAddSkillProposalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'AddSkillProposal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"BreedAminal"`
 */
export const useWatchAminalsBreedAminalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'BreedAminal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"FeedAminal"`
 */
export const useWatchAminalsFeedAminalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'FeedAminal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAminalsInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAminalsOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"RemoveSkillProposal"`
 */
export const useWatchAminalsRemoveSkillProposalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'RemoveSkillProposal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"SkillAdded"`
 */
export const useWatchAminalsSkillAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'SkillAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"SkillRemoved"`
 */
export const useWatchAminalsSkillRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'SkillRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"SkillVote"`
 */
export const useWatchAminalsSkillVoteEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'SkillVote',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"SpawnAminal"`
 */
export const useWatchAminalsSpawnAminalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'SpawnAminal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"Squeak"`
 */
export const useWatchAminalsSqueakEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'Squeak',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"TraitAdded"`
 */
export const useWatchAminalsTraitAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'TraitAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aminalsAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchAminalsTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aminalsAbi,
    address: aminalsAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__
 */
export const useReadVisualsAuction = /*#__PURE__*/ createUseReadContract({
  abi: visualsAuctionAbi,
  address: visualsAuctionAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"GENERATOR_SOURCE_BALANCE"`
 */
export const useReadVisualsAuctionGeneratorSourceBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'GENERATOR_SOURCE_BALANCE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"GENERATOR_SOURCE_CONTRACT"`
 */
export const useReadVisualsAuctionGeneratorSourceContract =
  /*#__PURE__*/ createUseReadContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'GENERATOR_SOURCE_CONTRACT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"aminals"`
 */
export const useReadVisualsAuctionAminals = /*#__PURE__*/ createUseReadContract(
  {
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'aminals',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"auctionCnt"`
 */
export const useReadVisualsAuctionAuctionCnt =
  /*#__PURE__*/ createUseReadContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'auctionCnt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"auctions"`
 */
export const useReadVisualsAuctionAuctions =
  /*#__PURE__*/ createUseReadContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'auctions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"getAuctionByID"`
 */
export const useReadVisualsAuctionGetAuctionById =
  /*#__PURE__*/ createUseReadContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'getAuctionByID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"owner"`
 */
export const useReadVisualsAuctionOwner = /*#__PURE__*/ createUseReadContract({
  abi: visualsAuctionAbi,
  address: visualsAuctionAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__
 */
export const useWriteVisualsAuction = /*#__PURE__*/ createUseWriteContract({
  abi: visualsAuctionAbi,
  address: visualsAuctionAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"endAuction"`
 */
export const useWriteVisualsAuctionEndAuction =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'endAuction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"proposeVisual"`
 */
export const useWriteVisualsAuctionProposeVisual =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'proposeVisual',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"removeVisual"`
 */
export const useWriteVisualsAuctionRemoveVisual =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'removeVisual',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteVisualsAuctionRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"setup"`
 */
export const useWriteVisualsAuctionSetup = /*#__PURE__*/ createUseWriteContract(
  {
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'setup',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"startAuction"`
 */
export const useWriteVisualsAuctionStartAuction =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'startAuction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteVisualsAuctionTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"voteVisual"`
 */
export const useWriteVisualsAuctionVoteVisual =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'voteVisual',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"voteVisual"`
 */
export const useWriteVisualsAuctionBulkVoteVisual =
  /*#__PURE__*/ createUseWriteContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'bulkVoteVisual',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__
 */
export const useSimulateVisualsAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"endAuction"`
 */
export const useSimulateVisualsAuctionEndAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'endAuction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"proposeVisual"`
 */
export const useSimulateVisualsAuctionProposeVisual =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'proposeVisual',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"removeVisual"`
 */
export const useSimulateVisualsAuctionRemoveVisual =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'removeVisual',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateVisualsAuctionRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"setup"`
 */
export const useSimulateVisualsAuctionSetup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'setup',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"startAuction"`
 */
export const useSimulateVisualsAuctionStartAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'startAuction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateVisualsAuctionTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link visualsAuctionAbi}__ and `functionName` set to `"voteVisual"`
 */
export const useSimulateVisualsAuctionVoteVisual =
  /*#__PURE__*/ createUseSimulateContract({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    functionName: 'voteVisual',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__
 */
export const useWatchVisualsAuctionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"EndAuction"`
 */
export const useWatchVisualsAuctionEndAuctionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'EndAuction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchVisualsAuctionInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchVisualsAuctionOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"ProposeVisual"`
 */
export const useWatchVisualsAuctionProposeVisualEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'ProposeVisual',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"RemoveVisual"`
 */
export const useWatchVisualsAuctionRemoveVisualEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'RemoveVisual',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"RemoveVisualVote"`
 */
export const useWatchVisualsAuctionRemoveVisualVoteEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'RemoveVisualVote',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"StartAuction"`
 */
export const useWatchVisualsAuctionStartAuctionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'StartAuction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link visualsAuctionAbi}__ and `eventName` set to `"VisualsVote"`
 */
export const useWatchVisualsAuctionVisualsVoteEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: visualsAuctionAbi,
    address: visualsAuctionAddress,
    eventName: 'VisualsVote',
  })

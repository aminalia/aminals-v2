import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
const aminalFactoryAbi = require('../../../deployments/AminalFactory.json').abi;

const AMINAL_FACTORY_ADDRESS =
  '0x5dcda867599155a796ff92b39b07fc9f6febe208' as const;

interface ProposeSkillButtonProps {
  id: string;
}

export default function ProposeSkillButton({ id }: ProposeSkillButtonProps) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync } = useWriteContract();

  const [skillName, setSkillName] = useState('');
  const [skillAddress, setSkillAddress] = useState('');
  const [isProposing, setIsProposing] = useState(false);

  async function action() {
    if (!enabled || !skillName || !skillAddress) return;

    try {
      setIsProposing(true);
      await writeContractAsync({
        abi: aminalFactoryAbi,
        address: AMINAL_FACTORY_ADDRESS,
        functionName: 'proposeAddSkill',
        args: [BigInt(id), skillName, skillAddress as `0x${string}`],
        value: BigInt(10000000000000000), // 0.01 ETH in wei
      });
    } catch (error) {
      console.error('Error proposing skill:', error);
    } finally {
      setIsProposing(false);
      // Reset form
      setSkillName('');
      setSkillAddress('');
    }
  }

  if (!enabled) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
        <p>Connect your wallet to propose skills for this Aminal</p>
        <Button disabled variant="outline" className="mt-3">
          Connect wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="skillName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skill Name
          </label>
          <Input
            id="skillName"
            placeholder="Enter skill name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            disabled={isProposing}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="skillAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Smart Contract Address
          </label>
          <Input
            id="skillAddress"
            placeholder="0x..."
            value={skillAddress}
            onChange={(e) => setSkillAddress(e.target.value)}
            pattern="^0x[a-fA-F0-9]{40}$"
            disabled={isProposing}
            className="font-mono w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Fee: <span className="font-medium">0.01 ETH</span>
        </div>
        <Button
          onClick={action}
          disabled={!skillName || !skillAddress || isProposing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isProposing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Proposing Skill...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Propose Skill</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

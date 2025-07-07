import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalAbi } from '../../contracts/generated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Known skill addresses (these would be loaded from a registry or config in production)
const KNOWN_SKILLS = [
  {
    address: '0xcf5e739449e7a7a1b83f750e962f5dd87bb99556',
    name: 'Move2D',
    description: 'Move your Aminal in 2D space',
  },
  {
    address: '0x99ea2abb821942d604b11065156fc8639dff5701',
    name: 'MoveTwice',
    description: 'Move your Aminal twice in one action',
  },
] as const;

interface CallSkillButtonProps {
  aminalContractAddress: `0x${string}`;
}

export default function CallSkillButton({
  aminalContractAddress,
}: CallSkillButtonProps) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();

  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [skillData, setSkillData] = useState<string>('');

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Log transaction initiation
  useEffect(() => {
    if (hash) {
      console.log('🔮 Call skill transaction initiated:', {
        hash,
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        skillData,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    hash,
    aminalContractAddress,
    selectedSkill,
    skillData,
    address,
    chain?.id,
  ]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Call skill transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        timestamp: new Date().toISOString(),
      });

      const skillName =
        KNOWN_SKILLS.find((skill) => skill.address === selectedSkill)?.name ||
        'Skill';
      toast.success(`🔮 ${skillName} executed successfully!`, {
        id: 'call-skill-tx',
        duration: 4000,
      });
    }
  }, [isConfirmed, receipt, hash, aminalContractAddress, selectedSkill]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        skillData,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Call skill transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to execute skill. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('energy')) {
        errorMessage = 'Insufficient energy. Feed your Aminal first.';
      }

      toast.error(errorMessage, {
        id: 'call-skill-tx',
      });
    }
  }, [
    error,
    aminalContractAddress,
    selectedSkill,
    skillData,
    address,
    chain?.id,
  ]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Call skill transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Skill execution failed. Please try again.', {
        id: 'call-skill-tx',
      });
    }
  }, [receiptError, hash, aminalContractAddress, selectedSkill]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Call skill transaction pending...', {
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Calling skill...', { id: 'call-skill-tx' });
    }
  }, [isPending, aminalContractAddress, selectedSkill, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Call skill transaction confirming...', {
        hash,
        aminalAddress: aminalContractAddress,
        skillAddress: selectedSkill,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming skill execution...', { id: 'call-skill-tx' });
    }
  }, [isConfirming, hash, aminalContractAddress, selectedSkill]);

  function callSkill() {
    if (!enabled || !selectedSkill) {
      console.warn(
        '⚠️ Call skill attempted but wallet not connected or no skill selected:',
        {
          isConnected,
          selectedSkill,
          chainId: chain?.id,
          timestamp: new Date().toISOString(),
        }
      );
      return;
    }

    // Convert skill data to bytes (for now just use empty bytes)
    const data = skillData
      ? `0x${Buffer.from(skillData).toString('hex')}`
      : '0x';

    // Log the contract call parameters
    console.log('🚀 Initiating call skill transaction:', {
      contractAddress: aminalContractAddress,
      functionName: 'useSkill',
      skillAddress: selectedSkill,
      skillName: KNOWN_SKILLS.find((skill) => skill.address === selectedSkill)
        ?.name,
      data,
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalAbi,
      address: aminalContractAddress,
      functionName: 'useSkill',
      args: [selectedSkill as `0x${string}`, data as `0x${string}`],
    });
  }

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-sm">🔮 Call Global Skill</h4>

      <div className="space-y-2">
        <label className="text-sm font-medium">Skill</label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          disabled={isPending || isConfirming}
          className="w-full p-2 border rounded-md text-sm disabled:opacity-50"
        >
          <option value="">Select a skill...</option>
          {KNOWN_SKILLS.map((skill) => (
            <option key={skill.address} value={skill.address}>
              {skill.name} - {skill.description}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Skill Data (optional)</label>
        <Input
          placeholder="Enter skill parameters"
          value={skillData}
          onChange={(e) => setSkillData(e.target.value)}
          disabled={isPending || isConfirming}
          className="text-sm"
        />
      </div>

      <Button
        onClick={callSkill}
        disabled={!enabled || !selectedSkill || isPending || isConfirming}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        size="sm"
      >
        {isPending || isConfirming ? '⏳ Calling Skill...' : '🚀 Call Skill'}
      </Button>

      {selectedSkill && (
        <div className="text-xs text-gray-600 mt-2">
          <strong>Note:</strong> Skills are globally available and may consume
          energy from your Aminal.
        </div>
      )}
    </div>
  );
}

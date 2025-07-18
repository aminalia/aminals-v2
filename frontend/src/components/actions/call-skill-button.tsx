import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { encodeFunctionData } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalAbi, move2DAbi, move2DAddress } from '../../contracts/generated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Known skill addresses (these would be loaded from a registry or config in production)
const KNOWN_SKILLS = [
  {
    address: move2DAddress,
    name: 'Move2D',
    description: 'Move your Aminal in 2D space',
    type: 'move2d',
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

  // Move2D specific state
  const [move2DX, setMove2DX] = useState<string>('');
  const [move2DY, setMove2DY] = useState<string>('');

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Get selected skill info
  const selectedSkillInfo = KNOWN_SKILLS.find(
    (skill) => skill.address === selectedSkill
  );

  // Reset skill-specific inputs when skill changes
  useEffect(() => {
    setSkillData('');
    setMove2DX('');
    setMove2DY('');
  }, [selectedSkill]);

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

      const skillName = selectedSkillInfo?.name || 'Skill';
      toast.success(`🔮 ${skillName} executed successfully!`, {
        id: 'call-skill-tx',
        duration: 4000,
      });
    }
  }, [
    isConfirmed,
    receipt,
    hash,
    aminalContractAddress,
    selectedSkill,
    selectedSkillInfo,
  ]);

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

  // Encode skill data based on skill type
  function encodeSkillData(): `0x${string}` {
    if (selectedSkillInfo?.type === 'move2d') {
      // Validate coordinates
      const x = parseInt(move2DX);
      const y = parseInt(move2DY);

      if (isNaN(x) || isNaN(y)) {
        throw new Error('Invalid coordinates');
      }

      // Encode the move function call
      return encodeFunctionData({
        abi: move2DAbi,
        functionName: 'move',
        args: [BigInt(x), BigInt(y)],
      });
    }

    // Fallback for other skills
    return skillData ? `0x${Buffer.from(skillData).toString('hex')}` : '0x';
  }

  // Check if skill inputs are valid
  function isSkillInputValid(): boolean {
    if (selectedSkillInfo?.type === 'move2d') {
      const x = parseInt(move2DX);
      const y = parseInt(move2DY);
      return !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0;
    }
    return true; // For other skills, always valid for now
  }

  function callSkill() {
    if (!enabled || !selectedSkill || !isSkillInputValid()) {
      console.warn(
        '⚠️ Call skill attempted but wallet not connected, no skill selected, or invalid input:',
        {
          isConnected,
          selectedSkill,
          isInputValid: isSkillInputValid(),
          chainId: chain?.id,
          timestamp: new Date().toISOString(),
        }
      );
      return;
    }

    try {
      const data = encodeSkillData();

      // Log the contract call parameters
      console.log('🚀 Initiating call skill transaction:', {
        contractAddress: aminalContractAddress,
        functionName: 'useSkill',
        skillAddress: selectedSkill,
        skillName: selectedSkillInfo?.name,
        data,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });

      writeContract({
        abi: aminalAbi,
        address: aminalContractAddress,
        functionName: 'useSkill',
        args: [selectedSkill as `0x${string}`, data],
      });
    } catch (error) {
      console.error('❌ Failed to encode skill data:', error);
      toast.error('Invalid skill parameters. Please check your inputs.', {
        id: 'call-skill-tx',
      });
    }
  }

  // Render skill-specific inputs
  function renderSkillInputs() {
    if (selectedSkillInfo?.type === 'move2d') {
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            🎯 Move to Coordinates
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                X Coordinate
              </label>
              <Input
                type="number"
                placeholder="0"
                value={move2DX}
                onChange={(e) => setMove2DX(e.target.value)}
                disabled={isPending || isConfirming}
                className="text-sm"
                min="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Y Coordinate
              </label>
              <Input
                type="number"
                placeholder="0"
                value={move2DY}
                onChange={(e) => setMove2DY(e.target.value)}
                disabled={isPending || isConfirming}
                className="text-sm"
                min="0"
              />
            </div>
          </div>
          {move2DX && move2DY && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              📍 Moving to position ({move2DX}, {move2DY})
            </div>
          )}
        </div>
      );
    }

    // Generic skill data input for other skills
    return (
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
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <h4 className="font-semibold text-sm text-gray-800">
          Call Global Skill
        </h4>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Skill
        </label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          disabled={isPending || isConfirming}
          className="w-full p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Choose a skill...</option>
          {KNOWN_SKILLS.map((skill) => (
            <option key={skill.address} value={skill.address}>
              {skill.name} - {skill.description}
            </option>
          ))}
        </select>
      </div>

      {selectedSkill && (
        <div className="bg-white p-3 rounded-md border border-gray-200">
          {renderSkillInputs()}
        </div>
      )}

      <Button
        onClick={callSkill}
        disabled={
          !enabled ||
          !selectedSkill ||
          !isSkillInputValid() ||
          isPending ||
          isConfirming
        }
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
        size="sm"
      >
        {isPending || isConfirming ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Calling Skill...
          </span>
        ) : (
          <span className="flex items-center gap-2">🚀 Execute Skill</span>
        )}
      </Button>

      {selectedSkill && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-purple-400">
          <strong>💡 Note:</strong> Skills are globally available and consume
          energy from your Aminal. Make sure your Aminal has enough energy!
        </div>
      )}
    </div>
  );
}

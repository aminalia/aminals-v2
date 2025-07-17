import { Aminal } from '../../.graphclient';
import AminalCard from './aminal-card';

// Convert GraphQL Aminal to component format
function convertAminalForDisplay(aminal: Aminal | any) {
  if (!aminal) {
    return null;
  }

  const safeToString = (value: any) => value ? value.toString() : '0';

  return {
    id: safeToString(aminal.id),
    contractAddress: safeToString(aminal.contractAddress),
    aminalIndex: safeToString(aminal.aminalIndex),
    energy: safeToString(aminal.energy),
    totalLove: safeToString(aminal.totalLove),
    ethBalance: safeToString(aminal.ethBalance),
    tokenURI: aminal.tokenURI || undefined,
    momAddress: aminal.momAddress ? safeToString(aminal.momAddress) : '0x0000000000000000000000000000000000000000',
    dadAddress: aminal.dadAddress ? safeToString(aminal.dadAddress) : '0x0000000000000000000000000000000000000000',
    backId: safeToString(aminal.backId),
    armId: safeToString(aminal.armId),
    tailId: safeToString(aminal.tailId),
    earsId: safeToString(aminal.earsId),
    bodyId: safeToString(aminal.bodyId),
    faceId: safeToString(aminal.faceId),
    mouthId: safeToString(aminal.mouthId),
    miscId: safeToString(aminal.miscId),
    lovers: aminal.lovers || [],
  };
}

export default function AminalGrid({ aminals }: { aminals: (Aminal | any)[] }) {
  // Convert GraphQL format to display format
  const validAminals = aminals
    ?.filter(Boolean)
    ?.map(convertAminalForDisplay)
    ?.filter(Boolean) || [];

  if (!validAminals.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Aminals Found</h3>
        <p className="text-gray-500 max-w-md">
          There are currently no Aminals to display. Try connecting your wallet or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {validAminals.map((aminal, index) => {
        if (!aminal) return null;
        return (
          <AminalCard 
            key={`${aminal.contractAddress || aminal.id || index}-${index}`} 
            aminal={aminal} 
          />
        );
      })}
    </div>
  );
}

import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import Link from 'next/link';

interface TraitCardProps {
  trait: {
    id: string;
    tokenId: string;
    traitType: number;
    svg?: string | null;
    name?: string | null;
    creator: {
      address: string;
    };
    proposalsUsingGene?: {
      id: string;
      auction: {
        id: string;
        aminalOne: {
          id: string;
          aminalIndex: string;
        };
        aminalTwo: {
          id: string;
          aminalIndex: string;
        };
      };
    }[];
  };
  aminalCount?: number;
}

const TraitCard = ({ trait, aminalCount = 0 }: TraitCardProps) => {
  const category =
    TRAIT_CATEGORIES[trait.traitType as keyof typeof TRAIT_CATEGORIES];

  console.log('TraitCard - trait.id:', trait.id, 'tokenId:', trait.tokenId);

  return (
    <Link href={`/genes/${trait.id}`} className="block">
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-square bg-indigo-50 flex items-center justify-center p-4">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: trait?.svg || '',
            }}
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{category?.emoji || '🎨'}</span>
              {category?.name || 'Unknown'} #{trait.tokenId}
            </span>
            <div className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">
              {aminalCount} {aminalCount === 1 ? 'Aminal' : 'Aminals'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TraitCard;

import { Button } from '@/components/ui/button';
import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useState } from 'react';

// Define types for the component props
export type TraitCategory =
  | 'background'
  | 'arm'
  | 'tail'
  | 'ears'
  | 'body'
  | 'face'
  | 'mouth'
  | 'misc';

export interface Trait {
  svg?: string;
  visualId?: string;
  [key: string]: any;
}

export interface TraitParts {
  background: Trait[];
  body: Trait[];
  face: Trait[];
  mouth: Trait[];
  ears: Trait[];
  arm: Trait[];
  tail: Trait[];
  misc: Trait[];
  [key: string]: Trait[];
}

export interface SelectedParts {
  background: number;
  body: number;
  face: number;
  mouth: number;
  ears: number;
  arm: number;
  tail: number;
  misc: number;
  [key: string]: number;
}

export interface TraitSelectorProps {
  parts: TraitParts;
  selectedParts: SelectedParts;
  onPartSelection: (part: string, index: number) => void;
  disabled?: boolean;
}

const TraitSelector: React.FC<TraitSelectorProps> = ({
  parts,
  selectedParts,
  onPartSelection,
  disabled = false,
}) => {
  const [activeCategory, setActiveCategory] =
    useState<TraitCategory>('background');

  // Get the category mapping for emoji display
  const categoryMap: Record<TraitCategory, { index: number; name: string }> = {
    background: { index: 0, name: 'Background' },
    arm: { index: 1, name: 'Arms' },
    tail: { index: 2, name: 'Tail' },
    ears: { index: 3, name: 'Ears' },
    body: { index: 4, name: 'Body' },
    face: { index: 5, name: 'Face' },
    mouth: { index: 6, name: 'Mouth' },
    misc: { index: 7, name: 'Misc' },
  };

  return (
    <div
      className={`flex flex-col gap-4 ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800">Gene Selection</h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {Object.entries(categoryMap).map(([category, { index, name }]) => {
          const emoji =
            TRAIT_CATEGORIES[index as keyof typeof TRAIT_CATEGORIES].emoji;
          return (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() =>
                !disabled && setActiveCategory(category as TraitCategory)
              }
              className="rounded-md flex items-center gap-1 text-xs px-2 py-1"
              size="sm"
              disabled={disabled}
            >
              <span className="text-sm">{emoji}</span>
              <span>{name}</span>
            </Button>
          );
        })}
      </div>

      {/* Options Grid */}
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium text-gray-700">
            {categoryMap[activeCategory].name} Options
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            P1/P2 = Parent genes, C = Community proposals
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Parent and Community Genes First */}
          {parts[activeCategory]?.map((trait: Trait, index: number) => {
            const isParent = (trait as any)?.isParentGene;
            const isCommunity = (trait as any)?.isCommunityGene;
            const parentIndex = (trait as any)?.parentIndex;
            
            return (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${
                    disabled
                      ? 'border-gray-200 cursor-not-allowed'
                      : 'cursor-pointer hover:border-gray-400'
                  }
                  ${
                    selectedParts[activeCategory] === index
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : isParent
                      ? 'border-blue-300'
                      : isCommunity
                      ? 'border-purple-300'
                      : 'border-gray-200'
                  }`}
                onClick={() =>
                  !disabled && onPartSelection(activeCategory, index)
                }
              >
                {/* Source indicator */}
                {isParent && (
                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs rounded px-1 py-0.5 font-medium">
                    P{parentIndex}
                  </div>
                )}
                {isCommunity && (
                  <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs rounded px-1 py-0.5 font-medium">
                    C
                  </div>
                )}
                
                {trait?.svg ? (
                  <svg
                    viewBox="0 0 1000 1000"
                    className="w-full h-full bg-gray-50"
                    dangerouslySetInnerHTML={{
                      __html: trait.svg,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    No trait available
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Empty Gene Option - Always show as last option */}
          <div
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
              ${
                disabled
                  ? 'border-gray-200 cursor-not-allowed'
                  : 'cursor-pointer hover:border-gray-400'
              }
              ${
                selectedParts[activeCategory] === -1
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300'
              }`}
            onClick={() => !disabled && onPartSelection(activeCategory, -1)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-600">
              <div className="text-xl mb-1">∅</div>
              <div className="text-xs font-medium">None</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraitSelector;

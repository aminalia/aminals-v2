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
      className={`flex flex-col gap-5 ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      <h2 className="text-xl font-bold">Trait Selection</h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
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
              className="rounded-full flex items-center gap-2"
              size="sm"
              disabled={disabled}
            >
              <span>{emoji}</span>
              <span>{name}</span>
            </Button>
          );
        })}
      </div>

      {/* Options Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <span className="text-blue-600">
            {
              TRAIT_CATEGORIES[
                categoryMap[activeCategory]
                  .index as keyof typeof TRAIT_CATEGORIES
              ].emoji
            }
          </span>
          <span>{categoryMap[activeCategory].name} Options</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Empty Gene Option - Always show as first option */}
          <div
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all
              ${
                disabled
                  ? 'border-gray-200 cursor-not-allowed'
                  : 'cursor-pointer hover:border-gray-300 hover:shadow-sm'
              }
              ${
                selectedParts[activeCategory] === -1
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200'
              }`}
            onClick={() => !disabled && onPartSelection(activeCategory, -1)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500">
              <div className="text-2xl mb-1">∅</div>
              <div className="text-xs font-medium">Empty</div>
            </div>
          </div>

          {parts[activeCategory]?.map((trait: Trait, index: number) => (
            <div
              key={index}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all
                ${
                  disabled
                    ? 'border-gray-200 cursor-not-allowed'
                    : 'cursor-pointer hover:border-gray-300 hover:shadow-sm'
                }
                ${
                  selectedParts[activeCategory] === index
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200'
                }`}
              onClick={() =>
                !disabled && onPartSelection(activeCategory, index)
              }
            >
              {trait?.svg ? (
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-full h-full bg-indigo-50"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraitSelector;

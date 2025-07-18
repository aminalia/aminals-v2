'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface SimpleSVGBuilderProps {
  onSVGChange: (svg: string) => void;
  initialSVG?: string;
}

export function SimpleSVGBuilder({ onSVGChange, initialSVG = '' }: SimpleSVGBuilderProps) {
  const [svgCode, setSvgCode] = useState(initialSVG || '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="50" fill="#ff6b6b"/>\n</svg>');

  useEffect(() => {
    onSVGChange(svgCode);
  }, [svgCode, onSVGChange]);

  const handleSVGChange = (newSvg: string) => {
    setSvgCode(newSvg);
  };

  const loadExample = (example: string) => {
    setSvgCode(example);
  };

  return (
    <div className="space-y-4">
      {/* SVG Code Editor */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">SVG Code</Label>
        <textarea
          className="w-full h-48 text-sm font-mono p-3 border border-gray-200 rounded-md resize-none"
          value={svgCode}
          onChange={(e) => handleSVGChange(e.target.value)}
          placeholder="Paste your SVG code here..."
        />
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">Preview</Label>
        <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-white p-8 min-h-[200px]">
          <div 
            className="w-32 h-32" 
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        </div>
      </Card>

      {/* Example Templates */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">Example Templates</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            {
              name: 'Simple Circle',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#ff6b6b" stroke="#000" stroke-width="3"/>
</svg>`
            },
            {
              name: 'Star',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,20 120,80 180,80 135,115 155,175 100,140 45,175 65,115 20,80 80,80" fill="#ffd700" stroke="#000" stroke-width="2"/>
</svg>`
            },
            {
              name: 'Heart',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M100,180 C60,140 20,100 20,60 C20,30 40,10 70,10 C85,10 100,20 100,20 C100,20 115,10 130,10 C160,10 180,30 180,60 C180,100 140,140 100,180 Z" fill="#e91e63" stroke="#000" stroke-width="2"/>
</svg>`
            },
            {
              name: 'Square',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="100" fill="#4caf50" stroke="#000" stroke-width="3"/>
</svg>`
            },
            {
              name: 'Triangle',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,30 170,170 30,170" fill="#9c27b0" stroke="#000" stroke-width="3"/>
</svg>`
            },
            {
              name: 'Face',
              svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#ffeb3b" stroke="#000" stroke-width="2"/>
  <circle cx="80" cy="80" r="8" fill="#000"/>
  <circle cx="120" cy="80" r="8" fill="#000"/>
  <path d="M 70 120 Q 100 140 130 120" stroke="#000" stroke-width="2" fill="none"/>
</svg>`
            }
          ].map((template) => (
            <Button
              key={template.name}
              variant="outline"
              size="sm"
              onClick={() => loadExample(template.svg)}
              className="text-xs h-auto py-2"
            >
              {template.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="text-sm">
          <h3 className="font-medium text-blue-900 mb-2">💡 SVG Tips</h3>
          <ul className="space-y-1 text-blue-800 text-xs">
            <li>• Use viewBox=&quot;0 0 200 200&quot; for consistent sizing</li>
            <li>• Keep designs simple - they&apos;ll be small when used on Aminals</li>
            <li>• Use fill and stroke attributes for colors</li>
            <li>• Test your SVG in the preview before creating</li>
            <li>• You can find SVG icons online and modify them</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
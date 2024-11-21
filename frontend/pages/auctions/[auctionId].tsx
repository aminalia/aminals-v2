import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../_layout';

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId;

  const { data: auctions, isLoading: isLoadingAuction } = useAuction(
    auctionId as string
  );
  const { data: proposeVisuals, isLoading: isLoadingProposeVisuals } =
    useAuctionProposeVisuals(auctionId as string);

  const [selectedParts, setSelectedParts] = useState({
    background: 0,
    tail: 0,
    arm: 0,
    ear: 0,
    body: 0,
    face: 0,
    mouth: 0,
    misc: 0,
  });

  // TODO add proposed visuals as well
  const [activeCategory, setActiveCategory] = useState('background');

  const parts =
    auctions && auctions[0]
      ? {
          background: [
            auctions[0].aminalOne.traits[0].svg,
            auctions[0].aminalTwo.traits[0].svg,
          ],
          body: [
            auctions[0].aminalOne.traits[4].svg,
            auctions[0].aminalTwo.traits[4].svg,
          ],
          face: [
            auctions[0].aminalOne.traits[5].svg,
            auctions[0].aminalTwo.traits[5].svg,
          ],
          mouth: [
            auctions[0].aminalOne.traits[6].svg,
            auctions[0].aminalTwo.traits[6].svg,
          ],
          ear: [
            auctions[0].aminalOne.traits[3].svg,
            auctions[0].aminalTwo.traits[3].svg,
          ],
          arm: [
            auctions[0].aminalOne.traits[1].svg,
            auctions[0].aminalTwo.traits[1].svg,
          ],
          tail: [
            auctions[0].aminalOne.traits[2].svg,
            auctions[0].aminalTwo.traits[2].svg,
          ],
          misc: [
            auctions[0].aminalOne.traits[7].svg,
            auctions[0].aminalTwo.traits[7].svg,
          ],
        }
      : {
          background: [],
          body: [],
          face: [],
          mouth: [],
          ear: [],
          arm: [],
          tail: [],
          misc: [],
        };

  const handlePartSelection = (part, index) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: index,
    }));
  };

  return (
    <Layout>
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side - Preview */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-4 aspect-square">
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{
                    __html: Object.entries(selectedParts)
                      .map(([part, index]) => parts[part][index])
                      .join(''),
                  }}
                />
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex flex-col gap-4">
              {/* Category Selection */}
              <div className="flex flex-col gap-2">
                {Object.keys(parts).map((category) => (
                  <Button
                    key={category}
                    variant={
                      activeCategory === category ? 'default' : 'outline'
                    }
                    onClick={() => setActiveCategory(category)}
                    className="justify-start"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Options Grid */}
              <div className="text-sm font-medium mb-2">
                {activeCategory.charAt(0).toUpperCase() +
                  activeCategory.slice(1)}{' '}
                Options
              </div>
              <div className="grid grid-cols-2 gap-2">
                {parts[activeCategory].map((_, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg border-2 cursor-pointer
                      ${
                        selectedParts[activeCategory] === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handlePartSelection(activeCategory, index)}
                  >
                    <svg
                      viewBox="0 0 1000 1000"
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{
                        __html: parts[activeCategory][index],
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AuctionPage;

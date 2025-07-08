import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { GeneAuction } from '../../.graphclient';
import ProposeButton from './actions/propose-button';

import '../../styles/index.module.css';

// VOTING_DURATION from the contract (1 hour = 3600 seconds)
const VOTING_DURATION = 3600;

export default function AuctionCard({ auction }: { auction: GeneAuction }) {
  const { aminalOne, aminalTwo } = auction;
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate auction end time
  const auctionEndTime = useMemo(() => {
    if (!auction?.blockTimestamp) return 0;
    // Convert BigInt to number and add voting duration
    return Number(auction.blockTimestamp) + VOTING_DURATION;
  }, [auction?.blockTimestamp]);

  // Check if auction has ended
  const isAuctionEnded = useMemo(() => {
    if (!auction) return false;
    const now = Math.floor(Date.now() / 1000);
    return auction.finished || now >= auctionEndTime;
  }, [auction, auctionEndTime]);

  // Update countdown timer
  useEffect(() => {
    if (auction.finished || isAuctionEnded) return;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = auctionEndTime - now;
      setTimeLeft(Math.max(0, difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [auctionEndTime, auction.finished, isAuctionEnded]);

  // Format time for display
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Ended';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <Card className="overflow-hidden bg-white hover:shadow-xl transition-all duration-300 group border-2 hover:border-pink-200">
      {/* Main container - stack on mobile, row on desktop */}
      <div className="flex w-full">
        {/* Images Section - Always side by side */}
        <div className="flex w-full md:w-1/2 relative">
          {/* Heart connector between images */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border-2 border-pink-200 group-hover:border-pink-300 transition-all">
            <div className="text-lg text-pink-500 group-hover:scale-110 transition-transform">
              💕
            </div>
          </div>

          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalOne.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            {/* <div className="absolute top-3 left-3 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-3 py-1.5 rounded-full font-medium border border-gray-200">
              #{aminalOne.aminalIndex}
            </div> */}
          </div>
          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalTwo.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            {/* <div className="absolute top-3 right-3 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-3 py-1.5 rounded-full font-medium border border-gray-200">
              #{aminalTwo.aminalIndex}
            </div> */}
          </div>
        </div>

        {/* Info Section - Full width on mobile, 50% on desktop */}
        <div className="w-full md:w-1/2 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link href={`/breeding/${auction.auctionId}`}>
                <h2 className="text-2xl font-bold hover:text-pink-600 transition-colors group/title">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    #{aminalOne.aminalIndex} × #{aminalTwo.aminalIndex}
                  </span>
                </h2>
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                Breeding Auction #{auction.auctionId}
              </div>
            </div>
            <Badge
              variant={auction.finished ? 'secondary' : 'default'}
              className={cn(
                'transition-all duration-300 px-3 py-2 font-medium text-sm',
                auction.finished
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
                  : isAuctionEnded
                  ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-200'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200'
              )}
            >
              {auction.finished
                ? '🎉 Completed'
                : isAuctionEnded
                ? '⏰ Ended'
                : '🔥 Active'}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Countdown Timer Row */}
            {!auction.finished && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2.5 font-medium">
                    <span className="text-xl">⏰</span>
                    Time Left
                  </span>
                  <span
                    className={`font-bold text-xl ${
                      isAuctionEnded ? 'text-red-600' : 'text-orange-600'
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">👶</div>
                <div className="text-sm text-gray-600 mb-1">Child</div>
                {auction.childAminal ? (
                  <Link
                    href={`/aminals/${auction.childAminal.contractAddress}`}
                    className="font-bold text-purple-700 hover:text-purple-800 underline transition-colors"
                  >
                    #{auction.childAminal.aminalIndex}
                  </Link>
                ) : (
                  <div className="font-bold text-gray-500">
                    {isAuctionEnded ? 'Settling...' : 'TBD'}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-sm text-gray-600 mb-1">Total Love</div>
                <div className="font-bold text-pink-700">
                  {auction.totalLove ? auction.totalLove.toString() : '0'}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <Link href={`/breeding/${auction.auctionId}`}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-3 text-center font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer mt-4">
                {auction.finished ? 'View Results' : 'Join Breeding'} →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AuctionCardActive({ auction }: { auction: GeneAuction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalIndex} and {aminalTwo.aminalIndex}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminal?.aminalIndex}</tr>
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
            </table>
          </CardContent>
          {/* <CardFooter></CardFooter> */}
        </CardSection>
      </Card>
    </>
  );
}

export function AuctionCardInActive({ auction }: { auction: GeneAuction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalIndex} and {aminalTwo.aminalIndex}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminal?.aminalIndex}</tr>
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
            </table>
          </CardContent>
          <CardFooter></CardFooter>
        </CardSection>
      </Card>
    </>
  );
}

function TokenUriImage({ tokenUri }: { tokenUri?: string | null }) {
  let image,
    error = null;

  if (!tokenUri) {
    error = new Error('No token URI provided');
  } else {
    try {
      const base64Payload = tokenUri.split(',')[1];
      const decodedJsonString = atob(base64Payload);
      const json = JSON.parse(decodedJsonString);
      image = json.image;
    } catch (e) {
      error = e;
    }
  }

  if (error || !image) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-sm">
        <div className="text-center">
          <div className="text-2xl mb-2">🐈</div>
          <div>Unable to load image</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={image}
        alt="Aminal"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, 250px"
      />
    </div>
  );
}

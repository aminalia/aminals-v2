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
    <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group">
      {/* Main container - stack on mobile, row on desktop */}
      <div className="flex w-full">
        {/* Images Section - Always side by side */}
        <div className="flex w-full md:w-1/2">
          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalOne.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-4 py-1.5 rounded-full font-medium">
              <span className="hidden md:inline">✨ </span>#
              {aminalOne.aminalIndex}
            </div>
          </div>
          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalTwo.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-4 py-1.5 rounded-full font-medium">
              <span className="hidden md:inline">✨ </span>#
              {aminalTwo.aminalIndex}
            </div>
          </div>
        </div>

        {/* Info Section - Full width on mobile, 50% on desktop */}
        <div className="w-full md:w-1/2 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href={`/breeding/${auction.auctionId}`}>
                <h2 className="text-xl font-bold hover:text-primary transition-colors">
                  <span className="text-xl">💕</span> #{aminalOne.aminalIndex} ×
                  #{aminalTwo.aminalIndex}
                </h2>
              </Link>
            </div>
            <Badge
              variant={auction.finished ? 'secondary' : 'default'}
              className={cn(
                'transition-all duration-300 px-3 py-1.5 font-medium',
                auction.finished
                  ? 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                  : isAuctionEnded
                  ? 'bg-red-100 text-red-700 group-hover:bg-red-200'
                  : 'bg-green-100 text-green-700 group-hover:bg-green-200'
              )}
            >
              {auction.finished
                ? '🎉 Completed'
                : isAuctionEnded
                ? '⏰ Ended'
                : '🔥 Active'}
            </Badge>
          </div>

          <div className="space-y-3 bg-gray-50/80 rounded-xl p-4">
            {/* Countdown Timer Row */}
            {!auction.finished && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2.5">
                  <span className="text-xl">⏰</span>
                  Time Left
                </span>
                <span
                  className={`font-semibold text-lg ${
                    isAuctionEnded ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2.5">
                <span className="text-xl">👶</span> Child
              </span>
              <span className="font-semibold text-lg">
                #{auction.childAminal?.aminalIndex || 'TBD'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2.5">
                <span className="text-xl">❤️</span> Total Love Vote
              </span>
              <span className="font-semibold text-lg">
                {auction.totalLove ? auction.totalLove.toString() : '0'}
              </span>
            </div>
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
      <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
        Unable to load image
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={image}
        alt="Aminal"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 250px"
      />
    </div>
  );
}

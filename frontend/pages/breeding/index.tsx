import AuctionCard from '@/components/auction-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAuctions =
    auctions?.filter((auction) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !auction.finished;
      return auction.finished;
    }) || [];

  const activeCount = auctions?.filter((a) => !a.finished).length || 0;
  const completedCount = auctions?.filter((a) => a.finished).length || 0;

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <div className="text-6xl">💕</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Aminal Breeding
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Create new Aminals through community-driven breeding
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeCount}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Active Auctions
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {auctions?.length || 0}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                Total Auctions
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {completedCount}
              </div>
              <div className="text-sm text-purple-700 font-medium">
                Completed
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                onClick={() => setFilter('all')}
                className={cn(
                  'rounded-full px-6 font-medium transition-all',
                  filter === 'all'
                    ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                All ({auctions?.length || 0})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'ghost'}
                onClick={() => setFilter('active')}
                className={cn(
                  'rounded-full px-6 font-medium transition-all',
                  filter === 'active'
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                🔥 Active ({activeCount})
              </Button>
              <Button
                variant={filter === 'inactive' ? 'default' : 'ghost'}
                onClick={() => setFilter('inactive')}
                className={cn(
                  'rounded-full px-6 font-medium transition-all',
                  filter === 'inactive'
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                ✅ Completed ({completedCount})
              </Button>
            </div>
          </div>

          {/* Auctions List */}
          {isLoadingAuctions ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <div className="text-gray-600">
                  Loading breeding auctions...
                </div>
              </div>
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="text-6xl mb-4">
                  {filter === 'active'
                    ? '🔥'
                    : filter === 'inactive'
                    ? '✅'
                    : '🧬'}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {filter === 'active'
                    ? 'No Active Auctions'
                    : filter === 'inactive'
                    ? 'No Completed Auctions'
                    : 'No Auctions Found'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filter === 'active'
                    ? 'All current breeding auctions have ended. Check back soon for new ones!'
                    : filter === 'inactive'
                    ? 'No auctions have been completed yet.'
                    : 'No breeding auctions match your current filter.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAuctions.map((auction) => (
                <AuctionCard key={auction.auctionId} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionsPage;

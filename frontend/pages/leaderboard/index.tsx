import Layout from '../_layout';

const LeaderboardPage = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>

          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Leaderboard
          </h1>

          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
            <div className="text-2xl font-semibold text-pink-600 mb-4 animate-pulse">
              Coming Soon!
            </div>

            <p className="text-gray-600 mb-6">
              We&apos;re working hard to bring you the most exciting leaderboard
              ever! Get ready to see who are the most loving and active Aminal
              fans in the community.
            </p>

            <div className="flex justify-center space-x-4">
              <div
                className="text-2xl animate-bounce"
                style={{ animationDelay: '0.2s' }}
              >
                ❤️
              </div>
              <div
                className="text-2xl animate-bounce"
                style={{ animationDelay: '0.4s' }}
              >
                🐱
              </div>
              <div
                className="text-2xl animate-bounce"
                style={{ animationDelay: '0.6s' }}
              >
                🏅
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;

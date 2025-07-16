import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Target, TrendingUp, MapPin, CreditCard, Trophy, Star, Clock, Users } from 'lucide-react';
import { SpotTheFraud } from '@/components/games/SpotTheFraud';
import { FraudAnalyst } from '@/components/games/FraudAnalyst';
import { PredictThePattern } from '@/components/games/PredictThePattern';
import { GuessTheOrigin } from '@/components/games/GuessTheOrigin';
import { CardClonerTycoon } from '@/components/games/CardClonerTycoon';

interface GameStats {
  played: number;
  won: number;
  accuracy: number;
  bestScore: number;
  level: number;
}

interface UserProgress {
  totalScore: number;
  gamesPlayed: number;
  rank: string;
  badges: string[];
  stats: {
    spotTheFraud: GameStats;
    fraudAnalyst: GameStats;
    predictPattern: GameStats;
    guessOrigin: GameStats;
    cardCloner: GameStats;
  };
}

const Dashboard = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [userProgress] = useState<UserProgress>({
    totalScore: 2850,
    gamesPlayed: 47,
    rank: "Fraud Detective",
    badges: ["First Steps", "Pattern Master", "Global Guardian", "Analyst Pro"],
    stats: {
      spotTheFraud: { played: 15, won: 12, accuracy: 80, bestScore: 950, level: 3 },
      fraudAnalyst: { played: 10, won: 8, accuracy: 85, bestScore: 1200, level: 2 },
      predictPattern: { played: 8, won: 6, accuracy: 75, bestScore: 800, level: 2 },
      guessOrigin: { played: 9, won: 7, accuracy: 78, bestScore: 1100, level: 2 },
      cardCloner: { played: 5, won: 3, accuracy: 60, bestScore: 650, level: 1 }
    }
  });

  const games = [
    {
      id: 'spot-the-fraud',
      title: 'Spot the Fraud',
      description: 'Identify fraudulent transactions under time pressure',
      icon: Target,
      difficulty: 'Beginner',
      estimatedTime: '3-5 min',
      rewards: 'Up to 1000 points',
      color: 'primary',
      stats: userProgress.stats.spotTheFraud
    },
    {
      id: 'fraud-analyst',
      title: 'Be the Fraud Analyst',
      description: 'Make decisions as a bank fraud detection specialist',
      icon: Shield,
      difficulty: 'Intermediate',
      estimatedTime: '5-8 min',
      rewards: 'Up to 1500 points',
      color: 'secondary',
      stats: userProgress.stats.fraudAnalyst
    },
    {
      id: 'predict-pattern',
      title: 'Predict the Pattern',
      description: 'Train ML models to detect fraud patterns',
      icon: TrendingUp,
      difficulty: 'Advanced',
      estimatedTime: '8-12 min',
      rewards: 'Up to 2000 points',
      color: 'accent',
      stats: userProgress.stats.predictPattern
    },
    {
      id: 'guess-origin',
      title: 'Guess the Fraud Origin',
      description: 'Analyze global transaction patterns on a world map',
      icon: MapPin,
      difficulty: 'Intermediate',
      estimatedTime: '4-6 min',
      rewards: 'Up to 1200 points',
      color: 'warning',
      stats: userProgress.stats.guessOrigin
    },
    {
      id: 'card-cloner',
      title: 'Card Cloner Tycoon',
      description: 'Learn fraud detection by thinking like a fraudster',
      icon: CreditCard,
      difficulty: 'Expert',
      estimatedTime: '10-15 min',
      rewards: 'Up to 2500 points',
      color: 'destructive',
      stats: userProgress.stats.cardCloner
    }
  ];

  const renderGame = () => {
    switch (selectedGame) {
      case 'spot-the-fraud':
        return <SpotTheFraud onBack={() => setSelectedGame(null)} />;
      case 'fraud-analyst':
        return <FraudAnalyst onBack={() => setSelectedGame(null)} />;
      case 'predict-pattern':
        return <PredictThePattern onBack={() => setSelectedGame(null)} />;
      case 'guess-origin':
        return <GuessTheOrigin onBack={() => setSelectedGame(null)} />;
      case 'card-cloner':
        return <CardClonerTycoon onBack={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return renderGame();
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-security bg-clip-text text-transparent mb-2">
                CyberSense Academy
              </h1>
              <p className="text-muted-foreground text-lg">Master fraud detection through interactive games</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-2xl font-bold">{userProgress.totalScore.toLocaleString()}</span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {userProgress.rank}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Games Completed</span>
                  <span className="font-semibold">{userProgress.gamesPlayed}</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Rank</span>
                  <span className="text-sm font-medium">Senior Detective</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProgress.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Accuracy</span>
                  <span className="font-semibold">76%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Streak</span>
                  <span className="font-semibold">12 games</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Time</span>
                  <span className="font-semibold">4.2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Choose Your Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <Card key={game.id} className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-${game.color}/10`}>
                        <IconComponent className={`w-6 h-6 text-${game.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {game.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{game.stats.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Best Score</span>
                        <span className="font-medium">{game.stats.bestScore}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium">{game.stats.level}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{game.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>{game.rewards}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setSelectedGame(game.id)}
                      className="w-full"
                      variant="default"
                    >
                      Start Mission
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Global Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { rank: 1, name: "CyberMaster", score: 5420, badge: "Elite Detective" },
                { rank: 2, name: "FraudHunter", score: 4980, badge: "Senior Detective" },
                { rank: 3, name: "PatternSeeker", score: 4750, badge: "Senior Detective" },
                { rank: 4, name: "You", score: userProgress.totalScore, badge: userProgress.rank, isUser: true },
                { rank: 5, name: "SecurityPro", score: 2640, badge: "Fraud Detective" }
              ].map((player) => (
                <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                  player.isUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      player.rank === 1 ? 'bg-warning text-warning-foreground' :
                      player.rank === 2 ? 'bg-muted text-muted-foreground' :
                      player.rank === 3 ? 'bg-accent text-accent-foreground' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.badge}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{player.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
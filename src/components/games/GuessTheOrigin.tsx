import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, MapPin, Globe, Plane, CreditCard } from 'lucide-react';

interface Location {
  name: string;
  country: string;
  coordinates: [number, number];
  timezone: string;
}

interface TransactionScenario {
  id: string;
  customerLocation: Location;
  transactionLocation: Location;
  transactionTime: string;
  customerLocalTime: string;
  amount: number;
  merchant: string;
  category: string;
  timeDifference: number; // in hours
  distance: number; // in miles
  isLegitimate: boolean;
  explanation: string;
}

interface GuessTheOriginProps {
  onBack: () => void;
}

export const GuessTheOrigin = ({ onBack }: GuessTheOriginProps) => {
  const [currentScenario, setCurrentScenario] = useState<TransactionScenario | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const scenarios: TransactionScenario[] = [
    {
      id: '1',
      customerLocation: { name: 'New York', country: 'USA', coordinates: [40.7128, -74.0060], timezone: 'EST' },
      transactionLocation: { name: 'London', country: 'UK', coordinates: [51.5074, -0.1278], timezone: 'GMT' },
      transactionTime: '2:30 PM',
      customerLocalTime: '9:30 AM',
      amount: 156.78,
      merchant: 'Harrods Department Store',
      category: 'Shopping',
      timeDifference: 5,
      distance: 3459,
      isLegitimate: true,
      explanation: 'Customer is likely traveling in London. The 5-hour time difference and reasonable shopping amount at a famous department store suggest legitimate travel spending.'
    },
    {
      id: '2',
      customerLocation: { name: 'Los Angeles', country: 'USA', coordinates: [34.0522, -118.2437], timezone: 'PST' },
      transactionLocation: { name: 'Sydney', country: 'Australia', coordinates: [-33.8688, 151.2093], timezone: 'AEST' },
      transactionTime: '11:45 AM',
      customerLocalTime: '4:45 PM (Previous Day)',
      amount: 4999.99,
      merchant: 'Electronics Mega Store',
      category: 'Electronics',
      timeDifference: 19,
      distance: 7488,
      isLegitimate: false,
      explanation: 'Impossible travel time! Customer was in LA yesterday evening and transaction shows in Sydney the next morning. No commercial flight can cover 7,488 miles in ~19 hours with time zones.'
    },
    {
      id: '3',
      customerLocation: { name: 'Chicago', country: 'USA', coordinates: [41.8781, -87.6298], timezone: 'CST' },
      transactionLocation: { name: 'Paris', country: 'France', coordinates: [48.8566, 2.3522], timezone: 'CET' },
      transactionTime: '8:15 PM',
      customerLocalTime: '1:15 PM',
      amount: 89.50,
      merchant: 'Cafe de la Paix',
      category: 'Food & Dining',
      timeDifference: 7,
      distance: 4143,
      isLegitimate: true,
      explanation: 'Reasonable travel scenario. Customer likely flew to Paris (8+ hour flight is feasible) and is dining at a famous cafe. Time difference and amount are consistent with legitimate travel.'
    },
    {
      id: '4',
      customerLocation: { name: 'Miami', country: 'USA', coordinates: [25.7617, -80.1918], timezone: 'EST' },
      transactionLocation: { name: 'Tokyo', country: 'Japan', coordinates: [35.6762, 139.6503], timezone: 'JST' },
      transactionTime: '3:00 AM',
      customerLocalTime: '1:00 PM (Previous Day)',
      amount: 1.00,
      merchant: 'Test Merchant 123',
      category: 'Other',
      timeDifference: 14,
      distance: 6755,
      isLegitimate: false,
      explanation: 'Classic card testing fraud! $1 test transaction at suspicious merchant, impossible timing (would need to travel 6,755 miles in ~14 hours), and occurring at 3 AM local time.'
    },
    {
      id: '5',
      customerLocation: { name: 'Seattle', country: 'USA', coordinates: [47.6062, -122.3321], timezone: 'PST' },
      transactionLocation: { name: 'Vancouver', country: 'Canada', coordinates: [49.2827, -123.1207], timezone: 'PST' },
      transactionTime: '7:30 PM',
      customerLocalTime: '7:30 PM',
      amount: 234.56,
      merchant: 'Pacific Hotel',
      category: 'Travel',
      timeDifference: 0,
      distance: 120,
      isLegitimate: true,
      explanation: 'Very reasonable cross-border transaction. Seattle to Vancouver is only 120 miles (2-3 hour drive), same timezone, and hotel charge suggests legitimate travel.'
    },
    {
      id: '6',
      customerLocation: { name: 'Boston', country: 'USA', coordinates: [42.3601, -71.0589], timezone: 'EST' },
      transactionLocation: { name: 'Lagos', country: 'Nigeria', coordinates: [6.5244, 3.3792], timezone: 'WAT' },
      transactionTime: '2:45 AM',
      customerLocalTime: '8:45 PM (Previous Day)',
      amount: 2500.00,
      merchant: 'Quick Electronics',
      category: 'Electronics',
      timeDifference: 6,
      distance: 5247,
      isLegitimate: false,
      explanation: 'Highly suspicious! Large electronics purchase in Lagos at 2:45 AM, customer was in Boston ~6 hours earlier. No legitimate way to travel 5,247 miles in 6 hours.'
    }
  ];

  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (!currentScenario && !gameOver) {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setCurrentScenario(randomScenario);
    }
  }, [currentScenario, gameOver]);

  const handleAnswer = (isLegitimate: boolean) => {
    if (!currentScenario) return;

    const correct = isLegitimate === currentScenario.isLegitimate;
    const points = correct ? (200 * level) : 0;
    
    setQuestionsAnswered(questionsAnswered + 1);
    
    if (correct) {
      setScore(score + points);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setLastAnswer({ 
      correct, 
      explanation: currentScenario.explanation
    });

    setShowFeedback(true);
    setCurrentScenario(null);

    // Level up every 5 correct answers
    if (questionsAnswered > 0 && questionsAnswered % 5 === 0) {
      setLevel(level + 1);
      setTimeLeft(40);
    }
  };

  const continuePlaying = () => {
    setShowFeedback(false);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(40);
    setGameOver(false);
    setShowFeedback(false);
    setCurrentScenario(null);
    setStreak(0);
    setQuestionsAnswered(0);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl">Mission Complete!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold mb-2">Final Score: {score.toLocaleString()}</h3>
                <p className="text-muted-foreground mb-4">You analyzed {questionsAnswered} global transactions</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{level}</div>
                    <div className="text-sm text-muted-foreground">Level Reached</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{streak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="flex-1">
                  New Mission
                </Button>
                <Button onClick={onBack} variant="outline" className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl">Analysis Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className={`text-6xl mb-4 ${lastAnswer?.correct ? 'text-secondary' : 'text-destructive'}`}>
                  {lastAnswer?.correct ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${lastAnswer?.correct ? 'text-secondary' : 'text-destructive'}`}>
                  {lastAnswer?.correct ? 'Correct Analysis!' : 'Incorrect Analysis'}
                </h3>
                <p className="text-muted-foreground mb-4">{lastAnswer?.explanation}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{streak}</div>
                    <div className="text-sm text-muted-foreground">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{level}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                </div>
              </div>
              
              <Button onClick={continuePlaying} className="w-full">
                Continue Mission
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">Global Fraud Detection</CardTitle>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Score: {score.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Level: {level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Streak: {streak}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={(timeLeft / 40) * 100} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {currentScenario && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Analyze This Global Transaction</h3>
                  <p className="text-muted-foreground">Consider the geography, timing, and travel logistics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Location */}
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-secondary" />
                        Customer Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{currentScenario.customerLocation.name}</div>
                          <div className="text-muted-foreground">{currentScenario.customerLocation.country}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Timezone</span>
                            <div className="font-medium">{currentScenario.customerLocation.timezone}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Local Time</span>
                            <div className="font-medium">{currentScenario.customerLocalTime}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Location */}
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Transaction Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{currentScenario.transactionLocation.name}</div>
                          <div className="text-muted-foreground">{currentScenario.transactionLocation.country}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Timezone</span>
                            <div className="font-medium">{currentScenario.transactionLocation.timezone}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Transaction Time</span>
                            <div className="font-medium">{currentScenario.transactionTime}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transaction Details */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <div className="text-xl font-bold">${currentScenario.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Merchant</span>
                        <div className="text-lg font-medium">{currentScenario.merchant}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline">{currentScenario.category}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <div className="text-lg font-medium">{currentScenario.distance.toLocaleString()} miles</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Analysis */}
                <Card className="shadow-card border-warning">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plane className="w-5 h-5 text-warning" />
                      Travel Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Distance to Travel</span>
                          <span className="font-medium">{currentScenario.distance.toLocaleString()} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Time Difference</span>
                          <span className="font-medium">{currentScenario.timeDifference}h</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Flight Time</span>
                          <span className="font-medium">~{Math.round(currentScenario.distance / 500)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Feasible Travel?</span>
                          <Badge variant={currentScenario.distance / 500 <= currentScenario.timeDifference ? "secondary" : "destructive"}>
                            {currentScenario.distance / 500 <= currentScenario.timeDifference ? "Possible" : "Impossible"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Decision Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="h-16 text-lg border-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">✈️</div>
                      <div>Legitimate Travel</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="h-16 text-lg border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🚨</div>
                      <div>Fraud Alert</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
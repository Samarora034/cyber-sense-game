import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  time: string;
  category: string;
  isFraud: boolean;
  suspiciousFactors: string[];
}

interface SpotTheFraudProps {
  onBack: () => void;
}

export const SpotTheFraud = ({ onBack }: SpotTheFraudProps) => {
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [streak, setStreak] = useState(0);

  const transactions: Transaction[] = [
    {
      id: '1',
      amount: 2.99,
      merchant: 'Coffee Shop',
      location: 'New York, NY',
      time: '2:30 PM',
      category: 'Food & Dining',
      isFraud: false,
      suspiciousFactors: []
    },
    {
      id: '2',
      amount: 4999.99,
      merchant: 'Electronics Store',
      location: 'Lagos, Nigeria',
      time: '3:45 AM',
      category: 'Electronics',
      isFraud: true,
      suspiciousFactors: ['Unusual location', 'High amount', 'Unusual time', 'Foreign country']
    },
    {
      id: '3',
      amount: 89.99,
      merchant: 'Gas Station',
      location: 'Los Angeles, CA',
      time: '8:15 AM',
      category: 'Gas & Automotive',
      isFraud: false,
      suspiciousFactors: []
    },
    {
      id: '4',
      amount: 1.00,
      merchant: 'Unknown Merchant',
      location: 'Moscow, Russia',
      time: '11:59 PM',
      category: 'Other',
      isFraud: true,
      suspiciousFactors: ['Test transaction', 'Foreign country', 'Unknown merchant', 'Card testing']
    },
    {
      id: '5',
      amount: 156.78,
      merchant: 'Amazon',
      location: 'Seattle, WA',
      time: '4:22 PM',
      category: 'Shopping',
      isFraud: false,
      suspiciousFactors: []
    },
    {
      id: '6',
      amount: 899.99,
      merchant: 'Luxury Store',
      location: 'Paris, France',
      time: '2:15 AM',
      category: 'Shopping',
      isFraud: true,
      suspiciousFactors: ['High amount', 'Foreign country', 'Unusual time', 'Luxury purchase']
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
    if (!currentTransaction && !gameOver) {
      const randomTransaction = transactions[Math.floor(Math.random() * transactions.length)];
      setCurrentTransaction(randomTransaction);
    }
  }, [currentTransaction, gameOver]);

  const handleAnswer = (isFraud: boolean) => {
    if (!currentTransaction) return;

    const correct = isFraud === currentTransaction.isFraud;
    const points = correct ? (100 * level) : 0;
    
    if (correct) {
      setScore(score + points);
      setStreak(streak + 1);
      setLastAnswer({ 
        correct: true, 
        explanation: currentTransaction.isFraud 
          ? `Correct! This transaction was fraudulent. Red flags: ${currentTransaction.suspiciousFactors.join(', ')}`
          : "Correct! This was a legitimate transaction with no suspicious indicators."
      });
    } else {
      setLives(lives - 1);
      setStreak(0);
      setLastAnswer({ 
        correct: false, 
        explanation: currentTransaction.isFraud 
          ? `Wrong! This was fraudulent. Red flags you missed: ${currentTransaction.suspiciousFactors.join(', ')}`
          : "Wrong! This was actually a legitimate transaction. Be careful not to flag normal purchases."
      });
    }

    setShowFeedback(true);
    setCurrentTransaction(null);

    if (lives <= 1 && !correct) {
      setGameOver(true);
    }
  };

  const continuePlaying = () => {
    setShowFeedback(false);
    if (score >= level * 500) {
      setLevel(level + 1);
      setTimeLeft(30);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimeLeft(30);
    setGameOver(false);
    setShowFeedback(false);
    setCurrentTransaction(null);
    setStreak(0);
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
                <CardTitle className="text-2xl">Game Over!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Final Score: {score.toLocaleString()}</h3>
                <p className="text-muted-foreground mb-4">You reached level {level} with a best streak of {streak}</p>
                
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
                  Play Again
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
                <CardTitle className="text-2xl">Feedback</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                {lastAnswer?.correct ? (
                  <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                )}
                <h3 className={`text-2xl font-bold mb-2 ${lastAnswer?.correct ? 'text-secondary' : 'text-destructive'}`}>
                  {lastAnswer?.correct ? 'Correct!' : 'Incorrect!'}
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
                    <div className="text-2xl font-bold text-destructive">{lives}</div>
                    <div className="text-sm text-muted-foreground">Lives</div>
                  </div>
                </div>
              </div>
              
              <Button onClick={continuePlaying} className="w-full">
                Continue Playing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">Spot the Fraud</CardTitle>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Lives</span>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < lives ? 'bg-destructive' : 'bg-muted'}`} />
                  ))}
                </div>
              </div>
              <Progress value={(timeLeft / 30) * 100} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {currentTransaction && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Is this transaction fraudulent?</h3>
                  <p className="text-muted-foreground">Review the details carefully and make your decision</p>
                </div>

                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Transaction Details</CardTitle>
                      <Badge variant="outline">{currentTransaction.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <div className="text-xl font-bold">${currentTransaction.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Time</span>
                          <div className="text-lg font-medium">{currentTransaction.time}</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Merchant</span>
                        <div className="text-lg font-medium">{currentTransaction.merchant}</div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Location</span>
                        <div className="text-lg font-medium">{currentTransaction.location}</div>
                      </div>
                      
                      {currentTransaction.suspiciousFactors.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Potential Red Flags</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {currentTransaction.suspiciousFactors.map((factor, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="h-16 text-lg"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Legitimate
                  </Button>
                  <Button 
                    onClick={() => handleAnswer(true)}
                    variant="destructive"
                    className="h-16 text-lg"
                  >
                    <XCircle className="w-6 h-6 mr-2" />
                    Fraudulent
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
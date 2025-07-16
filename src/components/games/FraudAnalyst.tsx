import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Shield, User, CreditCard, MapPin, AlertTriangle } from 'lucide-react';

interface CustomerProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  accountAge: number;
  riskScore: number;
  previousFraud: boolean;
  cardType: string;
  creditLimit: number;
  averageMonthlySpending: number;
}

interface TransactionCase {
  id: string;
  customer: CustomerProfile;
  amount: number;
  merchant: string;
  location: string;
  time: string;
  category: string;
  deviceId: string;
  ipAddress: string;
  velocityFlags: string[];
  recommendedAction: 'approve' | 'decline' | 'escalate';
  reasoning: string;
}

interface FraudAnalystProps {
  onBack: () => void;
}

export const FraudAnalyst = ({ onBack }: FraudAnalystProps) => {
  const [currentCase, setCurrentCase] = useState<TransactionCase | null>(null);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState("Junior Analyst");
  const [casesReviewed, setCasesReviewed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastDecision, setLastDecision] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [accuracy, setAccuracy] = useState(100);
  const [correctDecisions, setCorrectDecisions] = useState(0);

  const cases: TransactionCase[] = [
    {
      id: '1',
      customer: {
        id: 'CUST001',
        name: 'Alice Johnson',
        age: 34,
        location: 'New York, NY',
        accountAge: 5,
        riskScore: 2,
        previousFraud: false,
        cardType: 'Visa Gold',
        creditLimit: 5000,
        averageMonthlySpending: 1200
      },
      amount: 89.99,
      merchant: 'Amazon',
      location: 'Seattle, WA',
      time: '2:30 PM',
      category: 'Online Shopping',
      deviceId: 'DEV_123456',
      ipAddress: '192.168.1.100',
      velocityFlags: [],
      recommendedAction: 'approve',
      reasoning: 'Normal transaction within spending pattern, legitimate merchant, no red flags.'
    },
    {
      id: '2',
      customer: {
        id: 'CUST002',
        name: 'Bob Smith',
        age: 45,
        location: 'Los Angeles, CA',
        accountAge: 8,
        riskScore: 7,
        previousFraud: true,
        cardType: 'Mastercard Platinum',
        creditLimit: 10000,
        averageMonthlySpending: 2500
      },
      amount: 4999.99,
      merchant: 'Electronics Palace',
      location: 'Mumbai, India',
      time: '3:45 AM',
      category: 'Electronics',
      deviceId: 'DEV_UNKNOWN',
      ipAddress: '203.192.15.78',
      velocityFlags: ['Foreign country', 'Unusual time', 'High amount', 'New device'],
      recommendedAction: 'decline',
      reasoning: 'Multiple red flags: foreign transaction, unusual time, high amount, previous fraud history, unknown device.'
    },
    {
      id: '3',
      customer: {
        id: 'CUST003',
        name: 'Carol Davis',
        age: 28,
        location: 'Chicago, IL',
        accountAge: 3,
        riskScore: 4,
        previousFraud: false,
        cardType: 'Visa Classic',
        creditLimit: 3000,
        averageMonthlySpending: 800
      },
      amount: 2500.00,
      merchant: 'Luxury Boutique',
      location: 'Paris, France',
      time: '10:15 AM',
      category: 'Fashion',
      deviceId: 'DEV_789012',
      ipAddress: '85.115.47.92',
      velocityFlags: ['Foreign country', 'High amount vs average'],
      recommendedAction: 'escalate',
      reasoning: 'Unusual high-value foreign transaction, but could be legitimate travel purchase. Needs human review.'
    }
  ];

  const ranks = [
    { name: "Junior Analyst", minScore: 0, color: "muted" },
    { name: "Fraud Analyst", minScore: 500, color: "secondary" },
    { name: "Senior Analyst", minScore: 1000, color: "primary" },
    { name: "Principal Analyst", minScore: 2000, color: "warning" },
    { name: "Fraud Manager", minScore: 3500, color: "destructive" }
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
    if (!currentCase && !gameOver) {
      const randomCase = cases[Math.floor(Math.random() * cases.length)];
      setCurrentCase(randomCase);
    }
  }, [currentCase, gameOver]);

  useEffect(() => {
    const currentRank = ranks.reduce((prev, curr) => 
      score >= curr.minScore ? curr : prev
    );
    setRank(currentRank.name);
  }, [score]);

  const handleDecision = (decision: 'approve' | 'decline' | 'escalate') => {
    if (!currentCase) return;

    const correct = decision === currentCase.recommendedAction;
    const points = correct ? 150 : 0;
    
    setCasesReviewed(casesReviewed + 1);
    
    if (correct) {
      setScore(score + points);
      setCorrectDecisions(correctDecisions + 1);
    }
    
    setAccuracy(Math.round((correct ? correctDecisions + 1 : correctDecisions) / (casesReviewed + 1) * 100));
    
    setLastDecision({
      correct,
      explanation: `${correct ? 'Correct' : 'Incorrect'} decision. ${currentCase.reasoning}`
    });

    setShowFeedback(true);
    setCurrentCase(null);
    setTimeLeft(45); // Reset timer for next case
  };

  const continuePlaying = () => {
    setShowFeedback(false);
  };

  const resetGame = () => {
    setScore(0);
    setRank("Junior Analyst");
    setCasesReviewed(0);
    setTimeLeft(45);
    setGameOver(false);
    setShowFeedback(false);
    setCurrentCase(null);
    setAccuracy(100);
    setCorrectDecisions(0);
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
                <CardTitle className="text-2xl">Shift Complete!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold mb-2">Final Score: {score.toLocaleString()}</h3>
                <p className="text-muted-foreground mb-4">You achieved the rank of {rank}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{casesReviewed}</div>
                    <div className="text-sm text-muted-foreground">Cases Reviewed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="flex-1">
                  New Shift
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
                <CardTitle className="text-2xl">Case Review</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className={`text-6xl mb-4 ${lastDecision?.correct ? 'text-secondary' : 'text-destructive'}`}>
                  {lastDecision?.correct ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${lastDecision?.correct ? 'text-secondary' : 'text-destructive'}`}>
                  {lastDecision?.correct ? 'Good Decision!' : 'Review Needed'}
                </h3>
                <p className="text-muted-foreground mb-4">{lastDecision?.explanation}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{casesReviewed}</div>
                    <div className="text-sm text-muted-foreground">Cases</div>
                  </div>
                </div>
              </div>
              
              <Button onClick={continuePlaying} className="w-full">
                Next Case
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
              <CardTitle className="text-2xl">Fraud Analysis Center</CardTitle>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Score: {score.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rank}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Accuracy: {accuracy}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={(timeLeft / 45) * 100} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {currentCase && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Transaction Risk Assessment</h3>
                  <p className="text-muted-foreground">Review the case details and make your decision</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Profile */}
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name</span>
                          <span className="font-medium">{currentCase.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Age</span>
                          <span className="font-medium">{currentCase.customer.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Location</span>
                          <span className="font-medium">{currentCase.customer.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Account Age</span>
                          <span className="font-medium">{currentCase.customer.accountAge} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          <Badge variant={currentCase.customer.riskScore > 5 ? "destructive" : "secondary"}>
                            {currentCase.customer.riskScore}/10
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Previous Fraud</span>
                          <Badge variant={currentCase.customer.previousFraud ? "destructive" : "secondary"}>
                            {currentCase.customer.previousFraud ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Monthly Spending</span>
                          <span className="font-medium">${currentCase.customer.averageMonthlySpending}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Details */}
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Transaction Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="text-xl font-bold">${currentCase.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Merchant</span>
                          <span className="font-medium">{currentCase.merchant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Location</span>
                          <span className="font-medium">{currentCase.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Time</span>
                          <span className="font-medium">{currentCase.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category</span>
                          <Badge variant="outline">{currentCase.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Device</span>
                          <span className="font-medium text-xs">{currentCase.deviceId}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Indicators */}
                {currentCase.velocityFlags.length > 0 && (
                  <Card className="shadow-fraud">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Risk Indicators
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {currentCase.velocityFlags.map((flag, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Decision Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    onClick={() => handleDecision('approve')}
                    variant="outline"
                    className="h-16 text-lg border-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <span className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div>Approve</div>
                    </span>
                  </Button>
                  <Button 
                    onClick={() => handleDecision('escalate')}
                    variant="outline"
                    className="h-16 text-lg border-warning hover:bg-warning hover:text-warning-foreground"
                  >
                    <span className="text-center">
                      <div className="text-2xl mb-1">⚠️</div>
                      <div>Escalate</div>
                    </span>
                  </Button>
                  <Button 
                    onClick={() => handleDecision('decline')}
                    variant="outline"
                    className="h-16 text-lg border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <span className="text-center">
                      <div className="text-2xl mb-1">❌</div>
                      <div>Decline</div>
                    </span>
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
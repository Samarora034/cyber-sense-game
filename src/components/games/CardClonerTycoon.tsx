import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, CreditCard, Shield, AlertTriangle, Eye, Zap } from 'lucide-react';

interface FraudAttempt {
  id: string;
  type: 'cardTesting' | 'skimming' | 'onlineFraud' | 'atmFraud';
  description: string;
  difficulty: number;
  potentialGain: number;
  detectionMethods: string[];
  preventionTips: string[];
  caught: boolean;
  explanation: string;
}

interface DetectionSystem {
  name: string;
  description: string;
  effectiveness: number;
  triggers: string[];
}

interface CardClonerTycoonProps {
  onBack: () => void;
}

export const CardClonerTycoon = ({ onBack }: CardClonerTycoonProps) => {
  const [currentAttempt, setCurrentAttempt] = useState<FraudAttempt | null>(null);
  const [score, setScore] = useState(0);
  const [heat, setHeat] = useState(0); // Detection heat level
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<FraudAttempt | null>(null);
  const [successfulFrauds, setSuccessfulFrauds] = useState(0);
  const [caughtFrauds, setCaughtFrauds] = useState(0);

  const detectionSystems: DetectionSystem[] = [
    {
      name: "Velocity Checking",
      description: "Monitors transaction frequency and patterns",
      effectiveness: 85,
      triggers: ["Multiple transactions", "Rapid card usage", "Geographic velocity"]
    },
    {
      name: "Device Fingerprinting",
      description: "Tracks unique device characteristics",
      effectiveness: 90,
      triggers: ["New/unknown device", "Device inconsistencies", "Suspicious browser patterns"]
    },
    {
      name: "Behavioral Analysis",
      description: "Analyzes user behavior patterns",
      effectiveness: 75,
      triggers: ["Unusual spending patterns", "Time-based anomalies", "Merchant preferences"]
    },
    {
      name: "Geolocation Tracking",
      description: "Monitors location-based transaction patterns",
      effectiveness: 80,
      triggers: ["Impossible travel times", "Foreign transactions", "Location jumps"]
    },
    {
      name: "Amount Analysis",
      description: "Flags unusual transaction amounts",
      effectiveness: 70,
      triggers: ["Test transactions ($1)", "High-value purchases", "Round numbers"]
    }
  ];

  const fraudAttempts: FraudAttempt[] = [
    {
      id: '1',
      type: 'cardTesting',
      description: 'Test stolen card with small $1 purchases to verify if card is active',
      difficulty: 2,
      potentialGain: 1,
      detectionMethods: ['Amount Analysis', 'Velocity Checking'],
      preventionTips: [
        'Banks flag multiple $1 transactions as testing',
        'Velocity checks detect rapid small transactions',
        'Card issuers have test transaction detection algorithms'
      ],
      caught: true,
      explanation: 'Card testing is easily detected by modern fraud systems. Multiple $1 transactions trigger immediate alerts.'
    },
    {
      id: '2',
      type: 'skimming',
      description: 'Use skimmed card data at gas stations and ATMs for cash withdrawals',
      difficulty: 4,
      potentialGain: 500,
      detectionMethods: ['Geolocation Tracking', 'Behavioral Analysis'],
      preventionTips: [
        'ATM cameras record all transactions',
        'Chip cards are much harder to clone than magnetic strips',
        'Banks monitor ATM usage patterns for anomalies'
      ],
      caught: false,
      explanation: 'Skimming can be successful but leaves physical evidence. Modern chip cards make this harder.'
    },
    {
      id: '3',
      type: 'onlineFraud',
      description: 'Use stolen card details for high-value online electronics purchases',
      difficulty: 6,
      potentialGain: 2000,
      detectionMethods: ['Device Fingerprinting', 'Behavioral Analysis', 'Geolocation Tracking'],
      preventionTips: [
        'Online merchants use sophisticated fraud detection',
        'Device fingerprinting can identify fraudulent devices',
        'Shipping addresses are validated against cardholder data'
      ],
      caught: true,
      explanation: 'Online fraud is heavily monitored. Device fingerprinting, IP tracking, and shipping validation make this very risky.'
    },
    {
      id: '4',
      type: 'atmFraud',
      description: 'Clone cards and use them at ATMs in low-surveillance areas',
      difficulty: 5,
      potentialGain: 800,
      detectionMethods: ['Geolocation Tracking', 'Velocity Checking'],
      preventionTips: [
        'ATM networks share fraud data in real-time',
        'Geographic analysis detects unusual ATM usage patterns',
        'Daily withdrawal limits reduce potential losses'
      ],
      caught: false,
      explanation: 'ATM fraud can work but is limited by withdrawal limits and increasing surveillance.'
    },
    {
      id: '5',
      type: 'onlineFraud',
      description: 'Purchase gift cards online to convert stolen card data to untraceable value',
      difficulty: 3,
      potentialGain: 200,
      detectionMethods: ['Behavioral Analysis', 'Amount Analysis'],
      preventionTips: [
        'Gift card purchases are heavily monitored for fraud',
        'Many merchants limit gift card purchases per transaction',
        'Digital gift cards can be tracked and cancelled'
      ],
      caught: true,
      explanation: 'Gift card fraud is a common technique but merchants have specific controls for gift card purchases.'
    },
    {
      id: '6',
      type: 'skimming',
      description: 'Install skimming devices at busy retail locations for mass card harvesting',
      difficulty: 7,
      potentialGain: 5000,
      detectionMethods: ['All systems - high-risk operation'],
      preventionTips: [
        'Retail locations have extensive security cameras',
        'Chip cards make skimming much more difficult',
        'Employees are trained to spot skimming devices',
        'Law enforcement actively monitors for skimming operations'
      ],
      caught: true,
      explanation: 'Large-scale skimming operations are high-risk and heavily prosecuted. Modern security makes this extremely dangerous.'
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
    if (!currentAttempt && !gameOver && !showEducation) {
      const availableAttempts = fraudAttempts.filter(attempt => 
        attempt.difficulty <= Math.min(round + 1, 7)
      );
      const randomAttempt = availableAttempts[Math.floor(Math.random() * availableAttempts.length)];
      setCurrentAttempt(randomAttempt);
    }
  }, [currentAttempt, gameOver, showEducation, round]);

  const attemptFraud = () => {
    if (!currentAttempt) return;

    const detectionRisk = Math.min(heat + currentAttempt.difficulty * 10, 100);
    const caught = Math.random() * 100 < detectionRisk || currentAttempt.caught;
    
    if (caught) {
      setHeat(Math.min(heat + 30, 100));
      setCaughtFrauds(caughtFrauds + 1);
      setScore(Math.max(0, score - 100)); // Penalty for getting caught
    } else {
      setScore(score + currentAttempt.potentialGain);
      setHeat(Math.min(heat + 10, 100));
      setSuccessfulFrauds(successfulFrauds + 1);
    }

    setLastAttempt({ ...currentAttempt, caught });
    setCurrentAttempt(null);
    setShowEducation(true);
    setRound(round + 1);
    setTimeLeft(60);
  };

  const skipAttempt = () => {
    if (!currentAttempt) return;
    
    setHeat(Math.max(0, heat - 5)); // Laying low reduces heat
    setCurrentAttempt(null);
    setRound(round + 1);
    setTimeLeft(60);
  };

  const continueGame = () => {
    setShowEducation(false);
    
    if (heat >= 100) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setHeat(0);
    setRound(1);
    setTimeLeft(60);
    setGameOver(false);
    setShowEducation(false);
    setCurrentAttempt(null);
    setSuccessfulFrauds(0);
    setCaughtFrauds(0);
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
                <CardTitle className="text-2xl">Game Over - Caught!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🚨</div>
                <h3 className="text-2xl font-bold mb-2">Final Score: {score.toLocaleString()}</h3>
                <p className="text-muted-foreground mb-4">
                  You made it to round {round} before the fraud detection systems caught you!
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{successfulFrauds}</div>
                    <div className="text-sm text-muted-foreground">Successful Attempts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{caughtFrauds}</div>
                    <div className="text-sm text-muted-foreground">Times Caught</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg mb-6">
                  <h4 className="font-bold mb-2">What You Learned:</h4>
                  <p className="text-sm text-muted-foreground">
                    Modern fraud detection systems use multiple layers of security to catch fraudsters. 
                    Each attempt increases your risk profile, making it harder to avoid detection.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="flex-1">
                  Try Again
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

  if (showEducation && lastAttempt) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl">Fraud Education</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className={`text-6xl mb-4 ${lastAttempt.caught ? 'text-destructive' : 'text-warning'}`}>
                  {lastAttempt.caught ? '🚨' : '💰'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${lastAttempt.caught ? 'text-destructive' : 'text-warning'}`}>
                  {lastAttempt.caught ? 'Caught by Security!' : 'Temporary Success'}
                </h3>
                <p className="text-muted-foreground mb-4">{lastAttempt.explanation}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{heat}%</div>
                    <div className="text-sm text-muted-foreground">Heat Level</div>
                  </div>
                </div>
              </div>

              <Card className="shadow-card mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    How This Fraud is Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lastAttempt.detectionMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Prevention Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lastAttempt.preventionTips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Button onClick={continueGame} className="w-full">
                Continue to Next Round
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
              <CardTitle className="text-2xl">Card Cloner Tycoon</CardTitle>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Score: {score.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Round: {round}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Detection Heat</span>
                <span className="text-sm font-bold text-destructive">{heat}%</span>
              </div>
              <Progress value={heat} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time Remaining</span>
                <span className="text-sm">{timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {currentAttempt && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Choose Your Next Move</h3>
                  <p className="text-muted-foreground">
                    Remember: Each attempt increases your detection risk!
                  </p>
                </div>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Fraud Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-lg">{currentAttempt.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Difficulty</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${
                                i < currentAttempt.difficulty ? 'bg-destructive' : 'bg-muted'
                              }`} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Potential Gain</span>
                          <div className="text-xl font-bold text-warning">
                            ${currentAttempt.potentialGain.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Detection Risk</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentAttempt.detectionMethods.map((method, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Active Detection Systems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detectionSystems.slice(0, 3).map((system, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium">{system.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">{system.description}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Effectiveness:</span>
                            <Progress value={system.effectiveness} className="h-1 flex-1" />
                            <span className="text-xs">{system.effectiveness}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={attemptFraud}
                    variant="destructive"
                    className="h-16 text-lg"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">💳</div>
                      <div>Attempt Fraud</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={skipAttempt}
                    variant="outline"
                    className="h-16 text-lg"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">⏭️</div>
                      <div>Skip & Lay Low</div>
                    </div>
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Educational Purpose:</strong> This game teaches fraud detection methods. 
                    Real fraud is illegal and has serious consequences!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
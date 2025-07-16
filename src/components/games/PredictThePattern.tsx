import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, TrendingUp, Brain, Database, Target } from 'lucide-react';

interface DataPoint {
  amount: number;
  merchant: string;
  location: string;
  time: string;
  category: string;
  isWeekend: boolean;
  isForeign: boolean;
  velocityScore: number;
  riskScore: number;
  isFraud: boolean;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface PredictThePatternProps {
  onBack: () => void;
}

export const PredictThePattern = ({ onBack }: PredictThePatternProps) => {
  const [dataset, setDataset] = useState<DataPoint[]>([]);
  const [modelTrained, setModelTrained] = useState(false);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics>({ accuracy: 0, precision: 0, recall: 0, f1Score: 0 });
  const [testData, setTestData] = useState<DataPoint[]>([]);
  const [predictions, setPredictions] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDataset: DataPoint[] = [
    { amount: 50, merchant: "Coffee Shop", location: "New York", time: "09:00", category: "Food", isWeekend: false, isForeign: false, velocityScore: 1, riskScore: 2, isFraud: false },
    { amount: 5000, merchant: "Unknown", location: "Nigeria", time: "03:00", category: "Online", isWeekend: true, isForeign: true, velocityScore: 8, riskScore: 9, isFraud: true },
    { amount: 120, merchant: "Gas Station", location: "California", time: "14:00", category: "Gas", isWeekend: false, isForeign: false, velocityScore: 2, riskScore: 1, isFraud: false },
    { amount: 1, merchant: "Test Merchant", location: "Russia", time: "23:59", category: "Other", isWeekend: true, isForeign: true, velocityScore: 9, riskScore: 10, isFraud: true },
    { amount: 89, merchant: "Amazon", location: "Washington", time: "16:00", category: "Shopping", isWeekend: false, isForeign: false, velocityScore: 1, riskScore: 1, isFraud: false },
    { amount: 2500, merchant: "Luxury Store", location: "Paris", time: "02:00", category: "Fashion", isWeekend: true, isForeign: true, velocityScore: 7, riskScore: 8, isFraud: true },
    { amount: 25, merchant: "Restaurant", location: "Texas", time: "19:00", category: "Food", isWeekend: false, isForeign: false, velocityScore: 1, riskScore: 1, isFraud: false },
    { amount: 999, merchant: "Electronics", location: "China", time: "01:00", category: "Tech", isWeekend: true, isForeign: true, velocityScore: 6, riskScore: 7, isFraud: true },
  ];

  const generateTestData = (): DataPoint[] => {
    return [
      { amount: 75, merchant: "Grocery Store", location: "New York", time: "18:00", category: "Food", isWeekend: false, isForeign: false, velocityScore: 1, riskScore: 2, isFraud: false },
      { amount: 3000, merchant: "Suspicious Store", location: "Unknown", time: "04:00", category: "Online", isWeekend: true, isForeign: true, velocityScore: 9, riskScore: 8, isFraud: true },
      { amount: 45, merchant: "Pharmacy", location: "California", time: "11:00", category: "Health", isWeekend: false, isForeign: false, velocityScore: 1, riskScore: 1, isFraud: false },
      { amount: 1500, merchant: "Jewelry Store", location: "India", time: "03:30", category: "Luxury", isWeekend: true, isForeign: true, velocityScore: 8, riskScore: 9, isFraud: true },
      { amount: 200, merchant: "Department Store", location: "Illinois", time: "15:00", category: "Shopping", isWeekend: false, isForeign: false, velocityScore: 2, riskScore: 2, isFraud: false },
    ];
  };

  const calculateRiskScore = (data: DataPoint): number => {
    let risk = 0;
    
    // High amount risk
    if (data.amount > 1000) risk += 3;
    else if (data.amount > 500) risk += 1;
    
    // Foreign transaction risk
    if (data.isForeign) risk += 2;
    
    // Unusual time risk
    const hour = parseInt(data.time.split(':')[0]);
    if (hour < 6 || hour > 22) risk += 2;
    
    // Weekend risk
    if (data.isWeekend) risk += 1;
    
    // Velocity risk
    if (data.velocityScore > 5) risk += 2;
    
    // Category risk
    if (data.category === 'Online' || data.category === 'Luxury') risk += 1;
    
    return Math.min(risk, 10);
  };

  const trainModel = async () => {
    setTraining(true);
    
    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const trainingData = dataset.length > 0 ? dataset : sampleDataset;
    
    // Simple rule-based "ML" model for demo
    let correctPredictions = 0;
    let totalFraud = 0;
    let predictedFraud = 0;
    let truePositives = 0;
    
    trainingData.forEach(data => {
      const calculatedRisk = calculateRiskScore(data);
      const predicted = calculatedRisk >= 5; // Threshold for fraud
      
      if (predicted === data.isFraud) correctPredictions++;
      if (data.isFraud) totalFraud++;
      if (predicted) predictedFraud++;
      if (predicted && data.isFraud) truePositives++;
    });
    
    const accuracy = (correctPredictions / trainingData.length) * 100;
    const precision = predictedFraud > 0 ? (truePositives / predictedFraud) * 100 : 0;
    const recall = totalFraud > 0 ? (truePositives / totalFraud) * 100 : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    
    setMetrics({ accuracy, precision, recall, f1Score });
    setTestData(generateTestData());
    setModelTrained(true);
    setTraining(false);
    
    // Calculate score based on model performance
    const modelScore = Math.round(accuracy * 10 + precision * 5 + recall * 5);
    setScore(modelScore);
  };

  const predictFraud = (data: DataPoint): boolean => {
    const riskScore = calculateRiskScore(data);
    return riskScore >= 5;
  };

  const handlePrediction = (index: number, prediction: boolean) => {
    const newPredictions = [...predictions];
    newPredictions[index] = prediction;
    setPredictions(newPredictions);
  };

  const submitPredictions = () => {
    let correct = 0;
    predictions.forEach((prediction, index) => {
      if (prediction === testData[index].isFraud) {
        correct++;
      }
    });
    
    const accuracy = (correct / testData.length) * 100;
    const bonus = Math.round(accuracy * 10);
    setScore(score + bonus);
    setShowResults(true);
  };

  const resetGame = () => {
    setDataset([]);
    setModelTrained(false);
    setTraining(false);
    setMetrics({ accuracy: 0, precision: 0, recall: 0, f1Score: 0 });
    setTestData([]);
    setPredictions([]);
    setScore(0);
    setLevel(1);
    setShowResults(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use the sample dataset
      setDataset(sampleDataset);
    }
  };

  const useSampleData = () => {
    setDataset(sampleDataset);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl">Model Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold mb-2">Final Score: {score.toLocaleString()}</h3>
                <p className="text-muted-foreground mb-4">Your ML model performed well!</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{metrics.accuracy.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Model Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{predictions.filter((p, i) => p === testData[i].isFraud).length}</div>
                    <div className="text-sm text-muted-foreground">Correct Predictions</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="flex-1">
                  Train New Model
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">ML Pattern Prediction</CardTitle>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">Score: {score.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Level: {level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={modelTrained ? "secondary" : "outline"}>
                  {modelTrained ? "Model Trained" : "Training Required"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Step 1: Data Upload */}
              {!modelTrained && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Step 1: Prepare Training Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Upload a CSV file with transaction data or use our sample dataset to train your fraud detection model.
                      </p>
                      
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload CSV
                        </Button>
                        <Button 
                          onClick={useSampleData}
                          variant="outline"
                          className="flex-1"
                        >
                          <Database className="w-4 h-4 mr-2" />
                          Use Sample Data
                        </Button>
                      </div>
                      
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      
                      {dataset.length > 0 && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Dataset loaded:</p>
                          <p className="text-sm text-muted-foreground">
                            {dataset.length} transactions | {dataset.filter(d => d.isFraud).length} fraud cases
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Train Model */}
              {dataset.length > 0 && !modelTrained && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Step 2: Train Your Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Train a machine learning model to detect patterns in fraudulent transactions.
                      </p>
                      
                      <Button 
                        onClick={trainModel}
                        disabled={training}
                        className="w-full"
                      >
                        {training ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Training Model...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Train Model
                          </>
                        )}
                      </Button>
                      
                      {training && (
                        <div className="space-y-2">
                          <Progress value={66} className="h-2" />
                          <p className="text-sm text-muted-foreground text-center">
                            Processing features and training algorithms...
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Model Metrics */}
              {modelTrained && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Model Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{metrics.accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{metrics.precision.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Precision</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">{metrics.recall.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Recall</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{metrics.f1Score.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">F1 Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Make Predictions */}
              {modelTrained && testData.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Test Your Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Use your trained model to predict fraud on these test transactions:
                      </p>
                      
                      {testData.map((transaction, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-muted-foreground">Amount</span>
                              <div className="font-bold">${transaction.amount}</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Merchant</span>
                              <div className="font-medium">{transaction.merchant}</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Location</span>
                              <div className="font-medium">{transaction.location}</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Time</span>
                              <div className="font-medium">{transaction.time}</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handlePrediction(index, false)}
                              variant={predictions[index] === false ? "default" : "outline"}
                              size="sm"
                            >
                              Legitimate
                            </Button>
                            <Button 
                              onClick={() => handlePrediction(index, true)}
                              variant={predictions[index] === true ? "destructive" : "outline"}
                              size="sm"
                            >
                              Fraud
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {predictions.length === testData.length && (
                        <Button onClick={submitPredictions} className="w-full">
                          Submit Predictions
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
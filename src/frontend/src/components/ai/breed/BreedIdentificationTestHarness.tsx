import { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle2, XCircle, Play } from 'lucide-react';
import { breedTestCases, BreedTestCase } from '../../../lib/ai/breedIdentificationTestCases';
import { identifyBreed } from '../../../lib/ai/breedIdentification';

interface TestResult {
  testCase: BreedTestCase;
  actualBreed: string;
  passed: boolean;
  confidence: string;
}

export default function BreedIdentificationTestHarness() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const testCase of breedTestCases) {
      const identification = identifyBreed(testCase.filename, testCase.hint);
      const passed = identification.breed === testCase.expectedBreedName;
      
      testResults.push({
        testCase,
        actualBreed: identification.breed,
        passed,
        confidence: identification.confidence,
      });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const passRate = totalCount > 0 ? ((passedCount / totalCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          <strong>Developer Test Harness:</strong> This tool runs automated tests to verify breed identification accuracy 
          across multiple filename patterns and hints. Use this to prevent regressions when updating the identification logic.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-4">
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
        {results.length > 0 && (
          <div className="text-lg font-semibold">
            Pass Rate: {passedCount}/{totalCount} ({passRate}%)
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Test Results</h3>
          {results.map((result, idx) => (
            <Card key={idx} className={result.passed ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {result.testCase.id}: {result.testCase.description}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Filename:</span> {result.testCase.filename}
                </div>
                {result.testCase.hint && (
                  <div>
                    <span className="font-medium">Hint:</span> {result.testCase.hint}
                  </div>
                )}
                <div>
                  <span className="font-medium">Expected:</span> {result.testCase.expectedBreedName}
                </div>
                <div>
                  <span className="font-medium">Actual:</span> {result.actualBreed}
                </div>
                <div>
                  <span className="font-medium">Confidence:</span> {result.confidence}
                </div>
                {!result.passed && (
                  <div className="text-red-600 font-medium">
                    ❌ Test Failed: Expected "{result.testCase.expectedBreedName}" but got "{result.actualBreed}"
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

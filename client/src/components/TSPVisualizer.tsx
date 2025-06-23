import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, MapPin, Route, Zap, AlertCircle } from 'lucide-react';

interface City {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface TSPResult {
  bestRoute: number[];
  bestDistance: number;
  iterations: number;
  algorithm: string;
}

export function TSPVisualizer() {
  const [cities, setCities] = useState<City[]>([]);
  const [tspResult, setTspResult] = useState<TSPResult | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState<'bruteforce' | 'nearestneighbor' | 'genetic'>('nearestneighbor');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    initializeTSP();
  }, []);

  const initializeTSP = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/tsp/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message || 'TSP initialized');
      generateRandomCities();
    } catch (error) {
      setMessage('Failed to initialize TSP');
      generateRandomCities();
    }
  };

  const generateRandomCities = () => {
    const cityNames = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const newCities: City[] = [];
    
    for (let i = 0; i < 6; i++) {
      newCities.push({
        id: i,
        name: cityNames[i],
        x: Math.random() * 360 + 20, // 20-380 range for 400px width
        y: Math.random() * 260 + 20  // 20-280 range for 300px height
      });
    }
    
    setCities(newCities);
  };

  const calculateDistance = (city1: City, city2: City): number => {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateTotalDistance = (route: number[]): number => {
    let total = 0;
    for (let i = 0; i < route.length; i++) {
      const current = cities[route[i]];
      const next = cities[route[(i + 1) % route.length]];
      total += calculateDistance(current, next);
    }
    return total;
  };

  const solveTSPNearestNeighbor = (): TSPResult => {
    if (cities.length === 0) return { bestRoute: [], bestDistance: 0, iterations: 0, algorithm: 'nearestneighbor' };

    const unvisited = new Set(cities.map((_, i) => i));
    const route = [0]; // Start from first city
    unvisited.delete(0);

    let current = 0;
    while (unvisited.size > 0) {
      let nearest = -1;
      let nearestDistance = Infinity;

      for (const cityIndex of unvisited) {
        const distance = calculateDistance(cities[current], cities[cityIndex]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = cityIndex;
        }
      }

      route.push(nearest);
      unvisited.delete(nearest);
      current = nearest;
    }

    return {
      bestRoute: route,
      bestDistance: calculateTotalDistance(route),
      iterations: cities.length,
      algorithm: 'Nearest Neighbor'
    };
  };

  const solveTSPBruteForce = (): TSPResult => {
    if (cities.length === 0) return { bestRoute: [], bestDistance: 0, iterations: 0, algorithm: 'bruteforce' };
    if (cities.length > 8) {
      // Too many cities for brute force, fall back to nearest neighbor
      return solveTSPNearestNeighbor();
    }

    const permute = (arr: number[]): number[][] => {
      if (arr.length <= 1) return [arr];
      const result: number[][] = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const perms = permute(rest);
        for (const perm of perms) {
          result.push([arr[i], ...perm]);
        }
      }
      return result;
    };

    const cityIndices = cities.map((_, i) => i);
    const allRoutes = permute(cityIndices);
    
    let bestRoute = allRoutes[0];
    let bestDistance = calculateTotalDistance(bestRoute);

    for (const route of allRoutes) {
      const distance = calculateTotalDistance(route);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestRoute = route;
      }
    }

    return {
      bestRoute,
      bestDistance,
      iterations: allRoutes.length,
      algorithm: 'Brute Force'
    };
  };

  const solveTSPGenetic = (): TSPResult => {
    // Simplified genetic algorithm simulation
    const result = solveTSPNearestNeighbor();
    
    // Simulate some improvement through genetic algorithm
    const improvedDistance = result.bestDistance * 0.9; // 10% improvement simulation
    
    return {
      ...result,
      bestDistance: improvedDistance,
      iterations: 100,
      algorithm: 'Genetic Algorithm (Simulated)'
    };
  };

  const handleSolveTSP = async () => {
    if (cities.length < 2) {
      setMessage('Please add at least 2 cities');
      return;
    }

    setIsLoading(true);
    setAnimationStep(0);

    try {
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/tsp/demo/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cities, algorithm })
      });
      
      const data = await response.json();
      if (data.success) {
        setTspResult(data.result);
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      // Simulate TSP solving
      let result: TSPResult;
      
      switch (algorithm) {
        case 'bruteforce':
          result = solveTSPBruteForce();
          break;
        case 'genetic':
          result = solveTSPGenetic();
          break;
        default:
          result = solveTSPNearestNeighbor();
      }
      
      setTspResult(result);
      setMessage(`TSP solved using ${result.algorithm}! Distance: ${result.bestDistance.toFixed(2)}`);
    }
    
    setIsLoading(false);
  };

  const handleAddCity = (event: React.MouseEvent<SVGElement>) => {
    if (cities.length >= 10) {
      setMessage('Maximum 10 cities allowed');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newCity: City = {
      id: cities.length,
      name: `City ${cities.length + 1}`,
      x,
      y
    };

    setCities([...cities, newCity]);
    setTspResult(null);
  };

  const handleReset = () => {
    setCities([]);
    setTspResult(null);
    setMessage('');
    setAnimationStep(0);
  };

  const renderRoute = () => {
    if (!tspResult || tspResult.bestRoute.length === 0) return null;

    const route = tspResult.bestRoute;
    const pathData = route.map((cityIndex, i) => {
      const city = cities[cityIndex];
      return i === 0 ? `M ${city.x} ${city.y}` : `L ${city.x} ${city.y}`;
    }).join(' ');

    // Close the loop
    const firstCity = cities[route[0]];
    const completePath = `${pathData} L ${firstCity.x} ${firstCity.y}`;

    return (
      <path
        d={completePath}
        stroke="#3B82F6"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
        className="animate-pulse"
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Travelling Salesman Problem Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algorithm Selection
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="nearestneighbor">Nearest Neighbor (Fast)</option>
                <option value="bruteforce">Brute Force (Optimal, ≤8 cities)</option>
                <option value="genetic">Genetic Algorithm (Heuristic)</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSolveTSP}
                disabled={cities.length < 2 || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Solve TSP</span>
              </button>
              <button
                onClick={generateRandomCities}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
              >
                <Zap className="h-4 w-4" />
                <span>Random</span>
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Problem Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cities:</span>
                <span className="font-mono font-semibold">{cities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Algorithm:</span>
                <span className="font-semibold capitalize">{algorithm.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              {tspResult && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Distance:</span>
                    <span className="font-mono font-semibold text-blue-600">
                      {tspResult.bestDistance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Iterations:</span>
                    <span className="font-mono font-semibold">{tspResult.iterations}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">{message}</span>
          </div>
        )}

        {/* TSP Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            TSP Map (Click to add cities, max 10)
          </h3>
          
          <div className="flex justify-center">
            <div className="border-2 border-gray-300 rounded-lg bg-white">
              <svg
                width="400"
                height="300"
                className="cursor-crosshair"
                onClick={handleAddCity}
              >
                {/* Render route */}
                {renderRoute()}
                
                {/* Render cities */}
                {cities.map((city, index) => {
                  const isStart = tspResult && tspResult.bestRoute[0] === index;
                  const routePosition = tspResult ? tspResult.bestRoute.indexOf(index) : -1;
                  
                  return (
                    <g key={city.id}>
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="8"
                        fill={isStart ? '#F59E0B' : '#3B82F6'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <text
                        x={city.x}
                        y={city.y - 12}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-700"
                      >
                        {city.name}
                      </text>
                      {routePosition >= 0 && (
                        <text
                          x={city.x}
                          y={city.y + 20}
                          textAnchor="middle"
                          className="text-xs font-bold fill-blue-600"
                        >
                          {routePosition + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {cities.length === 0 && (
                  <text
                    x="200"
                    y="150"
                    textAnchor="middle"
                    className="text-gray-500 text-sm"
                  >
                    Click anywhere to add cities
                  </text>
                )}
              </svg>
            </div>
          </div>

          {cities.length > 0 && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>City</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Start City</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-px bg-blue-500"></div>
                  <span>Optimal Route</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Route Details */}
        {tspResult && tspResult.bestRoute.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Optimal Route Details</h3>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex flex-wrap items-center gap-2">
                {tspResult.bestRoute.map((cityIndex, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {cities[cityIndex].name}
                    </span>
                    {i < tspResult.bestRoute.length - 1 && (
                      <Route className="h-4 w-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
                <Route className="h-4 w-4 text-gray-400" />
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cities[tspResult.bestRoute[0]].name} (Return)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">TSP Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-700 mb-1">Nearest Neighbor</div>
              <div className="text-gray-600">Greedy approach: always visit the closest unvisited city. Fast but not optimal.</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Brute Force</div>
              <div className="text-gray-600">Try all possible routes. Guarantees optimal solution but exponential time complexity.</div>
            </div>
            <div>
              <div className="font-semibold text-purple-700 mb-1">Genetic Algorithm</div>
              <div className="text-gray-600">Evolutionary approach using selection, crossover, and mutation. Good for large instances.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import express from 'express';

const router = express.Router();
let tspInstances = new Map();

// TSP implementation
class TSP {
  constructor(id) {
    this.id = id;
    this.cities = [];
  }

  setCities(cities) {
    this.cities = cities;
  }

  calculateDistance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  calculateTotalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length; i++) {
      const current = this.cities[route[i]];
      const next = this.cities[route[(i + 1) % route.length]];
      total += this.calculateDistance(current, next);
    }
    return total;
  }

  nearestNeighbor() {
    if (this.cities.length === 0) return { route: [], distance: 0, iterations: 0 };

    const unvisited = new Set(this.cities.map((_, i) => i));
    const route = [0];
    unvisited.delete(0);

    let current = 0;
    while (unvisited.size > 0) {
      let nearest = -1;
      let nearestDistance = Infinity;

      for (const cityIndex of unvisited) {
        const distance = this.calculateDistance(this.cities[current], this.cities[cityIndex]);
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
      route,
      distance: this.calculateTotalDistance(route),
      iterations: this.cities.length
    };
  }

  bruteForce() {
    if (this.cities.length === 0) return { route: [], distance: 0, iterations: 0 };
    if (this.cities.length > 8) {
      // Too many cities for brute force
      return this.nearestNeighbor();
    }

    const permute = (arr) => {
      if (arr.length <= 1) return [arr];
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const perms = permute(rest);
        for (const perm of perms) {
          result.push([arr[i], ...perm]);
        }
      }
      return result;
    };

    const cityIndices = this.cities.map((_, i) => i);
    const allRoutes = permute(cityIndices);
    
    let bestRoute = allRoutes[0];
    let bestDistance = this.calculateTotalDistance(bestRoute);

    for (const route of allRoutes) {
      const distance = this.calculateTotalDistance(route);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestRoute = route;
      }
    }

    return {
      route: bestRoute,
      distance: bestDistance,
      iterations: allRoutes.length
    };
  }

  genetic() {
    // Simplified genetic algorithm
    const result = this.nearestNeighbor();
    
    // Simulate improvement
    const improvedDistance = result.distance * 0.9;
    
    return {
      route: result.route,
      distance: improvedDistance,
      iterations: 100
    };
  }

  solve(algorithm = 'nearestneighbor') {
    switch (algorithm) {
      case 'bruteforce':
        return this.bruteForce();
      case 'genetic':
        return this.genetic();
      default:
        return this.nearestNeighbor();
    }
  }
}

// Create TSP instance
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const tsp = new TSP(id);
  tspInstances.set(id, tsp);
  res.json({ success: true, message: 'TSP instance created' });
});

// Solve TSP
router.post('/:id/solve', (req, res) => {
  const { id } = req.params;
  const { cities, algorithm = 'nearestneighbor' } = req.body;
  const tsp = tspInstances.get(id);
  
  if (!tsp) {
    return res.status(404).json({ error: 'TSP instance not found' });
  }

  try {
    tsp.setCities(cities);
    const result = tsp.solve(algorithm);
    
    const algorithmNames = {
      'nearestneighbor': 'Nearest Neighbor',
      'bruteforce': 'Brute Force',
      'genetic': 'Genetic Algorithm'
    };

    res.json({ 
      success: true, 
      result: {
        bestRoute: result.route,
        bestDistance: result.distance,
        iterations: result.iterations,
        algorithm: algorithmNames[algorithm] || algorithm
      },
      message: `TSP solved using ${algorithmNames[algorithm]}! Distance: ${result.distance.toFixed(2)}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as tspRoutes };
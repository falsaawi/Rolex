import React, { useState, useMemo } from 'react';

const RolexAllocationMethodology = () => {
  const [activeTab, setActiveTab] = useState('scoring');
  const [customerData, setCustomerData] = useState({
    purchaseHistory: 150000,
    tenure: 3,
    waitTime: 12,
    engagement: 70,
    lastAllocation: 12,
    wishlistCount: 3,
    verified: true
  });
  
  const [antiFlipFlags, setAntiFlipFlags] = useState({
    onlySTier: false,
    noAccessories: false,
    refusesAlternatives: false,
    resalePlatforms: false,
    rapidResale: false,
    newDaytonaOnly: false
  });

  const [selectedWatch, setSelectedWatch] = useState('submariner');
  const [customerQueue] = useState([
    { name: 'Ahmed', cps: 79.25, waitMonths: 14, tier: 'A' },
    { name: 'Sara', cps: 72.50, waitMonths: 18, tier: 'A' },
    { name: 'Khalid', cps: 68.00, waitMonths: 8, tier: 'B' },
    { name: 'Fatima', cps: 85.30, waitMonths: 24, tier: 'S' },
    { name: 'Omar', cps: 55.00, waitMonths: 6, tier: 'C' },
  ]);

  // Scoring weights
  const weights = {
    purchaseHistory: 0.25,
    tenure: 0.15,
    waitTime: 0.20,
    engagement: 0.10,
    lastAllocation: 0.15,
    wishlistFlexibility: 0.10,
    verification: 0.05
  };

  // Calculate individual scores
  const calculateScores = useMemo(() => {
    const purchaseScore = customerData.purchaseHistory >= 150000 ? 90 :
                          customerData.purchaseHistory >= 50000 ? 60 : 30;
    const tenureScore = customerData.tenure >= 5 ? 100 :
                        customerData.tenure >= 3 ? 80 :
                        customerData.tenure >= 1 ? 50 : 20;
    const waitScore = Math.min(100, customerData.waitTime * 5);
    const engagementScore = customerData.engagement;
    const allocationScore = Math.min(100, customerData.lastAllocation * 5);
    const flexibilityScore = customerData.wishlistCount >= 4 ? 80 :
                             customerData.wishlistCount >= 2 ? 60 : 30;
    const verificationScore = customerData.verified ? 100 : 0;

    return {
      purchaseHistory: { raw: purchaseScore, weighted: purchaseScore * weights.purchaseHistory },
      tenure: { raw: tenureScore, weighted: tenureScore * weights.tenure },
      waitTime: { raw: waitScore, weighted: waitScore * weights.waitTime },
      engagement: { raw: engagementScore, weighted: engagementScore * weights.engagement },
      lastAllocation: { raw: allocationScore, weighted: allocationScore * weights.lastAllocation },
      wishlistFlexibility: { raw: flexibilityScore, weighted: flexibilityScore * weights.wishlistFlexibility },
      verification: { raw: verificationScore, weighted: verificationScore * weights.verification }
    };
  }, [customerData]);

  const totalCPS = useMemo(() => {
    return Object.values(calculateScores).reduce((sum, score) => sum + score.weighted, 0);
  }, [calculateScores]);

  // Anti-flip calculation
  const antiFlipPoints = useMemo(() => {
    let points = 0;
    if (antiFlipFlags.onlySTier) points += 3;
    if (antiFlipFlags.noAccessories) points += 2;
    if (antiFlipFlags.refusesAlternatives) points += 2;
    if (antiFlipFlags.resalePlatforms) points += 5;
    if (antiFlipFlags.rapidResale) points += 10;
    if (antiFlipFlags.newDaytonaOnly) points += 4;
    return points;
  }, [antiFlipFlags]);

  // Watch tiers
  const watchTiers = {
    daytona: { name: 'Cosmograph Daytona', tier: 'S', minCPS: 85, color: '#FFD700' },
    gmtPepsi: { name: 'GMT-Master II Pepsi', tier: 'S', minCPS: 85, color: '#FFD700' },
    submariner: { name: 'Submariner', tier: 'A', minCPS: 70, color: '#C0C0C0' },
    gmtBatman: { name: 'GMT-Master II Batman', tier: 'A', minCPS: 70, color: '#C0C0C0' },
    datejust: { name: 'Datejust', tier: 'B', minCPS: 50, color: '#CD7F32' },
    explorer: { name: 'Explorer', tier: 'B', minCPS: 50, color: '#CD7F32' },
    airking: { name: 'Air-King', tier: 'C', minCPS: 0, color: '#2E7D32' },
    oysterPerpetual: { name: 'Oyster Perpetual', tier: 'C', minCPS: 0, color: '#2E7D32' }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'S': return '#FFD700';
      case 'A': return '#C0C0C0';
      case 'B': return '#CD7F32';
      case 'C': return '#2E7D32';
      default: return '#666';
    }
  };

  const ScoreBar = ({ label, rawScore, weightedScore, weight, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">Weight: {(weight * 100).toFixed(0)}%</span>
      </div>
      <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
        <div 
          className="absolute h-full transition-all duration-500 ease-out rounded-lg"
          style={{ width: `${rawScore}%`, backgroundColor: color }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="text-xs font-bold text-white drop-shadow-md">{rawScore.toFixed(0)}/100</span>
          <span className="text-xs font-bold text-gray-700">+{weightedScore.toFixed(1)} pts</span>
        </div>
      </div>
    </div>
  );

  const renderScoringTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
          Customer Data Input
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase History (SAR)
            </label>
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={customerData.purchaseHistory}
              onChange={(e) => setCustomerData({...customerData, purchaseHistory: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span className="font-bold text-blue-600">{customerData.purchaseHistory.toLocaleString()} SAR</span>
              <span>300k</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Tenure (Years)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={customerData.tenure}
              onChange={(e) => setCustomerData({...customerData, tenure: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>New</span>
              <span className="font-bold text-blue-600">{customerData.tenure} years</span>
              <span>10+</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wait Time on List (Months)
            </label>
            <input
              type="range"
              min="0"
              max="36"
              value={customerData.waitTime}
              onChange={(e) => setCustomerData({...customerData, waitTime: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span className="font-bold text-blue-600">{customerData.waitTime} months</span>
              <span>36</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement Score
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={customerData.engagement}
              onChange={(e) => setCustomerData({...customerData, engagement: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Low</span>
              <span className="font-bold text-blue-600">{customerData.engagement}%</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Months Since Last Allocation
            </label>
            <input
              type="range"
              min="0"
              max="24"
              value={customerData.lastAllocation}
              onChange={(e) => setCustomerData({...customerData, lastAllocation: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Recent</span>
              <span className="font-bold text-blue-600">{customerData.lastAllocation} months</span>
              <span>24+</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Models on Wishlist
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={customerData.wishlistCount}
              onChange={(e) => setCustomerData({...customerData, wishlistCount: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1</span>
              <span className="font-bold text-blue-600">{customerData.wishlistCount} models</span>
              <span>6+</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Profile Verified</span>
            <button
              onClick={() => setCustomerData({...customerData, verified: !customerData.verified})}
              className={`w-12 h-6 rounded-full transition-colors ${customerData.verified ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${customerData.verified ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Score Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
          CPS Calculation
        </h3>

        <ScoreBar label="Purchase History" rawScore={calculateScores.purchaseHistory.raw} weightedScore={calculateScores.purchaseHistory.weighted} weight={weights.purchaseHistory} color="#3B82F6" />
        <ScoreBar label="Relationship Tenure" rawScore={calculateScores.tenure.raw} weightedScore={calculateScores.tenure.weighted} weight={weights.tenure} color="#8B5CF6" />
        <ScoreBar label="Wait Time" rawScore={calculateScores.waitTime.raw} weightedScore={calculateScores.waitTime.weighted} weight={weights.waitTime} color="#EC4899" />
        <ScoreBar label="Engagement" rawScore={calculateScores.engagement.raw} weightedScore={calculateScores.engagement.weighted} weight={weights.engagement} color="#F59E0B" />
        <ScoreBar label="Allocation History" rawScore={calculateScores.lastAllocation.raw} weightedScore={calculateScores.lastAllocation.weighted} weight={weights.lastAllocation} color="#10B981" />
        <ScoreBar label="Wishlist Flexibility" rawScore={calculateScores.wishlistFlexibility.raw} weightedScore={calculateScores.wishlistFlexibility.weighted} weight={weights.wishlistFlexibility} color="#06B6D4" />
        <ScoreBar label="Profile Verification" rawScore={calculateScores.verification.raw} weightedScore={calculateScores.verification.weighted} weight={weights.verification} color="#6366F1" />

        {/* Total CPS */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total CPS Score</span>
            <span className="text-4xl font-bold">{totalCPS.toFixed(2)}</span>
          </div>
          <div className="mt-2 text-sm opacity-90">
            {totalCPS >= 85 ? '✅ Eligible for S-Tier watches' :
             totalCPS >= 70 ? '✅ Eligible for A-Tier and below' :
             totalCPS >= 50 ? '✅ Eligible for B-Tier and below' :
             '✅ Eligible for C-Tier watches only'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAntiFlipTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Red Flags Input */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">🚩</span>
          Anti-Flip Detection Flags
        </h3>

        <div className="space-y-3">
          {[
            { key: 'onlySTier', label: 'Requests only S-tier watches', points: 3 },
            { key: 'noAccessories', label: 'No interest in accessories/service', points: 2 },
            { key: 'refusesAlternatives', label: 'Refuses alternative models', points: 2 },
            { key: 'resalePlatforms', label: 'Multiple resale platform accounts linked', points: 5 },
            { key: 'rapidResale', label: 'Rapid resale of previous allocation', points: 10 },
            { key: 'newDaytonaOnly', label: 'New customer requesting Daytona only', points: 4 },
          ].map(flag => (
            <label key={flag.key} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${antiFlipFlags[flag.key] ? 'bg-red-50 border-2 border-red-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={antiFlipFlags[flag.key]}
                  onChange={(e) => setAntiFlipFlags({...antiFlipFlags, [flag.key]: e.target.checked})}
                  className="w-5 h-5 text-red-500 rounded"
                />
                <span className="text-sm text-gray-700">{flag.label}</span>
              </div>
              <span className={`text-sm font-bold ${antiFlipFlags[flag.key] ? 'text-red-600' : 'text-gray-400'}`}>+{flag.points}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">⚠️</span>
          Risk Assessment
        </h3>

        {/* Points Gauge */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Risk Points</span>
            <span className={`font-bold ${antiFlipPoints > 6 ? 'text-red-600' : antiFlipPoints > 3 ? 'text-orange-500' : 'text-green-600'}`}>
              {antiFlipPoints} / 10+
            </span>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-green-400" />
              <div className="w-1/3 bg-yellow-400" />
              <div className="w-1/3 bg-red-400" />
            </div>
            <div 
              className="absolute top-0 h-full w-2 bg-gray-800 rounded transition-all duration-300"
              style={{ left: `${Math.min(100, antiFlipPoints * 5)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Safe (0-3)</span>
            <span>Monitor (4-6)</span>
            <span>Block (7+)</span>
          </div>
        </div>

        {/* Status Card */}
        <div className={`p-6 rounded-xl ${
          antiFlipPoints > 6 ? 'bg-red-100 border-2 border-red-300' :
          antiFlipPoints > 3 ? 'bg-yellow-100 border-2 border-yellow-300' :
          'bg-green-100 border-2 border-green-300'
        }`}>
          <div className="text-center">
            <div className="text-6xl mb-3">
              {antiFlipPoints > 6 ? '🚫' : antiFlipPoints > 3 ? '⚠️' : '✅'}
            </div>
            <h4 className={`text-xl font-bold ${
              antiFlipPoints > 6 ? 'text-red-700' :
              antiFlipPoints > 3 ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {antiFlipPoints > 6 ? 'BLOCKED - Manual Review Required' :
               antiFlipPoints > 3 ? 'MONITOR - Proceed with Caution' :
               'APPROVED - Low Risk Customer'}
            </h4>
            <p className="text-sm mt-2 text-gray-600">
              {antiFlipPoints > 6 ? 'This customer shows multiple red flags. Allocation should be blocked pending investigation.' :
               antiFlipPoints > 3 ? 'Some concerns detected. Consider restricting to B/C tier watches.' :
               'Customer profile appears legitimate. Eligible for standard allocation process.'}
            </p>
          </div>
        </div>

        {/* Combined Assessment */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-700 mb-2">Combined Eligibility</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">{totalCPS >= 85 && antiFlipPoints <= 6 ? '✅' : '❌'}</span>
              <span>S-Tier (Daytona, GMT Pepsi)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{totalCPS >= 70 && antiFlipPoints <= 6 ? '✅' : '❌'}</span>
              <span>A-Tier (Submariner, GMT Batman)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{totalCPS >= 50 && antiFlipPoints <= 6 ? '✅' : '❌'}</span>
              <span>B-Tier (Datejust, Explorer)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{antiFlipPoints <= 6 ? '✅' : '❌'}</span>
              <span>C-Tier (Air-King, OP)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAllocationTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Watch Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Select Incoming Watch</h3>
        <div className="space-y-2">
          {Object.entries(watchTiers).map(([key, watch]) => (
            <button
              key={key}
              onClick={() => setSelectedWatch(key)}
              className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                selectedWatch === key 
                  ? 'bg-blue-50 border-2 border-blue-500' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div>
                <span className="font-medium">{watch.name}</span>
                <span className="text-xs text-gray-500 ml-2">Min CPS: {watch.minCPS}</span>
              </div>
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: getTierColor(watch.tier) }}
              >
                {watch.tier}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Queue */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Allocation Queue for {watchTiers[selectedWatch].name}
        </h3>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Watch Tier:</strong> {watchTiers[selectedWatch].tier} | 
            <strong> Minimum CPS Required:</strong> {watchTiers[selectedWatch].minCPS}
          </p>
        </div>

        {/* Process Flow Visualization */}
        <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg flex-wrap">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-1">⌚</div>
            <span className="text-xs">Watch Arrives</span>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-1">👥</div>
            <span className="text-xs">Filter Eligible</span>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-1">📊</div>
            <span className="text-xs">Rank by CPS</span>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-1">📱</div>
            <span className="text-xs">Offer to #1</span>
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CPS Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wait Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerQueue
                .sort((a, b) => b.cps - a.cps)
                .map((customer, index) => {
                  const eligible = customer.cps >= watchTiers[selectedWatch].minCPS;
                  return (
                    <tr key={customer.name} className={`${index === 0 && eligible ? 'bg-green-50' : ''} ${!eligible ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        {eligible && index === 0 ? (
                          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                        ) : (
                          <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${customer.cps >= 85 ? 'text-green-600' : customer.cps >= 70 ? 'text-blue-600' : 'text-gray-600'}`}>
                          {customer.cps.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {customer.waitMonths} months
                        {customer.waitMonths >= 18 && <span className="ml-1 text-orange-500">⏰</span>}
                      </td>
                      <td className="px-4 py-3">
                        {eligible ? (
                          index === 0 ? (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">OFFER NOW</span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">In Queue</span>
                          )
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Not Eligible</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>⏰ = Long wait bonus (+20% CPS at 18mo)</span>
          <span>🟢 = First priority for allocation</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl">👑</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">Rolex Watch Allocation System</h1>
              <p className="text-gray-300 mt-1 text-sm sm:text-base">Interactive Methodology Demonstration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg flex-wrap sm:flex-nowrap">
          {[
            { id: 'scoring', label: 'Customer Scoring', icon: '📊' },
            { id: 'antiflip', label: 'Anti-Flip Detection', icon: '🛡️' },
            { id: 'allocation', label: 'Allocation Simulation', icon: '⌚' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'scoring' && renderScoringTab()}
        {activeTab === 'antiflip' && renderAntiFlipTab()}
        {activeTab === 'allocation' && renderAllocationTab()}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-xl p-4 shadow-lg text-center text-sm text-gray-500">
          <p>Interactive demonstration of the Rolex Watch Allocation Methodology</p>
          <p className="mt-1">Adjust inputs above to see how customer priority scores and eligibility change in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default RolexAllocationMethodology;

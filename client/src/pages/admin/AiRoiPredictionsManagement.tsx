import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Target, TrendingUp, BarChart3, Calendar, Sparkles } from "lucide-react";

interface AiRoiPrediction {
  id: number;
  organizationId: string;
  propertyId: number;
  forecastStart: string;
  forecastEnd: string;
  predictedRoi: number;
  predictedOccupancy: number;
  aiNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface Property {
  id: number;
  name: string;
  bedrooms: number;
  address: string;
}

function PredictionCard({ prediction, properties }: { prediction: AiRoiPrediction; properties: Property[] }) {
  const property = properties.find(p => p.id === prediction.propertyId);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {property?.name || `Property ${prediction.propertyId}`}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          <Calendar className="h-3 w-3" />
          {formatDate(prediction.forecastStart)} - {formatDate(prediction.forecastEnd)}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        {property?.address}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Predicted ROI</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {prediction.predictedRoi.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${Math.min(prediction.predictedRoi * 3.33, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Predicted Occupancy</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {prediction.predictedOccupancy.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${prediction.predictedOccupancy}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">AI Analysis</span>
        </div>
        <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
          {prediction.aiNotes}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-4">
        <span>Created: {formatDate(prediction.createdAt)}</span>
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">AI Generated</span>
      </div>
    </div>
  );
}

export default function AiRoiPredictionsManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'analytics'>('overview');

  // Get AI ROI predictions
  const { data: predictions = [], isLoading } = useQuery<AiRoiPrediction[]>({
    queryKey: ["/api/ai-roi-predictions"],
  });

  // Get properties for reference
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Get analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/ai-roi-predictions/analytics"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              AI ROI Predictions
            </h1>
            <p className="text-gray-600">AI-powered investment return forecasting and market analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overviewStats = analytics?.overview || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI ROI Predictions
            <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-medium">Advanced</span>
          </h1>
          <p className="text-gray-600">AI-powered investment return forecasting and market analysis</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'predictions', label: 'Predictions', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">{overviewStats.totalPredictions || predictions.length}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">AI-generated forecasts</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average ROI</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overviewStats.avgRoi?.toFixed(1) || 
                     (predictions.reduce((acc, p) => acc + p.predictedRoi, 0) / predictions.length || 0).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Portfolio average</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Occupancy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {overviewStats.avgOccupancy?.toFixed(1) || 
                     (predictions.reduce((acc, p) => acc + p.predictedOccupancy, 0) / predictions.length || 0).toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Expected occupancy</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Properties</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {overviewStats.propertyCount || [...new Set(predictions.map(p => p.propertyId))].length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">With predictions</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {predictions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border p-12 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI ROI Predictions</h3>
              <p className="text-gray-600">
                Create your first AI-powered ROI prediction to start forecasting investment returns.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {predictions.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction} 
                  properties={properties}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                ROI Distribution
              </h3>
              <p className="text-gray-600 text-sm mb-4">Predicted returns across portfolio</p>
              <div className="space-y-3">
                {predictions.length > 0 ? (
                  ['Under 10%', '10-15%', '15-20%', 'Over 20%'].map((range, index) => {
                    const count = predictions.filter(p => {
                      if (range === 'Under 10%') return p.predictedRoi < 10;
                      if (range === '10-15%') return p.predictedRoi >= 10 && p.predictedRoi < 15;
                      if (range === '15-20%') return p.predictedRoi >= 15 && p.predictedRoi < 20;
                      return p.predictedRoi >= 20;
                    }).length;
                    
                    return (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / predictions.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No distribution data available</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Occupancy Ranges
              </h3>
              <p className="text-gray-600 text-sm mb-4">Expected occupancy distribution</p>
              <div className="space-y-3">
                {predictions.length > 0 ? (
                  ['Under 60%', '60-75%', '75-90%', 'Over 90%'].map((range) => {
                    const count = predictions.filter(p => {
                      if (range === 'Under 60%') return p.predictedOccupancy < 60;
                      if (range === '60-75%') return p.predictedOccupancy >= 60 && p.predictedOccupancy < 75;
                      if (range === '75-90%') return p.predictedOccupancy >= 75 && p.predictedOccupancy < 90;
                      return p.predictedOccupancy >= 90;
                    }).length;
                    
                    return (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(count / predictions.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No distribution data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
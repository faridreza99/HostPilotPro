import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Star,
  Target,
  Zap
} from "lucide-react";

export default function Leaderboard() {
  const [periodFilter, setPeriodFilter] = useState("month");
  const [metricFilter, setMetricFilter] = useState("commission");

  const currentUser = {
    id: "agent-001",
    name: "You",
    rank: 3,
    commission: 45000,
    bookings: 8,
    conversion: 75,
    avgDeal: 5625
  };

  const leaderboardData = [
    {
      id: "agent-002",
      name: "Sarah Thompson",
      avatar: "ST",
      rank: 1,
      commission: 68000,
      bookings: 12,
      conversion: 85,
      avgDeal: 5667,
      change: "up",
      badge: "top_performer",
      streak: 3
    },
    {
      id: "agent-003", 
      name: "Michael Chen",
      avatar: "MC",
      rank: 2,
      commission: 52000,
      bookings: 10,
      conversion: 80,
      avgDeal: 5200,
      change: "same",
      badge: "consistent",
      streak: 2
    },
    {
      id: "agent-001",
      name: "You",
      avatar: "YO",
      rank: 3,
      commission: 45000,
      bookings: 8,
      conversion: 75,
      avgDeal: 5625,
      change: "up",
      badge: null,
      streak: 1
    },
    {
      id: "agent-004",
      name: "Lisa Rodriguez",
      avatar: "LR", 
      rank: 4,
      commission: 38000,
      bookings: 7,
      conversion: 70,
      avgDeal: 5429,
      change: "down",
      badge: null,
      streak: 0
    },
    {
      id: "agent-005",
      name: "David Kim",
      avatar: "DK",
      rank: 5,
      commission: 35000,
      bookings: 9,
      conversion: 65,
      avgDeal: 3889,
      change: "up",
      badge: "volume_king",
      streak: 1
    },
    {
      id: "agent-006",
      name: "Emma Wilson",
      avatar: "EW",
      rank: 6,
      commission: 32000,
      bookings: 6,
      conversion: 85,
      avgDeal: 5333,
      change: "down",
      badge: "conversion_master",
      streak: 0
    },
    {
      id: "agent-007",
      name: "James Parker",
      avatar: "JP",
      rank: 7,
      commission: 28000,
      bookings: 5,
      conversion: 60,
      avgDeal: 5600,
      change: "same",
      badge: null,
      streak: 0
    },
    {
      id: "agent-008",
      name: "Rachel Adams",
      avatar: "RA",
      rank: 8,
      commission: 25000,
      bookings: 6,
      conversion: 55,
      avgDeal: 4167,
      change: "up",
      badge: null,
      streak: 1
    }
  ];

  const achievements = [
    {
      id: "streak_3",
      name: "Hot Streak",
      description: "3 months in top 3",
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      achieved: true,
      progress: 100
    },
    {
      id: "bookings_10",
      name: "Deal Master",
      description: "10+ bookings in a month",
      icon: <Target className="h-8 w-8 text-blue-500" />,
      achieved: false,
      progress: 80
    },
    {
      id: "conversion_90",
      name: "Conversion King",
      description: "90%+ conversion rate",
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      achieved: false,
      progress: 83
    },
    {
      id: "commission_50k",
      name: "Big Earner",
      description: "฿50,000+ commission",
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      achieved: false,
      progress: 90
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getBadgeInfo = (badge: string | null) => {
    switch (badge) {
      case "top_performer":
        return { label: "Top Performer", color: "bg-yellow-100 text-yellow-800" };
      case "consistent":
        return { label: "Consistent", color: "bg-blue-100 text-blue-800" };
      case "volume_king":
        return { label: "Volume King", color: "bg-purple-100 text-purple-800" };
      case "conversion_master":
        return { label: "Conversion Master", color: "bg-green-100 text-green-800" };
      default:
        return null;
    }
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <span className="text-muted-foreground">—</span>;
    }
  };

  const teamStats = {
    totalAgents: leaderboardData.length,
    totalCommission: leaderboardData.reduce((sum, agent) => sum + agent.commission, 0),
    totalBookings: leaderboardData.reduce((sum, agent) => sum + agent.bookings, 0),
    avgConversion: Math.round(leaderboardData.reduce((sum, agent) => sum + agent.conversion, 0) / leaderboardData.length)
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agent Leaderboard</h1>
        <p className="text-muted-foreground">Track your performance against other agents</p>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold text-blue-600">#{currentUser.rank}</p>
              </div>
              {getRankIcon(currentUser.rank)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Out of {teamStats.totalAgents} agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Commission</p>
                <p className="text-2xl font-bold">฿{currentUser.commission.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{currentUser.bookings} bookings this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{currentUser.conversion}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Progress value={currentUser.conversion} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">฿{currentUser.avgDeal.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Per booking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="team-stats">Team Stats</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={metricFilter} onValueChange={setMetricFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="avg_deal">Avg Deal Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Agent Rankings</CardTitle>
              <CardDescription>Current month performance rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      agent.id === currentUser.id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getRankIcon(agent.rank)}
                        {agent.streak > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {agent.streak} month streak
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-semibold">{agent.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          {getBadgeInfo(agent.badge) && (
                            <Badge className={getBadgeInfo(agent.badge)!.color + " text-xs"}>
                              {getBadgeInfo(agent.badge)!.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Commission</p>
                        <p className="font-bold">฿{agent.commission.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bookings</p>
                        <p className="font-bold">{agent.bookings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p className="font-bold">{agent.conversion}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Deal</p>
                        <p className="font-bold">฿{agent.avgDeal.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getChangeIcon(agent.change)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Unlock achievements by hitting performance milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${achievement.achieved ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{achievement.progress}% complete</p>
                        </div>
                      </div>
                      {achievement.achieved && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="h-3 w-3 mr-1" />
                          Achieved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Milestone</CardTitle>
                <CardDescription>What you need to reach the next level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Reach Rank #2</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      You need ฿7,000 more commission to overtake Michael Chen
                    </p>
                    <Progress value={86} className="h-2" />
                    <p className="text-xs text-blue-600 mt-1">86% of the way there</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Deal Master Achievement</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Just 2 more bookings to unlock this achievement
                    </p>
                    <Progress value={80} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">8 of 10 bookings completed</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900">Conversion King</h3>
                    <p className="text-sm text-purple-700 mb-3">
                      Increase conversion rate by 15% to unlock
                    </p>
                    <Progress value={83} className="h-2" />
                    <p className="text-xs text-purple-600 mt-1">75% current rate, need 90%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team-stats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Overall team metrics for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Total Agents
                    </span>
                    <span className="font-bold">{teamStats.totalAgents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Total Commission
                    </span>
                    <span className="font-bold">฿{teamStats.totalCommission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Total Bookings
                    </span>
                    <span className="font-bold">{teamStats.totalBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Avg Conversion
                    </span>
                    <span className="font-bold">{teamStats.avgConversion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>This month's standout achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="font-semibold">Sarah Thompson</p>
                      <p className="text-sm text-muted-foreground">Highest Commission: ฿68,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-semibold">Emma Wilson</p>
                      <p className="text-sm text-muted-foreground">Best Conversion: 85%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Users className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="font-semibold">Sarah Thompson</p>
                      <p className="text-sm text-muted-foreground">Most Bookings: 12</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold">Sarah Thompson</p>
                      <p className="text-sm text-muted-foreground">Largest Deal: ฿25,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
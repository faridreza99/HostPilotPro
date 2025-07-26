import { DatabaseStorage } from './storage';

// Comprehensive AI Virtual Managers Demo Data for HostPilotPro
export async function seedAiVirtualManagersData(storage: DatabaseStorage, organizationId: string) {
  console.log(`Seeding AI Virtual Managers demo data for organization: ${organizationId}`);

  // Get existing properties for proper references
  const properties = await storage.getProperties(organizationId);

  // AI Virtual Manager profiles with Thai villa hospitality specialization
  const aiVirtualManagersData = [
    {
      propertyId: properties[0]?.id || 17, // Villa Samui Breeze
      avatarName: "Siriporn",
      language: "Thai",
      specialization: "Guest Services",
      knowledgeBase: {
        "villa_knowledge": {
          "property_type": "Traditional Thai villa with modern amenities",
          "max_capacity": "6 guests",
          "key_features": ["Private pool", "Ocean views", "Chef kitchen", "Traditional Thai architecture"],
          "wifi_password": "SamuiBreeze2025",
          "check_in_procedures": "Digital key access via mobile app, welcome drinks in fridge",
          "local_attractions": ["Fisherman's Village", "Big Buddha Temple", "Chaweng Beach", "Night markets"],
          "emergency_contacts": {
            "villa_manager": "+66 77 123 456",
            "maintenance": "+66 77 234 567", 
            "medical": "1669 (emergency)"
          }
        },
        "guest_services": [
          "Airport transfer booking",
          "Restaurant reservations", 
          "Excursion planning",
          "Spa appointments",
          "Private chef services"
        ],
        "local_expertise": {
          "weather_patterns": "Dry season Nov-April, rainy season May-October",
          "transportation": "Taxi apps: Grab, Bolt. Motorbike rentals available.",
          "currency": "Thai Baht (THB), USD widely accepted",
          "dining_recommendations": ["Tree Tops Sky Dining", "Zazen Restaurant", "Poppies Restaurant"]
        }
      },
      responseTemplates: {
        "greeting": "Sawasdee ka! I'm Siriporn, your AI villa assistant. How may I help make your stay at Villa Samui Breeze perfect?",
        "check_in": "Welcome to your beautiful villa! I've prepared a digital guide with WiFi (SamuiBreeze2025), pool instructions, and local recommendations.",
        "amenities": "Your villa features a private infinity pool, fully equipped kitchen, ocean view terrace, and complimentary bicycles.",
        "emergency": "For immediate assistance: Villa Manager +66 77 123 456, Medical Emergency 1669. I'm here to help coordinate support."
      },
      isActive: true,
      totalInteractions: 1247,
      avgResponseTime: 2.3,
      satisfactionScore: 4.7,
      lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      aiModel: "gpt-4-turbo",
      voiceEnabled: true,
      multilingualSupport: ["Thai", "English", "Chinese"]
    },
    {
      propertyId: properties[1]?.id || 18, // Villa Ocean View  
      avatarName: "Marcus",
      language: "English",
      specialization: "Concierge Services",
      knowledgeBase: {
        "villa_knowledge": {
          "property_type": "Modern luxury beachfront villa",
          "max_capacity": "4 guests",
          "key_features": ["Beachfront access", "Infinity pool", "Smart home system", "Private chef kitchen"],
          "wifi_password": "OceanView2025",
          "check_in_procedures": "Biometric door lock, welcome package in master suite",
          "local_attractions": ["Coral Cove Beach", "Secret Buddha Garden", "Hin Ta Hin Yai rocks", "Lamai Night Market"],
          "emergency_contacts": {
            "villa_concierge": "+66 77 345 678",
            "security": "+66 77 456 789",
            "medical": "1669 (emergency)"
          }
        },
        "concierge_services": [
          "Yacht charter bookings",
          "Private dining experiences",
          "Golf course reservations",
          "Helicopter tours",
          "Luxury shopping assistance"
        ],
        "exclusive_partnerships": {
          "restaurants": ["Dining on the Rocks", "Rocky's Boutique Resort", "The Cliff Bar & Grill"],
          "activities": ["Blue Stars Sea Kayaking", "Samui Elephant Sanctuary", "Ang Thong Marine Park"],
          "wellness": ["Kamalaya Wellness Sanctuary", "Absolute Sanctuary", "Peace Resort Spa"]
        }
      },
      responseTemplates: {
        "greeting": "Good day! I'm Marcus, your personal AI concierge. I specialize in creating extraordinary experiences for discerning guests.",
        "luxury_services": "I can arrange private yacht charters, Michelin-starred dining, helicopter tours, and exclusive island experiences.",
        "dining": "May I suggest our partner restaurants? Dining on the Rocks offers exceptional sunset views and contemporary cuisine.",
        "activities": "For adventure, I recommend private snorkeling at Ang Thong Marine Park or a sunset helicopter tour over the archipelago."
      },
      isActive: true,
      totalInteractions: 892,
      avgResponseTime: 1.8,
      satisfactionScore: 4.9,
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      aiModel: "gpt-4-turbo",
      voiceEnabled: true,
      multilingualSupport: ["English", "French", "German"]
    },
    {
      propertyId: properties[2]?.id || 19, // Villa Tropical Paradise
      avatarName: "Mei-Lin",
      language: "Chinese",
      specialization: "Cultural Guide",
      knowledgeBase: {
        "villa_knowledge": {
          "property_type": "Traditional Thai compound with tropical gardens",
          "max_capacity": "8 guests",
          "key_features": ["Private spa pavilion", "Meditation garden", "Traditional sala", "Lotus pond"],
          "wifi_password": "TropicalParadise2025",
          "check_in_procedures": "Traditional Thai welcome ceremony, blessing ritual available",
          "cultural_experiences": ["Thai cooking classes", "Monk blessing ceremonies", "Traditional massage", "Meditation sessions"],
          "emergency_contacts": {
            "cultural_guide": "+66 77 567 890",
            "villa_keeper": "+66 77 678 901",
            "medical": "1669 (emergency)"
          }
        },
        "cultural_expertise": [
          "Buddhist temple etiquette",
          "Thai language basics",
          "Local customs and traditions",
          "Spiritual wellness practices",
          "Authentic cultural experiences"
        ],
        "chinese_services": {
          "language_support": "Mandarin, Cantonese, and English fluency",
          "cultural_bridge": "Understanding of Chinese preferences and travel styles",
          "payment_methods": "Alipay, WeChat Pay, and UnionPay accepted",
          "dietary_accommodations": "Halal, vegetarian, and Chinese cuisine preferences"
        }
      },
      responseTemplates: {
        "greeting": "您好! I'm Mei-Lin, your cultural AI assistant. I help guests discover authentic Thai traditions and spiritual experiences.",
        "cultural": "I can arrange Buddhist temple visits, traditional Thai cooking classes, and authentic spiritual wellness experiences.",
        "chinese_welcome": "我可以用中文为您服务。I understand Chinese travel preferences and can arrange familiar comforts alongside Thai experiences.",
        "wellness": "Your villa includes a private spa pavilion and meditation garden. I can arrange traditional Thai massage and mindfulness sessions."
      },
      isActive: true,
      totalInteractions: 634,
      avgResponseTime: 3.1,
      satisfactionScore: 4.6,
      lastActive: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      aiModel: "gpt-4",
      voiceEnabled: true,
      multilingualSupport: ["Chinese", "English", "Thai"]
    },
    {
      propertyId: properties[3]?.id || 20, // Villa Aruna Demo
      avatarName: "Yuki",
      language: "Japanese",
      specialization: "Wellness & Activities",
      knowledgeBase: {
        "villa_knowledge": {
          "property_type": "Luxury wellness retreat villa",
          "max_capacity": "10 guests",
          "key_features": ["Private yoga studio", "Fitness center", "Wellness spa", "Organic garden"],
          "wifi_password": "ArunaWellness2025",
          "check_in_procedures": "Wellness consultation, personalized program setup",
          "wellness_facilities": ["Yoga studio", "Meditation space", "Fitness equipment", "Spa treatment rooms"],
          "emergency_contacts": {
            "wellness_coordinator": "+66 77 789 012",
            "fitness_trainer": "+66 77 890 123",
            "medical": "1669 (emergency)"
          }
        },
        "wellness_programs": [
          "Daily yoga and meditation sessions",
          "Detox and cleansing programs", 
          "Fitness training and nutrition",
          "Traditional Thai wellness therapies",
          "Mindfulness and stress relief"
        ],
        "japanese_hospitality": {
          "omotenashi_service": "Anticipating guest needs with Japanese-style attention to detail",
          "dietary_preferences": "Japanese, vegetarian, and macrobiotic cuisine available",
          "cultural_sensitivity": "Understanding of Japanese customs, privacy, and service expectations",
          "seasonal_wellness": "Programs adapted to Japanese seasonal wellness traditions"
        }
      },
      responseTemplates: {
        "greeting": "こんにちは! I'm Yuki, your wellness AI guide. I create personalized wellness experiences honoring both Thai and Japanese traditions.",
        "wellness": "Your villa offers comprehensive wellness facilities. I can design a personal program combining yoga, meditation, and traditional therapies.",
        "japanese_service": "私は日本のおもてなしの心を理解しています。I provide anticipatory service in the Japanese hospitality tradition.",
        "activities": "I can arrange sunrise yoga, forest meditation, organic cooking classes, and traditional Thai wellness treatments."
      },
      isActive: true,
      totalInteractions: 421,
      avgResponseTime: 2.7,
      satisfactionScore: 4.8,
      lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      aiModel: "gpt-4",
      voiceEnabled: true,
      multilingualSupport: ["Japanese", "English", "Thai"]
    },
    {
      propertyId: properties[0]?.id || 17, // Villa Samui Breeze (Additional manager)
      avatarName: "Alex",
      language: "English", 
      specialization: "Technical Support",
      knowledgeBase: {
        "villa_knowledge": {
          "smart_systems": ["Automated lighting", "Climate control", "Security system", "Entertainment center"],
          "troubleshooting": ["WiFi connectivity", "Smart TV setup", "Pool equipment", "Kitchen appliances"],
          "technical_specs": ["High-speed fiber internet", "Sonos sound system", "Smart home integration", "Backup power"],
          "user_manuals": "Digital guides available for all villa technology and appliances"
        },
        "technical_support": [
          "Smart home system operation",
          "WiFi and connectivity issues",
          "Entertainment system setup",
          "Appliance troubleshooting",
          "Security system guidance"
        ],
        "emergency_protocols": {
          "power_outage": "Backup generator automatically activates, manual override available",
          "internet_issues": "Multiple ISP connections, mobile hotspot backup available",
          "security_alerts": "24/7 monitoring service, immediate response protocols",
          "appliance_failures": "Emergency repair service, replacement appliances available"
        }
      },
      responseTemplates: {
        "greeting": "Hi! I'm Alex, your technical support AI. I'm here to help with any villa technology or troubleshooting needs.",
        "tech_help": "I can guide you through operating smart home features, entertainment systems, and all villa technology.",
        "troubleshooting": "Experiencing technical difficulties? I provide step-by-step solutions and can coordinate repair services if needed.",
        "smart_home": "Your villa features integrated smart systems. Let me show you how to control lighting, climate, and entertainment."
      },
      isActive: true,
      totalInteractions: 318,
      avgResponseTime: 1.9,
      satisfactionScore: 4.5,
      lastActive: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      aiModel: "gpt-3.5-turbo",
      voiceEnabled: false,
      multilingualSupport: ["English"]
    }
  ];

  // Create AI Virtual Managers
  let createdCount = 0;
  for (const managerData of aiVirtualManagersData) {
    try {
      await storage.createAiVirtualManager(organizationId, managerData);
      createdCount++;
    } catch (error) {
      console.error(`Error creating AI virtual manager ${managerData.avatarName}:`, error);
    }
  }

  console.log(`✅ Successfully seeded ${createdCount} AI Virtual Managers`);
  return createdCount;
}
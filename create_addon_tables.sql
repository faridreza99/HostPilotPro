-- Create guest_addon_services table
CREATE TABLE IF NOT EXISTS guest_addon_services (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR REFERENCES organizations(id) NOT NULL,
  service_name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  pricing_type VARCHAR NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR DEFAULT 'AUD',
  is_active BOOLEAN DEFAULT true,
  requires_time_slot BOOLEAN DEFAULT false,
  max_advance_booking_days INTEGER DEFAULT 30,
  cancellation_policy_hours INTEGER DEFAULT 24,
  auto_create_task BOOLEAN DEFAULT true,
  task_type VARCHAR,
  task_priority VARCHAR DEFAULT 'medium',
  created_by VARCHAR REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create guest_addon_bookings table
CREATE TABLE IF NOT EXISTS guest_addon_bookings (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR REFERENCES organizations(id) NOT NULL,
  service_id INTEGER REFERENCES guest_addon_services(id) NOT NULL,
  property_id INTEGER REFERENCES properties(id) NOT NULL,
  guest_name VARCHAR NOT NULL,
  guest_email VARCHAR,
  guest_phone VARCHAR,
  booking_date TIMESTAMP NOT NULL,
  service_date TIMESTAMP NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR DEFAULT 'AUD',
  billing_route VARCHAR NOT NULL,
  complimentary_type VARCHAR,
  payment_status VARCHAR DEFAULT 'pending',
  payment_method VARCHAR,
  stripe_payment_intent_id VARCHAR,
  special_requests TEXT,
  internal_notes TEXT,
  assigned_task_id INTEGER REFERENCES tasks(id),
  booked_by VARCHAR REFERENCES users(id) NOT NULL,
  confirmed_by VARCHAR REFERENCES users(id),
  cancelled_by VARCHAR REFERENCES users(id),
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create guest_portal_access table
CREATE TABLE IF NOT EXISTS guest_portal_access (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR REFERENCES organizations(id) NOT NULL,
  access_token VARCHAR NOT NULL UNIQUE,
  property_id INTEGER REFERENCES properties(id) NOT NULL,
  guest_name VARCHAR NOT NULL,
  guest_email VARCHAR NOT NULL,
  check_in_date TIMESTAMP NOT NULL,
  check_out_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR REFERENCES users(id) NOT NULL,
  last_accessed_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

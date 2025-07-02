INSERT INTO organizations (id, name, domain, subdomain, is_active) 
VALUES ('default-org', 'Default Organization', 'localhost:5000', 'default', true)
ON CONFLICT (id) DO NOTHING;

-- Clean existing test users first
DELETE FROM userprofile WHERE email IN ('admin@cinema.com', 'user@cinema.com');
DELETE FROM auth.users WHERE email IN ('admin@cinema.com', 'user@cinema.com');

-- Insert users into auth.users first (Supabase Auth)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    phone_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at,
    confirmed_at,
    email_change_confirm_status,
    banned_until,
    deleted_at
) VALUES 
    -- Admin user in auth (CONFIRMED)
    (
        '7e0c10b3-dc2b-44e9-a3e6-511868454067'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated',
        'authenticated',
        'admin@cinema.com',
        crypt('Admin123!', gen_salt('bf')),  
        now(),                               
        NULL,                                
        now(),                               
        now(),                               
        '',                                  
        '',                                  
        '',                                  
        '',                                  
        '{"provider": "email", "providers": ["email"]}',
        '{"first_name": "Admin", "last_name": "User", "email_verified": true}',
        false,                               -- is_super_admin
        now(),                               -- last_sign_in_at
        now(),                               -- confirmed_at: CRITICAL for login
        0,                                   -- email_change_confirm_status
        NULL,                                -- banned_until
        NULL                                 -- deleted_at
    ),
    (
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated',
        'authenticated',
        'user@cinema.com',
        crypt('User123#', gen_salt('bf')),   
        now(),                               
        NULL,                                
        now(),                               
        now(),                               
        '',                                  
        '',                                  
        '',                                  
        '',                                  
        '{"provider": "email", "providers": ["email"]}',
        '{"first_name": "General", "last_name": "User", "email_verified": true}',
        false,                               
        now(),                               
        now(),                               
        0,                                   
        NULL,                                
        NULL                                 
    )
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmed_at = EXCLUDED.confirmed_at,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

-- Insert corresponding userprofile records
INSERT INTO userprofile (
    user_id,
    first_name,
    last_name,
    email,
    is_admin,
    promotion,
    address_line_1,
    city,
    state,
    zip,
    country,
    phone
) VALUES 
    (
        '7e0c10b3-dc2b-44e9-a3e6-511868454067'::uuid,
        'Admin',
        'User',
        'admin@cinema.com',
        true,   
        false,  
        '123 Admin St',
        'Admin City',
        'CA',
        '90210',
        'USA',
        '+1-555-0001'
    ),
    (
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        'General',
        'User', 
        'user@cinema.com',
        false,  
        true,   
        '456 User Ave',
        'User City',
        'CA',
        '90211',
        'USA',
        '+1-555-0002'
    )
ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    is_admin = EXCLUDED.is_admin,
    promotion = EXCLUDED.promotion,
    address_line_1 = EXCLUDED.address_line_1,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip = EXCLUDED.zip,
    country = EXCLUDED.country,
    phone = EXCLUDED.phone;



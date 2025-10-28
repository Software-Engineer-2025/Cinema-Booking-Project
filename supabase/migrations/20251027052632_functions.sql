ALTER TABLE userprofile ENABLE ROW LEVEL SECURITY;
ALTER TABLE paymentcards ENABLE ROW LEVEL SECURITY;

-- Policies 
DROP POLICY IF EXISTS "Users can view their own profile." ON public.userprofile;
CREATE POLICY "Users can view their own profile."
    ON public.userprofile FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.userprofile;
CREATE POLICY "Users can update their own profile."
    ON public.userprofile FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own payment cards." ON public.paymentcards;
CREATE POLICY "Users can manage their own payment cards."
    ON public.paymentcards FOR ALL
    USING (auth.uid() = user_id);

-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_cards_json JSONB;
  card_record JSONB;
  card_data JSONB;
  last_four VARCHAR(4);
  brand TEXT;
BEGIN
  -- Insert user profile
  INSERT INTO userprofile(user_id, first_name, last_name, email, phone, address_line_1, address_line_2, city, state, zip, country)
  VALUES (
    -- Get the UUID from the newly created auth.users row's 'id' column
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address_line_1',
    NEW.raw_user_meta_data->>'address_line_2',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'zip',
    NEW.raw_user_meta_data->>'country'
  );

  -- Process payment cards if they exist
  payment_cards_json := NEW.raw_user_meta_data->'payment_cards';
  
  IF payment_cards_json IS NOT NULL AND jsonb_array_length(payment_cards_json) > 0 THEN
    FOR card_record IN SELECT * FROM jsonb_array_elements(payment_cards_json)
    LOOP
      -- Extract card details
      card_data := jsonb_build_object(
        'cardNumber', card_record->>'cardNumber',
        'name', card_record->>'name',
        'expDate', card_record->>'expDate',
        'cvv', card_record->>'cvv'
      );
      
      -- Get last 4 digits for display
      last_four := RIGHT(card_record->>'cardNumber', 4);
      
      -- Determine card brand
      IF card_record->>'cardNumber' LIKE '4%' THEN 
        brand := 'Visa';
      ELSIF card_record->>'cardNumber' LIKE '5%' THEN 
        brand := 'Mastercard';
      ELSIF card_record->>'cardNumber' LIKE '3%' THEN 
        brand := 'American Express';
      ELSE 
        brand := 'Unknown';
      END IF;
      
      -- Insert encrypted payment card
      INSERT INTO paymentcards (user_id, card_details, card_last_four, card_brand, is_default)
      VALUES (
        NEW.id,
        public.encrypt_payment_card(card_data),
        last_four,
        brand,
        TRUE -- Set first card as default
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;


-- Drop and then Create the trigger to ensure idempotency (no "already exists" error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


CREATE OR REPLACE FUNCTION public.encrypt_payment_card(data_to_encrypt JSONB)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Get encryption key from environment variable
  encryption_key := current_setting('app.encryption_key', true);
  
  -- Fallback to the key from your .env file if not set
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := '1678355c4341b5f079afb80cd7e0c77e28b374cca9b7d90342bf8b3f1680e162';
  END IF;
  
  -- Check if the key is still null
  IF encryption_key IS NULL OR encryption_key = '' THEN
    RAISE EXCEPTION 'Encryption key is not available.';
  END IF;
  
  -- Encrypt the JSONB data 
  RETURN extensions.pgp_sym_encrypt(data_to_encrypt::TEXT, encryption_key);
END;
$$;


CREATE OR REPLACE FUNCTION public.decrypt_payment_card(encrypted_data BYTEA)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Get encryption key from environment variable
  encryption_key := current_setting('app.encryption_key', true);
  
  -- Fallback to the key from your .env file if not set
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := '1678355c4341b5f079afb80cd7e0c77e28b374cca9b7d90342bf8b3f1680e162';
  END IF;
  
  -- Check if the key is still null
  IF encryption_key IS NULL OR encryption_key = '' THEN
    RAISE EXCEPTION 'Encryption key is not available.';
  END IF;

  -- Return decrypted binary data using the key, cast the resulting text back to JSONB
  RETURN extensions.pgp_sym_decrypt(encrypted_data, encryption_key)::JSONB;
END;
$$;



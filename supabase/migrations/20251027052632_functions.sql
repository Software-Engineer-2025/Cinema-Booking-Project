ALTER TABLE userprofile ENABLE ROW LEVEL SECURITY;
ALTER TABLE paymentcards ENABLE ROW LEVEL SECURITY;

-- Policies 
CREATE OR REPLACE POLICY "Users can view their own profile."
ON userprofile FOR SELECT
USING (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can manage their own payment cards."
ON paymentcards FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment cards."
ON paymentcards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add new payment cards."
ON paymentcards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment cards."
ON paymentcards FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment cards."
ON paymentcards FOR DELETE
USING (auth.uid() = user_id);

-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO userprofile(user_id, first_name, last_name)
  VALUES (
    -- Get the UUID from the newly created auth.users row's 'id' column
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
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
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Fetch the encrpyion key
  encryption_key := current_setting('app.settings.encryption_key', true);
  -- Check if the key is null
  IF encryption_key IS NULL OR encryption_key = '' THEN
    RAISE EXCEPTION 'Encryption key "app.settings.encryption_key" is not set in config.toml.';
  END IF;
  -- Encrypt the JSONB data 
  RETURN pgp_sym_encrypt(data_to_encrypt::TEXT, encryption_key);
END;
$$;


CREATE OR REPLACE FUNCTION public.decrypt_payment_card(encrypted_data BYTEA)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Fetch the master encryption key from the runtime setting.
  encryption_key := current_setting('app.settings.encryption_key', true);

  -- Return decrypted binary data using the key, cast the resulting text back to JSONB,
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key)::JSONB;
END;
$$;



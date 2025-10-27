
ALTER TABLE UserProfile ENABLE ROW LEVEL SECURITY;
Alter TABLE PaymentCards ENABLE ROW LEVEL SECURITY;



-- Policies
CREATE POLICY "Users can view their own profile."
ON UserProfile FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment cards."
ON PaymentCards FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment cards."
ON PaymentCards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add new payment cards."
ON PaymentCards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment cards."
ON PaymentCards FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment cards."
ON PaymentCards FOR DELETE
USING (auth.uid() = user_id);


-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into the lowercase 'userprofile' table with the 'user_id' column
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


-- Create the trigger that calls this function after a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();



DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.encrypt_payment_card(data_to_encrypt JSONB)
RETURNS BYTEA
LANGUAGE plpgsql
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Securely fetch the encryption key from the custom runtime parameter.
  -- The 'true' argument indicates that an error should not be raised if the setting is missing.
  encryption_key := current_setting('app.settings.encryption_key', true);
  -- Manually check if the key is null or empty and raise an exception.
  IF encryption_key IS NULL OR encryption_key = '' THEN
    RAISE EXCEPTION 'Encryption key "app.settings.encryption_key" is not set in config.toml.';
  END IF;
  -- Encrypt the JSONB data (first cast to text) using the fetched key and return results
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
  -- Securely fetch the master encryption key from the runtime setting.
  encryption_key := current_setting('app.settings.encryption_key', true);

  IF encryption_key IS NULL OR encryption_key = '' THEN
    RAISE EXCEPTION 'Encryption key "app.settings.encryption_key" is not set in config.toml.';
  END IF;

  -- Decrypt the binary data using the key, cast the resulting text back to JSONB,
  -- and return it.
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key)::JSONB;
END;
$$;



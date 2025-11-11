ALTER TABLE promotion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view promotions" ON promotion
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage promotions" ON promotion
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM userprofile 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

CREATE OR REPLACE FUNCTION public.validate_promotion_usage(target_user_id UUID, promotion_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record userprofile%ROWTYPE;
    promo_record promotion%ROWTYPE;
    result JSONB;
BEGIN
    SELECT * INTO user_record 
    FROM userprofile 
    WHERE user_id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'User not found');
    END IF;
    
    IF user_record.promotion = false THEN
        RETURN jsonb_build_object('valid', false, 'error', 'User is not eligible for promotions (promotion must be true)');
    END IF;
    
    SELECT * INTO promo_record 
    FROM promotion 
    WHERE promo_code = promotion_code;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Invalid promotion code');
    END IF;
    
    IF promo_record.start_date IS NOT NULL AND promo_record.start_date > CURRENT_DATE THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Promotion has not started yet');
    END IF;
    
    IF promo_record.end_date IS NOT NULL AND promo_record.end_date < CURRENT_DATE THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Promotion has expired');
    END IF;
    
    RETURN jsonb_build_object(
        'valid', true,
        'discount', promo_record.discount,
        'promotion_id', promo_record.promotion_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_promotion_to_user(target_user_id UUID, promotion_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    validation_result JSONB;
BEGIN
    validation_result := public.validate_promotion_usage(target_user_id, promotion_code);
    
    IF (validation_result->>'valid')::boolean = false THEN
        RETURN validation_result;
    END IF;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Promotion applied successfully',
            'discount', validation_result->'discount'
        );
    END IF;
    
    
    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Promotion applied successfully',
            'discount', validation_result->'discount'
        );
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Failed to update user');
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_direct_promotion_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF current_setting('app.allow_promotion_update', true) = 'true' THEN
        RETURN NEW;
    END IF;
    
    IF OLD.promotion = true AND NEW.promotion = false THEN
        RAISE EXCEPTION 'Users cannot lose promotion eligibility once they have it';
    END IF;
    
    RETURN NEW;
END;
$$;


CREATE INDEX IF NOT EXISTS idx_userprofile_promotion ON userprofile(promotion);

CREATE INDEX IF NOT EXISTS idx_promotion_promo_code ON promotion(promo_code);

ALTER TABLE promotion ADD CONSTRAINT check_positive_discount 
    CHECK (discount > 0 AND discount <= 100);

ALTER TABLE promotion ADD CONSTRAINT check_date_order 
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);
-- Verifica stato bonus: quali sono purchasable?
SELECT 
    title, 
    required_course_id, 
    is_purchasable, 
    price_cents,
    delivery_type
FROM bonus_content
ORDER BY is_purchasable DESC, title;

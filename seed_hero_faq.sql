-- Insert Public Questions for Hero FAQ
INSERT INTO public.faq_questions (category_id, question, answer_html, is_public, order_index)
SELECT 
    id, 
    'Posso chiedere il rimborso?', 
    '<p>Sì, offriamo una garanzia <strong>Soddisfatti o Rimborsati di 30 giorni</strong>. Se il protocollo non risuona con la tua frequenza, scrivici e ti rimborseremo, senza domande.</p>',
    true,
    1
FROM public.faq_categories WHERE title LIKE 'Pagamenti%' LIMIT 1;

INSERT INTO public.faq_questions (category_id, question, answer_html, is_public, order_index)
SELECT 
    id, 
    'Quanto tempo ho accesso al materiale?', 
    '<p>L''accesso è <strong>a vita</strong> (Lifetime). Include tutti gli aggiornamenti futuri della matrice che hai acquistato.</p>',
    true,
    2
FROM public.faq_categories WHERE title LIKE 'Contenuti%' LIMIT 1;

INSERT INTO public.faq_questions (category_id, question, answer_html, is_public, order_index)
SELECT 
    id, 
    'Riceverò un certificato?', 
    '<p>Assolutamente. Al completamento del percorso e superamento dell''Esame della Singolarità, riceverai il <strong>Diploma NFT Vox Lux</strong> registrato su Blockchain.</p>',
    true,
    3
FROM public.faq_categories WHERE title LIKE 'Contenuti%' LIMIT 1;

INSERT INTO public.faq_questions (category_id, question, answer_html, is_public, order_index)
SELECT 
    id, 
    'Posso pagare a rate?', 
    '<p>Sì, offriamo piani di pagamento flessibili tramite Klarna o PayPal in 3 rate senza interessi. Seleziona l''opzione al checkout.</p>',
    true,
    4
FROM public.faq_categories WHERE title LIKE 'Pagamenti%' LIMIT 1;

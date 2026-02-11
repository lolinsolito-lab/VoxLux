-- 1. Create FAQ Categories Table
create table if not exists public.faq_categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  icon text, -- Lucide icon name
  is_public boolean default true, -- Visible to non-logged users?
  order_index integer default 0
);

-- 2. Create FAQ Questions Table
create table if not exists public.faq_questions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category_id uuid references public.faq_categories(id) on delete cascade not null,
  question text not null,
  answer_html text not null, -- Rich text content
  is_public boolean default true,
  order_index integer default 0,
  helpful_count integer default 0,
  view_count integer default 0
);

-- 3. Enable RLS
alter table public.faq_categories enable row level security;
alter table public.faq_questions enable row level security;

-- 4. RLS Policies
-- Categories: Everyone can read public ones
create policy "Public categories are viewable by everyone"
  on public.faq_categories for select
  using (is_public = true);

-- Categories: Authenticated users can read all (or restrict if needed)
create policy "Authenticated users can see all categories"
  on public.faq_categories for select
  to authenticated
  using (true);

-- Categories: Admins can do everything
create policy "Admins can manage categories"
  on public.faq_categories for all
  to authenticated
  using (((auth.jwt() ->> 'email') = ANY (ARRAY['michael@insolito.dev'::text, 'axel@insolito.dev'::text]))); -- Add other admins

-- Questions: Same logic
create policy "Public questions are viewable by everyone"
  on public.faq_questions for select
  using (is_public = true);

create policy "Authenticated users can see all questions"
  on public.faq_questions for select
  to authenticated
  using (true);

create policy "Admins can manage questions"
  on public.faq_questions for all
  to authenticated
  using (((auth.jwt() ->> 'email') = ANY (ARRAY['michael@insolito.dev'::text, 'axel@insolito.dev'::text])));

-- 5. Insert Default Categories
insert into public.faq_categories (title, description, icon, order_index) values
('Accesso & Account', 'Problemi di login, password e gestione profilo', 'User', 1),
('Pagamenti & Fatturazione', 'Metodi di pagamento, fatture e rimborsi', 'CreditCard', 2),
('Contenuti del Corso', 'Domande sulle lezioni, materiali e quiz', 'BookOpen', 3),
('Supporto Tecnico', 'Bug, errori e problemi di visualizzazione', 'Cpu', 4);

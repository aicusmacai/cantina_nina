-- Adiciona coluna de desconto para professores
ALTER TABLE public.configuracoes 
ADD COLUMN IF NOT EXISTS desconto_professor_percentual NUMERIC(5, 2) NOT NULL DEFAULT 0.00;

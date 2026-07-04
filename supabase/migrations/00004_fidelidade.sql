-- Adiciona a coluna pontos_fidelidade na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS pontos_fidelidade integer DEFAULT 0;

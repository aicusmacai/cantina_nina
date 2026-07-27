-- Refatoração: Cardápio Fixo por Dia da Semana

BEGIN;

-- 1. Limpar dados existentes pois a estrutura mudou drasticamente
DELETE FROM public.pagamentos;
DELETE FROM public.pedidos;
DELETE FROM public.cardapios;

-- 2. Alterar tabela cardapios
ALTER TABLE public.cardapios DROP COLUMN data_inicio_semana CASCADE;
ALTER TABLE public.cardapios ADD COLUMN dia_semana INTEGER NOT NULL UNIQUE CHECK (dia_semana BETWEEN 1 AND 5);

-- 3. Alterar tabela pedidos
ALTER TABLE public.pedidos DROP COLUMN cardapio_id CASCADE;

-- 4. Inserir os 5 dias padrão na tabela (1 = Segunda, 5 = Sexta)
INSERT INTO public.cardapios (dia_semana, prato_principal, acompanhamentos, valor_diario, ativo)
VALUES 
  (1, 'A definir', '...', 15.00, true),
  (2, 'A definir', '...', 15.00, true),
  (3, 'A definir', '...', 15.00, true),
  (4, 'A definir', '...', 15.00, true),
  (5, 'A definir', '...', 15.00, true);

COMMIT;

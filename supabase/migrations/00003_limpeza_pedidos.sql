BEGIN;

-- Limpar todos os pagamentos e pedidos antigos
DELETE FROM public.pagamentos;
DELETE FROM public.pedidos;

COMMIT;

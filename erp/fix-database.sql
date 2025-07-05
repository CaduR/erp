-- Script para corrigir problemas de banco de dados
-- Execute este script no PostgreSQL antes de rodar a aplicação

-- 1. Corrigir valores nulos na tabela clientes
UPDATE clientes SET endereco = 'Endereço não informado' WHERE endereco IS NULL;
UPDATE clientes SET telefone = 'Telefone não informado' WHERE telefone IS NULL;

-- 2. Alterar colunas para NOT NULL
ALTER TABLE clientes ALTER COLUMN endereco SET NOT NULL;
ALTER TABLE clientes ALTER COLUMN telefone SET NOT NULL;

-- 3. Corrigir tipos de ID para UUID
-- Primeiro, remover constraints de chave estrangeira
ALTER TABLE venda_itens DROP CONSTRAINT IF EXISTS FK68933rm62sebr77pbqsmgae4s;

-- Alterar coluna produto_id para UUID
ALTER TABLE venda_itens ALTER COLUMN produto_id TYPE UUID USING produto_id::uuid;

-- Recriar constraint de chave estrangeira
ALTER TABLE venda_itens 
ADD CONSTRAINT FK68933rm62sebr77pbqsmgae4s 
FOREIGN KEY (produto_id) REFERENCES produtos(id);

-- 4. Verificar se há outros problemas de tipos
-- Se necessário, ajustar outras colunas de ID para UUID 
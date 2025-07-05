-- Dados de exemplo para o ERP
-- Execute este script no seu banco PostgreSQL

-- Inserir configuração de empresa de exemplo
INSERT INTO configuracao_empresa (nome_empresa, cnpj, endereco, telefone, email, logo_url) VALUES
('Empresa Exemplo', '12345678000199', 'Rua Exemplo, 123', '(11) 99999-9999', 'contato@empresaexemplo.com', null);

-- Inserir produtos de exemplo
INSERT INTO produtos (id, codigo, nome, descricao, preco, quantidade_estoque, quantidade_minima, categoria, unidade_medida, ativo, data_criacao, data_atualizacao) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'LAP001', 'Laptop Dell Inspiron 15', 'Laptop Dell Inspiron 15 polegadas, Intel i5, 8GB RAM, 256GB SSD', 3499.99, 15, 5, 'Informática', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'MOUSE001', 'Mouse Wireless Logitech', 'Mouse sem fio Logitech com sensor óptico de alta precisão', 89.90, 50, 10, 'Informática', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'TECLADO001', 'Teclado Mecânico RGB', 'Teclado mecânico com switches blue e iluminação RGB', 299.90, 25, 8, 'Informática', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'MONITOR001', 'Monitor LG 24"', 'Monitor LG 24 polegadas Full HD, 75Hz, HDMI', 899.90, 12, 3, 'Informática', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'CADEIRA001', 'Cadeira Gamer', 'Cadeira gamer ergonômica com apoio lombar e braços ajustáveis', 599.90, 8, 2, 'Móveis', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'MESA001', 'Mesa de Escritório', 'Mesa de escritório 120x60cm com gaveta e prateleira', 299.90, 20, 5, 'Móveis', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'COCA001', 'Coca-Cola 2L', 'Refrigerante Coca-Cola 2 litros', 8.90, 100, 20, 'Bebidas', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'AGUA001', 'Água Mineral 500ml', 'Água mineral natural 500ml', 2.50, 200, 50, 'Bebidas', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'BISCOITO001', 'Biscoito Recheado', 'Biscoito recheado de chocolate 130g', 3.90, 150, 30, 'Alimentos', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'SABONETE001', 'Sabonete Líquido', 'Sabonete líquido 500ml com fragrância suave', 12.90, 80, 15, 'Higiene', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'DETERGENTE001', 'Detergente Líquido', 'Detergente líquido para louças 500ml', 4.90, 120, 25, 'Limpeza', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'MARTELO001', 'Martelo de Carpinteiro', 'Martelo de carpinteiro 500g com cabo de madeira', 45.90, 30, 8, 'Ferramentas', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'CHAVE001', 'Jogo de Chaves', 'Jogo de chaves de fenda e philips 6 peças', 29.90, 40, 10, 'Ferramentas', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'CAMISETA001', 'Camiseta Básica', 'Camiseta básica 100% algodão, várias cores', 39.90, 200, 50, 'Roupas', 'UN', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'CALCA001', 'Calça Jeans', 'Calça jeans masculina, várias numerações', 89.90, 150, 30, 'Roupas', 'UN', true, NOW(), NOW());

-- Inserir clientes de exemplo
INSERT INTO clientes (id, cpf, nome, email, telefone, endereco, ativo, data_criacao, data_atualizacao) VALUES
('550e8400-e29b-41d4-a716-446655440101', '123.456.789-01', 'João Silva', 'joao.silva@email.com', '(11) 99999-1111', 'Rua das Flores, 123 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '987.654.321-02', 'Maria Santos', 'maria.santos@email.com', '(11) 99999-2222', 'Av. Paulista, 456 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', '111.222.333-04', 'Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 99999-3333', 'Rua Augusta, 789 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', '444.555.666-07', 'Ana Costa', 'ana.costa@email.com', '(11) 99999-4444', 'Rua Oscar Freire, 321 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', '777.888.999-10', 'Carlos Ferreira', 'carlos.ferreira@email.com', '(11) 99999-5555', 'Av. Brigadeiro Faria Lima, 654 - São Paulo/SP', true, NOW(), NOW());

-- Inserir fornecedores de exemplo
INSERT INTO fornecedores (id, cnpj, nome, email, telefone, endereco, ativo, data_criacao, data_atualizacao) VALUES
('550e8400-e29b-41d4-a716-446655440201', '12.345.678/0001-01', 'Tech Solutions Ltda', 'contato@techsolutions.com', '(11) 3333-1111', 'Rua da Tecnologia, 100 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '98.765.432/0001-02', 'Móveis Express Ltda', 'vendas@moveisexpress.com', '(11) 3333-2222', 'Av. dos Móveis, 200 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', '11.222.333/0001-03', 'Bebidas Refrescantes Ltda', 'pedidos@bebidasrefrescantes.com', '(11) 3333-3333', 'Rua das Bebidas, 300 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', '44.555.666/0001-04', 'Alimentos Saudáveis Ltda', 'contato@alimentossaudaveis.com', '(11) 3333-4444', 'Av. dos Alimentos, 400 - São Paulo/SP', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440205', '77.888.999/0001-05', 'Ferramentas Profissionais Ltda', 'vendas@ferramentasprofissionais.com', '(11) 3333-5555', 'Rua das Ferramentas, 500 - São Paulo/SP', true, NOW(), NOW());

-- Inserir contas a receber de exemplo
INSERT INTO contas_receber (id, cliente_id, descricao, valor, data_vencimento, status, data_criacao, data_atualizacao) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', 'Venda de produtos eletrônicos', 3589.79, '2024-02-15', 'PENDENTE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440102', 'Venda de móveis', 899.80, '2024-02-20', 'PENDENTE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440103', 'Venda de ferramentas', 75.80, '2024-02-25', 'PENDENTE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440104', 'Venda de roupas', 129.80, '2024-03-01', 'PENDENTE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440105', 'Venda de produtos de higiene', 17.80, '2024-03-05', 'PENDENTE', NOW(), NOW()); 
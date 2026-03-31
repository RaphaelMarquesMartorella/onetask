-- OneTask - Dados iniciais
-- Executar após as migrations do Alembic

-- Verifica se já existe o usuário admin para evitar duplicação
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@onetask.com') THEN

        -- Usuário administrador
        INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'admin@onetask.com',
            '$2b$12$M/.obf0PJAld53Nw48srd.pIsEf/XnNuw0zc5cNEfb.S0kRiEjzJa', -- senha: admin123
            'Administrador',
            'admin',
            true,
            NOW(),
            NOW()
        );

        -- Projeto 1: Sistema de Gestão Empresarial
        INSERT INTO projects (id, name, description, client_name, status, start_date, due_date, created_by, created_at, updated_at)
        VALUES (
            'b0000000-0000-0000-0000-000000000001',
            'Sistema de Gestão Empresarial',
            'Desenvolvimento de ERP completo para gestão de processos internos, incluindo módulos de RH, financeiro e vendas.',
            'TechCorp Solutions',
            'active',
            CURRENT_DATE - INTERVAL '30 days',
            CURRENT_DATE + INTERVAL '60 days',
            'a0000000-0000-0000-0000-000000000001',
            NOW(),
            NOW()
        );

        -- Tarefas do Projeto 1
        INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, created_by, due_date, estimated_hours, position, created_at, updated_at) VALUES
        ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Modelagem do banco de dados', 'Criar diagrama ER e definir estrutura das tabelas principais do sistema', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '20 days', 16, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'API de autenticação', 'Implementar endpoints de login, registro e refresh token com JWT', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '15 days', 12, 1, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Módulo de gestão de usuários', 'CRUD completo de usuários com controle de permissões e roles', 'in_progress', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '5 days', 20, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Dashboard financeiro', 'Tela de visualização de métricas financeiras com gráficos interativos', 'in_progress', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '10 days', 24, 1, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Relatórios em PDF', 'Gerar relatórios exportáveis em PDF para módulo financeiro', 'todo', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '20 days', 8, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Integração com gateway de pagamento', 'Conectar sistema com API do Stripe para processamento de pagamentos', 'todo', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '25 days', 16, 1, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'Testes de integração', 'Criar suite de testes automatizados para APIs críticas', 'todo', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '30 days', 12, 2, NOW(), NOW());

        -- Projeto 2: App Mobile de Delivery
        INSERT INTO projects (id, name, description, client_name, status, start_date, due_date, created_by, created_at, updated_at)
        VALUES (
            'b0000000-0000-0000-0000-000000000002',
            'App Mobile de Delivery',
            'Aplicativo mobile para delivery de restaurantes com rastreamento em tempo real e pagamento integrado.',
            'FoodExpress',
            'active',
            CURRENT_DATE - INTERVAL '15 days',
            CURRENT_DATE + INTERVAL '45 days',
            'a0000000-0000-0000-0000-000000000001',
            NOW(),
            NOW()
        );

        -- Tarefas do Projeto 2
        INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, created_by, due_date, estimated_hours, position, created_at, updated_at) VALUES
        ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000002', 'Setup React Native com Expo', 'Configurar ambiente de desenvolvimento e estrutura inicial do projeto', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '10 days', 4, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002', 'Telas de autenticação', 'Implementar login, cadastro e recuperação de senha com validações', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 10, 1, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002', 'Listagem de restaurantes', 'Tela com cards de restaurantes, filtros por categoria e busca', 'in_progress', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '3 days', 14, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002', 'Carrinho de compras', 'Funcionalidade de adicionar/remover itens e cálculo de total', 'in_review', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', 12, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'Integração com mapas', 'Rastreamento em tempo real do entregador usando Google Maps API', 'todo', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '15 days', 16, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 'Push notifications', 'Notificações de status do pedido via Firebase Cloud Messaging', 'todo', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '20 days', 8, 1, NOW(), NOW());

        -- Projeto 3: Portal de E-commerce
        INSERT INTO projects (id, name, description, client_name, status, start_date, due_date, created_by, created_at, updated_at)
        VALUES (
            'b0000000-0000-0000-0000-000000000003',
            'Portal de E-commerce',
            'Plataforma de vendas online com catálogo de produtos, checkout e painel administrativo.',
            'MegaStore',
            'active',
            CURRENT_DATE - INTERVAL '45 days',
            CURRENT_DATE + INTERVAL '30 days',
            'a0000000-0000-0000-0000-000000000001',
            NOW(),
            NOW()
        );

        -- Tarefas do Projeto 3
        INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, created_by, due_date, estimated_hours, position, created_at, updated_at) VALUES
        ('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000003', 'Design system e componentes UI', 'Criar biblioteca de componentes reutilizáveis com Storybook', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '30 days', 20, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000003', 'Catálogo de produtos', 'Listagem com filtros, ordenação e paginação', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '20 days', 18, 1, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000003', 'Página de detalhes do produto', 'Galeria de imagens, variações, avaliações e produtos relacionados', 'done', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '15 days', 14, 2, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000003', 'Fluxo de checkout', 'Processo de finalização de compra em etapas com validação de dados', 'in_review', 'high', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE, 16, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000003', 'Painel administrativo', 'Dashboard para gestão de produtos, pedidos e clientes', 'in_progress', 'medium', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '10 days', 24, 0, NOW(), NOW()),
        ('c0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000003', 'Sistema de cupons de desconto', 'Criar e gerenciar cupons com regras de aplicação', 'todo', 'low', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '25 days', 10, 0, NOW(), NOW());

    END IF;
END $$;

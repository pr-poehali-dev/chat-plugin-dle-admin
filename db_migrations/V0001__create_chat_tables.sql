-- Создание таблицы пользователей чата
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    messages_count INTEGER DEFAULT 0,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы чатов (диалогов)
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    file_url VARCHAR(500),
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы логов модерации
CREATE TABLE IF NOT EXISTS moderation_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    moderator_name VARCHAR(255) NOT NULL,
    target_user_id INTEGER,
    log_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы настроек
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление тестовых пользователей
INSERT INTO users (name, email, avatar, status, messages_count, last_active) VALUES
('Алексей Петров', 'alex@mail.ru', 'АП', 'active', 1245, NOW() - INTERVAL '2 minutes'),
('Мария Сидорова', 'maria@mail.ru', 'МС', 'warning', 834, NOW() - INTERVAL '15 minutes'),
('Иван Иванов', 'ivan@mail.ru', 'ИИ', 'banned', 412, NOW() - INTERVAL '1 hour'),
('Елена Козлова', 'elena@mail.ru', 'ЕК', 'active', 2103, NOW() - INTERVAL '5 minutes'),
('Дмитрий Смирнов', 'dmitry@mail.ru', 'ДС', 'active', 567, NOW() - INTERVAL '2 days')
ON CONFLICT (email) DO NOTHING;

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_users ON chats(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

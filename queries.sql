-- Cписок всех категорий
SELECT * FROM categories;

-- Cписок категорий для которых создана минимум одна публикация
SELECT id, name FROM categories
    JOIN article_categories
    ON id = category_id
    GROUP BY id;

-- Cписок категорий с количеством публикаций
SELECT id, name, COUNT(article_id) FROM categories
    JOIN article_categories
    ON id = category_id
    GROUP BY id;

-- Cписок публикаций. Сначала свежие публикации
SELECT articles.*,
    users.first_name,
    users.last_name,
    users.email,
    COUNT(comments.id) AS comments_count
FROM articles
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
    GROUP BY articles.id, users.id
    ORDER BY articles.created_at DESC;

-- Полная информация определённой публикации
SELECT articles.*,
    COUNT(comments.id) AS comments_count,
    users.first_name,
    users.last_name,
    users.email
FROM articles
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
    GROUP BY articles.id, users.id;

-- Список из 5 свежих комментариев
SELECT 
    comments.id, 
    comments.article_id, 
    users.first_name, 
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
    LIMIT 5

-- Список комментариев для определенной публикации
SELECT 
    comments.id, 
    comments.article_id, 
    users.first_name, 
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
WHERE article_id = 1
    ORDER BY comments.created_at DESC;

-- Обновить заголовок определенной публикации
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
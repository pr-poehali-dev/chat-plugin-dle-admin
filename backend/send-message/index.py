import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправляет новое сообщение в чат
    Args: event - dict с httpMethod, body (text, sender_id, other_user_id)
          context - объект с request_id, function_name и др.
    Returns: HTTP response с созданным сообщением
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    text = body_data.get('text', '')
    sender_id = body_data.get('sender_id', '1')
    other_user_id = body_data.get('other_user_id')
    file_url = body_data.get('file_url')
    file_type = body_data.get('file_type')
    
    if not text and not file_url:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'text or file_url required'}),
            'isBase64Encoded': False
        }
    
    if not other_user_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'other_user_id required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    # Получаем или создаем чат
    cur.execute('''
        SELECT id FROM chats 
        WHERE (user1_id = %s AND user2_id = %s) 
           OR (user1_id = %s AND user2_id = %s)
    ''', (sender_id, other_user_id, other_user_id, sender_id))
    
    chat_row = cur.fetchone()
    
    if not chat_row:
        cur.execute('''
            INSERT INTO chats (user1_id, user2_id) 
            VALUES (%s, %s) 
            RETURNING id
        ''', (sender_id, other_user_id))
        conn.commit()
        chat_id = cur.fetchone()[0]
    else:
        chat_id = chat_row[0]
    
    # Создаем сообщение
    cur.execute('''
        INSERT INTO messages (chat_id, sender_id, text, file_url, file_type) 
        VALUES (%s, %s, %s, %s, %s) 
        RETURNING id, TO_CHAR(created_at, 'HH24:MI')
    ''', (chat_id, sender_id, text, file_url, file_type))
    
    message_row = cur.fetchone()
    message_id = message_row[0]
    timestamp = message_row[1]
    
    # Обновляем счетчик сообщений
    cur.execute('''
        UPDATE users 
        SET messages_count = messages_count + 1,
            last_active = NOW()
        WHERE id = %s
    ''', (sender_id,))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'id': str(message_id),
            'text': text,
            'sender': 'me',
            'timestamp': timestamp,
            'fileUrl': file_url,
            'fileType': file_type,
            'chatId': chat_id
        }),
        'isBase64Encoded': False
    }

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает список сообщений для конкретного диалога
    Args: event - dict с httpMethod, queryStringParameters (chat_id)
          context - объект с request_id, function_name и др.
    Returns: HTTP response со списком сообщений
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    other_user_id = params.get('other_user_id')
    current_user_id = params.get('user_id', '1')
    
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
    ''', (current_user_id, other_user_id, other_user_id, current_user_id))
    
    chat_row = cur.fetchone()
    
    if not chat_row:
        cur.execute('''
            INSERT INTO chats (user1_id, user2_id) 
            VALUES (%s, %s) 
            RETURNING id
        ''', (current_user_id, other_user_id))
        conn.commit()
        chat_id = cur.fetchone()[0]
    else:
        chat_id = chat_row[0]
    
    # Получаем сообщения
    cur.execute('''
        SELECT 
            m.id, 
            m.text, 
            m.sender_id, 
            m.file_url,
            m.file_type,
            TO_CHAR(m.created_at, 'HH24:MI') as time,
            u.name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.chat_id = %s
        ORDER BY m.created_at ASC
        LIMIT 100
    ''', (chat_id,))
    
    rows = cur.fetchall()
    messages = []
    
    for row in rows:
        messages.append({
            'id': str(row[0]),
            'text': row[1],
            'sender': 'me' if str(row[2]) == current_user_id else 'other',
            'senderName': row[6],
            'timestamp': row[5],
            'fileUrl': row[3],
            'fileType': row[4]
        })
    
    # Получаем информацию о собеседнике
    cur.execute('''
        SELECT name, avatar, status 
        FROM users 
        WHERE id = %s
    ''', (other_user_id,))
    
    user_row = cur.fetchone()
    user_info = {
        'name': user_row[0],
        'avatar': user_row[1],
        'online': user_row[2] == 'active'
    } if user_row else None
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'messages': messages,
            'chatId': chat_id,
            'userInfo': user_info
        }),
        'isBase64Encoded': False
    }

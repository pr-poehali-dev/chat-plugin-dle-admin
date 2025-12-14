import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает список всех диалогов для текущего пользователя
    Args: event - dict с httpMethod, queryStringParameters (user_id)
          context - объект с request_id, function_name и др.
    Returns: HTTP response с списком диалогов
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
    user_id = params.get('user_id', '1')
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    # Получаем список всех пользователей
    cur.execute('''
        SELECT 
            u.id, 
            u.name, 
            u.avatar,
            u.status
        FROM users u
        WHERE u.id != %s
        ORDER BY u.last_active DESC
        LIMIT 20
    ''', (user_id,))
    
    rows = cur.fetchall()
    chats = []
    
    for row in rows:
        chats.append({
            'id': str(row[0]),
            'name': row[1],
            'avatar': row[2],
            'online': row[3] == 'active',
            'lastMessage': 'Начните диалог',
            'timestamp': 'Только что',
            'unread': 0
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'chats': chats}),
        'isBase64Encoded': False
    }
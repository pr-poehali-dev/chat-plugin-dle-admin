import json
import os
import base64
import boto3
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Загружает файл в S3 хранилище и возвращает CDN URL
    Args: event - dict с httpMethod, body (file_base64, file_name, file_type)
          context - объект с request_id, function_name и др.
    Returns: HTTP response с URL загруженного файла
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
    file_base64 = body_data.get('file_base64')
    file_name = body_data.get('file_name', 'file')
    file_type = body_data.get('file_type', 'application/octet-stream')
    
    if not file_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'file_base64 required'}),
            'isBase64Encoded': False
        }
    
    # Декодируем base64
    file_data = base64.b64decode(file_base64)
    
    # Генерируем уникальное имя файла
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_filename = f'chat/{timestamp}_{file_name}'
    
    # Настраиваем S3 клиент
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    
    # Загружаем файл
    s3.put_object(
        Bucket='files',
        Key=unique_filename,
        Body=file_data,
        ContentType=file_type
    )
    
    # Формируем CDN URL
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{unique_filename}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'url': cdn_url,
            'file_name': file_name,
            'file_type': file_type
        }),
        'isBase64Encoded': False
    }

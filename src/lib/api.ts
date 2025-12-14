import funcUrls from '../../backend/func2url.json';

const API_URLS = {
  getChats: funcUrls['get-chats'],
  getMessages: funcUrls['get-messages'],
  sendMessage: funcUrls['send-message'],
  uploadFile: funcUrls['upload-file'],
};

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  senderName?: string;
  timestamp: string;
  fileUrl?: string;
  fileType?: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  online: boolean;
}

export const getChats = async (userId: string): Promise<Chat[]> => {
  const response = await fetch(`${API_URLS.getChats}?user_id=${userId}`);
  const data = await response.json();
  return data.chats;
};

export const getMessages = async (
  userId: string,
  otherUserId: string
): Promise<{ messages: Message[]; userInfo: UserInfo }> => {
  const response = await fetch(
    `${API_URLS.getMessages}?user_id=${userId}&other_user_id=${otherUserId}`
  );
  const data = await response.json();
  return { messages: data.messages, userInfo: data.userInfo };
};

export const sendMessage = async (
  senderId: string,
  otherUserId: string,
  text: string,
  fileUrl?: string,
  fileType?: string
): Promise<Message> => {
  const response = await fetch(API_URLS.sendMessage, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender_id: senderId,
      other_user_id: otherUserId,
      text,
      file_url: fileUrl,
      file_type: fileType,
    }),
  });
  const data = await response.json();
  return data;
};

export const uploadFile = async (
  file: File
): Promise<{ url: string; file_name: string; file_type: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (!base64) {
        reject(new Error('Failed to read file'));
        return;
      }

      const response = await fetch(API_URLS.uploadFile, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_base64: base64,
          file_name: file.name,
          file_type: file.type,
        }),
      });

      const data = await response.json();
      resolve(data);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

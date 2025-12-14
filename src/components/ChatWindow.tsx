import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  senderName?: string;
}

interface ChatWindowProps {
  chatId: string | null;
}

const mockMessages: Message[] = [
  { id: '1', text: 'Привет! Как дела?', timestamp: '14:20', sender: 'other', senderName: 'Алексей Петров' },
  { id: '2', text: 'Отлично! Спасибо за вопрос', timestamp: '14:21', sender: 'me' },
  { id: '3', text: 'Можешь помочь с проектом?', timestamp: '14:22', sender: 'other', senderName: 'Алексей Петров' },
  { id: '4', text: 'Конечно, что нужно сделать?', timestamp: '14:23', sender: 'me' },
];

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (!chatId) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Icon name="MessageCircle" size={40} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Выберите диалог</h3>
          <p className="text-gray-500">Начните общение с пользователями</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 h-[calc(100vh-180px)] flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
              АП
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">Алексей Петров</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Онлайн
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-purple-100 text-purple-600">
            <Icon name="Phone" size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-purple-100 text-purple-600">
            <Icon name="Video" size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-purple-100 text-purple-600">
            <Icon name="MoreVertical" size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 animate-fade-in ${
              message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {message.sender === 'other' && (
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-semibold">
                  АП
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-md ${
                message.sender === 'me'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === 'me' ? 'text-purple-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-purple-100 text-purple-600 shrink-0">
            <Icon name="Paperclip" size={20} />
          </Button>
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-white border-purple-200 focus:border-purple-400"
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shrink-0"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

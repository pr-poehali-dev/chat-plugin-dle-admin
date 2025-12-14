import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { getMessages, sendMessage, uploadFile, Message, UserInfo } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ChatWindowProps {
  chatId: string | null;
  currentUserId: string;
}

const ChatWindow = ({ chatId, currentUserId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(currentUserId, chatId);
        setMessages(data.messages);
        setUserInfo(data.userInfo);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сообщения",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, currentUserId, toast]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };

    setMessages([...messages, tempMessage]);
    setNewMessage('');

    try {
      await sendMessage(currentUserId, chatId, newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      await sendMessage(currentUserId, chatId, `Отправлен файл: ${result.file_name}`, result.url, result.file_type);
      
      const data = await getMessages(currentUserId, chatId);
      setMessages(data.messages);
      
      toast({
        title: "Успешно",
        description: "Файл загружен",
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
              {userInfo?.avatar || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{userInfo?.name || 'Пользователь'}</h3>
            <p className={`text-xs flex items-center gap-1 ${userInfo?.online ? 'text-green-600' : 'text-gray-500'}`}>
              <span className={`w-2 h-2 rounded-full ${userInfo?.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {userInfo?.online ? 'Онлайн' : 'Оффлайн'}
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
        {loading ? (
          <div className="text-center text-gray-500 py-8">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Нет сообщений. Начните диалог!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 animate-fade-in ${
                message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.sender === 'other' && (
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-semibold">
                    {userInfo?.avatar || 'U'}
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
                {message.fileUrl && (
                  <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="block mb-2 underline">
                    📎 {message.fileType?.includes('image') ? 'Изображение' : 'Файл'}
                  </a>
                )}
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
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-purple-100 text-purple-600 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Icon name={uploading ? "Loader2" : "Paperclip"} size={20} />
          </Button>
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="bg-white border-purple-200 focus:border-purple-400"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
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

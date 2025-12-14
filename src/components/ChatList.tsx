import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getChats, Chat } from '@/lib/api';

interface ChatListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  currentUserId: string;
}

const ChatList = ({ selectedChat, onSelectChat, currentUserId }: ChatListProps) => {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats(currentUserId);
        setChats(data);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [currentUserId]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-purple-600" />
          Диалоги
        </h2>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по чатам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-purple-200 focus:border-purple-400"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Нет доступных диалогов</div>
        ) : (
          filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 flex items-start gap-3 border-b border-gray-100 transition-all hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 ${
              selectedChat === chat.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : ''
            }`}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                  {chat.avatar}
                </AvatarFallback>
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{chat.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>

            {chat.unread > 0 && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
                {chat.unread}
              </Badge>
            )}
          </button>
        ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
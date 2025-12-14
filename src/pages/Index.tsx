import { useState } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import AdminPanel from '@/components/AdminPanel';
import Settings from '@/components/Settings';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'admin' | 'settings'>('chat');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isAdmin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Icon name="MessageSquare" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                DLE Chat
              </h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  activeView === 'chat'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-purple-50 hover:scale-105'
                }`}
              >
                <Icon name="MessageCircle" size={18} />
                <span className="font-medium">Чат</span>
              </button>
              
              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveView('admin')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      activeView === 'admin'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    <Icon name="Shield" size={18} />
                    <span className="font-medium">Админка</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('settings')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      activeView === 'settings'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-orange-50 hover:scale-105'
                    }`}
                  >
                    <Icon name="Settings" size={18} />
                    <span className="font-medium">Настройки</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ChatList 
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
              />
            </div>
            <div className="lg:col-span-2">
              <ChatWindow chatId={selectedChat} />
            </div>
          </div>
        )}
        
        {activeView === 'admin' && (
          <div>
            <AdminPanel />
          </div>
        )}
        
        {activeView === 'settings' && (
          <div>
            <Settings />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'banned' | 'warning';
  messagesCount: number;
  lastActive: string;
}

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'block' | 'delete' | 'warn';
}

const mockUsers: User[] = [
  { id: '1', name: 'Алексей Петров', email: 'alex@mail.ru', status: 'active', messagesCount: 1245, lastActive: '2 мин назад' },
  { id: '2', name: 'Мария Сидорова', email: 'maria@mail.ru', status: 'warning', messagesCount: 834, lastActive: '15 мин назад' },
  { id: '3', name: 'Иван Иванов', email: 'ivan@mail.ru', status: 'banned', messagesCount: 412, lastActive: '1 час назад' },
  { id: '4', name: 'Елена Козлова', email: 'elena@mail.ru', status: 'active', messagesCount: 2103, lastActive: '5 мин назад' },
];

const mockLogs: ActivityLog[] = [
  { id: '1', action: 'Заблокирован пользователь Иван Иванов', user: 'Администратор', timestamp: '10:30', type: 'block' },
  { id: '2', action: 'Удалено сообщение с нецензурной лексикой', user: 'Модератор', timestamp: '10:15', type: 'delete' },
  { id: '3', action: 'Предупреждение пользователю Мария Сидорова', user: 'Модератор', timestamp: '09:45', type: 'warn' },
];

const AdminPanel = () => {
  const [users] = useState<User[]>(mockUsers);
  const [logs] = useState<ActivityLog[]>(mockLogs);
  const [search, setSearch] = useState('');

  const stats = {
    totalUsers: 1248,
    activeNow: 87,
    blockedUsers: 23,
    messagesDeleted: 145,
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'banned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'warning': return 'Предупреждение';
      case 'banned': return 'Заблокирован';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <Icon name="Activity" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активны сейчас</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeNow}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-md">
                <Icon name="ShieldAlert" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Заблокировано</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-md">
                <Icon name="Trash2" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Удалено сообщений</p>
                <p className="text-2xl font-bold text-gray-900">{stats.messagesDeleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
          <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Icon name="Users" size={18} className="mr-2" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <Icon name="ScrollText" size={18} className="mr-2" />
            Логи активности
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Icon name="UserCog" size={22} className="text-purple-600" />
                  Управление пользователями
                </span>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Поиск пользователей..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-64 border-purple-200"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{user.messagesCount} сообщений</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{user.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(user.status)} text-white border-0`}>
                        {getStatusLabel(user.status)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="hover:bg-yellow-100 text-yellow-600">
                          <Icon name="AlertTriangle" size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-red-100 text-red-600">
                          <Icon name="Ban" size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-purple-100 text-purple-600">
                          <Icon name="Eye" size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={22} className="text-blue-600" />
                Статистика и логи модератора
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      log.type === 'block' ? 'bg-red-100' : 
                      log.type === 'delete' ? 'bg-orange-100' : 
                      'bg-yellow-100'
                    }`}>
                      {log.type === 'block' && <Icon name="Ban" size={20} className="text-red-600" />}
                      {log.type === 'delete' && <Icon name="Trash2" size={20} className="text-orange-600" />}
                      {log.type === 'warn' && <Icon name="AlertTriangle" size={20} className="text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{log.user}</span>
                        <span className="text-gray-400">•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

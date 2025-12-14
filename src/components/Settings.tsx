import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [autoModeration, setAutoModeration] = useState(true);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);

  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "Все изменения успешно применены",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon name="Shield" size={24} className="text-purple-600" />
            Параметры безопасности
          </CardTitle>
          <CardDescription>Настройте правила модерации и безопасности чата</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Автоматическая модерация</Label>
              <p className="text-sm text-gray-600">Автоматически проверять сообщения на нецензурную лексику</p>
            </div>
            <Switch checked={autoModeration} onCheckedChange={setAutoModeration} />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Вложения в сообщениях</Label>
              <p className="text-sm text-gray-600">Разрешить пользователям прикреплять файлы и изображения</p>
            </div>
            <Switch checked={allowAttachments} onCheckedChange={setAllowAttachments} />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Уведомления</Label>
              <p className="text-sm text-gray-600">Отправлять уведомления о новых сообщениях</p>
            </div>
            <Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Проверка email</Label>
              <p className="text-sm text-gray-600">Требовать подтверждения email для использования чата</p>
            </div>
            <Switch checked={requireEmailVerification} onCheckedChange={setRequireEmailVerification} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon name="Sliders" size={24} className="text-blue-600" />
            Настройки плагина
          </CardTitle>
          <CardDescription>Основные параметры работы чата</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chat-title" className="text-base font-semibold">Название чата</Label>
            <Input
              id="chat-title"
              defaultValue="DLE Chat"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-message-length" className="text-base font-semibold">Максимальная длина сообщения</Label>
            <Input
              id="max-message-length"
              type="number"
              defaultValue="500"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messages-per-page" className="text-base font-semibold">Сообщений на странице</Label>
            <Select defaultValue="50">
              <SelectTrigger className="border-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banned-words" className="text-base font-semibold">Запрещенные слова</Label>
            <Textarea
              id="banned-words"
              placeholder="Введите слова через запятую"
              className="min-h-24 border-blue-200 focus:border-blue-400"
            />
            <p className="text-sm text-gray-600">Сообщения с этими словами будут автоматически блокироваться</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon name="Palette" size={24} className="text-orange-600" />
            Настройки оформления
          </CardTitle>
          <CardDescription>Настройте внешний вид чата под ваш сайт</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-base font-semibold">Основной цвет</Label>
              <Input
                id="primary-color"
                type="color"
                defaultValue="#8B5CF6"
                className="h-12 border-orange-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-base font-semibold">Дополнительный цвет</Label>
              <Input
                id="secondary-color"
                type="color"
                defaultValue="#D946EF"
                className="h-12 border-orange-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="border-radius" className="text-base font-semibold">Скругление углов</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="border-orange-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без скругления</SelectItem>
                <SelectItem value="small">Маленькое</SelectItem>
                <SelectItem value="medium">Среднее</SelectItem>
                <SelectItem value="large">Большое</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8"
        >
          <Icon name="Save" size={20} className="mr-2" />
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
};

export default Settings;

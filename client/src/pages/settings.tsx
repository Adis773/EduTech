import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { KaspiPaymentButton } from "@/components/payment/KaspiPaymentButton";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CreditCard, Bell, Shield, Moon, UserCircle, BadgeCheck, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("ru");
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-neutral-800">Настройки</h1>
              <p className="mt-2 text-lg text-neutral-600">
                Управление настройками аккаунта и платежами
              </p>

              <div className="mt-8">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="account">
                      <UserCircle className="w-4 h-4 mr-2" />
                      Аккаунт
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Подписка и оплата
                    </TabsTrigger>
                    <TabsTrigger value="preferences">
                      <Globe className="w-4 h-4 mr-2" />
                      Предпочтения
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Account Tab */}
                  <TabsContent value="account">
                    <div className="grid gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Информация профиля</CardTitle>
                          <CardDescription>
                            Ваши персональные данные
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <p className="text-sm font-medium">Имя:</p>
                              <p className="col-span-2">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <p className="text-sm font-medium">Имя пользователя:</p>
                              <p className="col-span-2">{user?.username}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <p className="text-sm font-medium">Email:</p>
                              <p className="col-span-2">{user?.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Безопасность</CardTitle>
                          <CardDescription>
                            Настройки безопасности вашего аккаунта
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                                <p className="text-sm text-neutral-500">
                                  Добавьте дополнительный уровень защиты
                                </p>
                              </div>
                              <Switch id="two-factor" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="session-logging">Журнал сеансов</Label>
                                <p className="text-sm text-neutral-500">
                                  Отслеживать вход с разных устройств
                                </p>
                              </div>
                              <Switch id="session-logging" defaultChecked />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Payments Tab */}
                  <TabsContent value="payments">
                    <div className="grid gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Статус подписки</CardTitle>
                          <CardDescription>
                            Управление вашей подпиской EduTech AI
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="bg-yellow-50 border-l-4 border-amber-500 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Bell className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-amber-800">
                                    Ваш пробный период заканчивается через 7 дней. Оформите подписку, чтобы продолжить пользоваться всеми функциями.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 items-center gap-4">
                              <p className="text-sm font-medium">Текущий план:</p>
                              <div className="col-span-2 flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Пробный период</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 items-center gap-4">
                              <p className="text-sm font-medium">Дата окончания:</p>
                              <p className="col-span-2">18 апреля 2025</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                          <h3 className="text-lg font-medium">Доступные планы</h3>
                          
                          <Card className="w-full border-2 border-primary">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex justify-between items-center">
                                <span>Premium</span>
                                <span className="text-xl font-bold">7,500 ₸ / месяц</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <ul className="grid gap-2">
                                <li className="flex items-center">
                                  <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                                  <span className="text-sm">Неограниченный доступ ко всем курсам</span>
                                </li>
                                <li className="flex items-center">
                                  <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                                  <span className="text-sm">Персонализированные AI рекомендации</span>
                                </li>
                                <li className="flex items-center">
                                  <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                                  <span className="text-sm">Расширенный AI-ассистент</span>
                                </li>
                                <li className="flex items-center">
                                  <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                                  <span className="text-sm">Доступ к эксклюзивным материалам</span>
                                </li>
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <KaspiPaymentButton />
                            </CardFooter>
                          </Card>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Preferences Tab */}
                  <TabsContent value="preferences">
                    <div className="grid gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Язык обучения</CardTitle>
                          <CardDescription>
                            Выберите предпочитаемый язык для контента и интерфейса
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="language">Основной язык</Label>
                              <LanguageSelector 
                                currentLanguage={language}
                                onLanguageChange={handleLanguageChange}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Настройки отображения</CardTitle>
                          <CardDescription>
                            Настройте внешний вид платформы
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="dark-mode">Темная тема</Label>
                                <p className="text-sm text-neutral-500">
                                  Включить темный режим интерфейса
                                </p>
                              </div>
                              <Switch id="dark-mode" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="animations">Анимации</Label>
                                <p className="text-sm text-neutral-500">
                                  Включить анимации интерфейса
                                </p>
                              </div>
                              <Switch id="animations" defaultChecked />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Уведомления</CardTitle>
                          <CardDescription>
                            Настройте предпочтения уведомлений
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="email-notif">Email уведомления</Label>
                                <p className="text-sm text-neutral-500">
                                  Получать уведомления по email
                                </p>
                              </div>
                              <Switch id="email-notif" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="push-notif">Push-уведомления</Label>
                                <p className="text-sm text-neutral-500">
                                  Разрешить браузерные уведомления
                                </p>
                              </div>
                              <Switch id="push-notif" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
// src/pages/preview.tsx
import React, { useState } from 'react';
import { Search, Heart, Eye, ArrowRight, Crown, Menu, X, UserCircle } from 'lucide-react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
          {text}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

// Компонент SideMenu
const SideMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    "О сервисе",
    "Пользовательское соглашение",
    "Тарифы",
    "Вопросы-ответы",
    "Блог",
    "Контакты"
  ];

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`absolute right-0 top-0 h-full w-80 bg-white transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4 border-b">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 py-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-6 py-3 hover:bg-gray-50 text-gray-700"
              >
                {item}
              </button>
            ))}
          </div>
          
          <div className="p-6 border-t text-sm text-gray-500">
            © 2025 TopInBeauty
          </div>
        </div>
      </div>
    </div>
  );
};

const Preview = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  const services = [
    {
      id: 1,
      title: "Фруктовая завивка",
      price: 2500,
      duration: "2 часа",
      master: "Петрова Вероника",
      stats: { views: 1765, favorites: 354 },
      masterRating: { points: 1987, categoryRank: 15 }
    },
    {
      id: 2,
      title: "Маникюр с дизайном",
      price: 2200,
      duration: "2 часа",
      master: "Иванова Анна",
      isPremium: true,
      stats: { views: 982, favorites: 245 },
      masterRating: { points: 2154, categoryRank: 8 }
    },
    {
      id: 3,
      title: "Наращивание ресниц",
      price: 3000,
      duration: "2.5 часа",
      master: "Сидорова Мария",
      isPremium: true,
      stats: { views: 1432, favorites: 312 },
      masterRating: { points: 2265, categoryRank: 5 }
    },
    {
      id: 4,
      title: "Окрашивание волос",
      price: 5000,
      duration: "3 часа",
      master: "Козлова Екатерина", 
      stats: { views: 2103, favorites: 467 },
      masterRating: { points: 1876, categoryRank: 18 }
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-semibold">TopInBeauty</h1>
            <Crown className="h-5 w-5 stroke-[1.5]" />
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium">
              Войти
            </button>
            <button 
              onClick={() => setIsSideMenuOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {/* Filters */}
        <div className="mx-2 mt-2 bg-white rounded-lg shadow-sm">
          <div className="flex gap-2 p-3">
            <select className="flex-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm border-0 focus:ring-1 focus:ring-blue-500">
              <option>Новосибирск</option>
            </select>
            <select className="flex-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm border-0 focus:ring-1 focus:ring-blue-500">
              <option>Советский</option>
            </select>
            <select className="flex-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm border-0 focus:ring-1 focus:ring-blue-500">
              <option>Маникюр</option>
            </select>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-4 p-2">
          {services.map((service) => (
            <article key={service.id} className="bg-white rounded-xl overflow-hidden border">
              <img 
                src="/api/placeholder/400/400"
                alt={service.title}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <div className="text-sm text-blue-600">Завивки и укладки</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Новосибирск, Советский</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xl">{service.price} ₽</p>
                    <p className="font-medium text-xl text-gray-500">{service.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/api/placeholder/32/32"
                        alt={service.master}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium">{service.master}</span>
                      {service.isPremium && (
                        <Tooltip 
                          text={`Рейтинг мастера ${service.masterRating.points}, В категории "${service.title}" №${service.masterRating.categoryRank} в советском районе`}
                        >
                          <Crown className="h-4 w-4 text-yellow-400" />
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{service.stats.favorites}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">{service.stats.views}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="flex justify-around items-center h-14">
          <button className="flex flex-col items-center text-[#0B6E4F]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Главная</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
            <Heart className="h-6 w-6" />
            <span className="text-xs">Избранное</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs">Записи</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
            <UserCircle className="h-6 w-6" />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </nav>

      {/* Side Menu */}
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
    </div>
  );
};

export default Preview;
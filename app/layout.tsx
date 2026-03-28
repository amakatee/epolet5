// app/layout.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  title: {
    default: 'Изделия из ППУ - Эполет',
    template: '%s | Эполет'
  },
  description: 'Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана.',
  keywords: 'Интегральный ппу, Жесткий ппу, Пена для матраса, Поролон с памятью, Подлокотники, Пенополиуретан',
  authors: [{ name: 'Эполет' }],
  verification: {
    yandex: '9ec83ae61756bb79',
    google: 'qOh-BE-b0Wza7g3_rzejubyBJcqZpwLJbxq2WOJAY0c',
  },
  icons: {
    icon: '/ep.png',
    shortcut: '/ep.png',
    apple: '/ep.png',
  },
  openGraph: {
    title: 'Изделия из ППУ - Эполет',
    description: 'Производство изделий из пенополиуретана',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-grow pt-[8vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './Navigation';
import Footer from './about/components/Footer';


export const metadata = {
    title: 'ReframePoint',
    description: 'Reframing through education',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body style={{ backgroundColor: '#faf8f4' }}>
                <AuthProvider>
                    <Navigation />
                    <main className="mt-[60px]">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}

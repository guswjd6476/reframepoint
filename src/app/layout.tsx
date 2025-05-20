import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './Navigation';

export const metadata = {
    title: 'ReframePoint',
    description: 'Reframing through education',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <AuthProvider>
                    <Navigation />
                    <main className="mt-[60px]">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}

import { useEffect } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router';
import { ScrollManager } from '@/components/layout/scroll-manager';
import { Footer } from '@/components/landing/footer';
import { Nav } from '@/components/landing/nav';
import { COOKIES, PRIVACY, TERMS } from '@/lib/legal';
import { ContactPage } from '@/pages/contact';
import { DocsPage } from '@/pages/docs';
import { GetStartedPage } from '@/pages/get-started';
import { HomePage } from '@/pages/home';
import { LegalPage } from '@/pages/legal';
import { NotFoundPage } from '@/pages/not-found';
import { UnauthorizedPage } from '@/pages/unauthorized';

const TITLES: Record<string, string> = {
  '/': 'Prodmate: turn your software idea into a development plan',
  '/docs': 'Docs · Prodmate',
  '/get-started': 'Get started · Prodmate',
  '/contact': 'Contact · Prodmate',
  '/privacy': 'Privacy Policy · Prodmate',
  '/terms': 'Terms of Service · Prodmate',
  '/cookies': 'Cookie Policy · Prodmate',
  '/401': 'Sign in required · Prodmate',
  '/unauthorized': 'Sign in required · Prodmate',
};

export default function App() {
  return (
    // Every animation follows the visitor's reduce-motion setting. LazyMotion loads only the
    // animation features the demos use; components use `m.*` instead of `motion.*` (strict mode).
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="docs" element={<DocsPage />} />
              <Route path="get-started" element={<GetStartedPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<LegalPage doc={PRIVACY} />} />
              <Route path="terms" element={<LegalPage doc={TERMS} />} />
              <Route path="cookies" element={<LegalPage doc={COOKIES} />} />
              <Route path="401" element={<UnauthorizedPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </MotionConfig>
  );
}

/** The bar and footer around every page, and the tab title for each one. */
function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Page not found · Prodmate';
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

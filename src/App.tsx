/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { IngredientSection } from './components/IngredientSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { HowToConsumeSection } from './components/HowToConsumeSection';
import { ProductOrderSection, ProductPlan, PRODUCT_PLANS } from './components/ProductOrderSection';
import { OrderModal } from './components/OrderModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { AdminOrderModal } from './components/AdminOrderModal';
import { AuthModal } from './components/AuthModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Footer } from './components/Footer';
import { AppUser, getSavedUser, logoutUser } from './services/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getSavedUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'signup'>('login');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan>(PRODUCT_PLANS[1]);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);

  // Temporary pending action to resume after login
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Validate Firestore connectivity on initial mount and monitor auth
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'orders', 'init_test'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firebase client is offline or initializing.');
        }
      }
    }
    testConnection();

    // Sync Firebase Auth state
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setCurrentUser((prev) => ({
          uid: fbUser.uid,
          email: fbUser.email || prev?.email || '',
          displayName: fbUser.displayName || prev?.displayName || (fbUser.email ? fbUser.email.split('@')[0] : '고객'),
        }));
      }
    });

    return () => unsub();
  }, []);

  /**
   * Order trigger with mandatory Login / Signup check:
   * "주문하려면 먼저 회원가입하고 로그인하게 해줘"
   */
  const handleOpenOrder = () => {
    if (!currentUser) {
      setAuthPromptMessage('주문하시려면 먼저 회원가입 또는 로그인을 진행해 주세요.');
      setAuthDefaultMode('login');
      setPendingAction(() => () => {
        setSelectedPlan(PRODUCT_PLANS[1]);
        setOrderQuantity(1);
        setIsOrderModalOpen(true);
      });
      setIsAuthModalOpen(true);
      return;
    }

    setSelectedPlan(PRODUCT_PLANS[1]);
    setOrderQuantity(1);
    setIsOrderModalOpen(true);
  };

  const handleOpenOrderWithPlan = (plan: ProductPlan, count: number) => {
    if (!currentUser) {
      setAuthPromptMessage('주문하시려면 먼저 회원가입 또는 로그인을 진행해 주세요.');
      setAuthDefaultMode('login');
      setPendingAction(() => () => {
        setSelectedPlan(plan);
        setOrderQuantity(count);
        setIsOrderModalOpen(true);
      });
      setIsAuthModalOpen(true);
      return;
    }

    setSelectedPlan(plan);
    setOrderQuantity(count);
    setIsOrderModalOpen(true);
  };

  const handleAuthSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    // If an order was pending before login, resume order immediately
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleCloseOrder = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2E20] flex flex-col font-sans selection:bg-[#22482B]/20 selection:text-[#18361E]">
      {/* 1. Header with "윤성미 님 환영합니다" welcome bar and user controls */}
      <Header
        currentUser={currentUser}
        onOpenOrder={handleOpenOrder}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAuth={() => {
          setAuthPromptMessage(undefined);
          setAuthDefaultMode('login');
          setPendingAction(null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section: "하루한잔, 간편한 한끼" & Big "주문하기" Button */}
        <Hero onOpenOrder={handleOpenOrder} />

        {/* 3. 50 Korean Domestic Ingredients & Production Technology */}
        <IngredientSection />

        {/* 4. Target Audience: "이런 분께 좋아요" (3 types) */}
        <TargetAudienceSection onOpenOrder={handleOpenOrder} />

        {/* 5. How to Consume: "물이나 우유에 타서 드세요" (1 -> 2 -> 3 steps) */}
        <HowToConsumeSection />

        {/* 6. Product & Pricing & Big "주문하기" button */}
        <ProductOrderSection onOpenOrderWithPlan={handleOpenOrderWithPlan} />
      </main>

      {/* 7. Footer with legal, food regulation disclosures, lookup & admin buttons */}
      <Footer
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 8. Mobile Sticky Order Bar */}
      <MobileStickyBar onOpenOrder={handleOpenOrder} />

      {/* 9. Login / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultMode={authDefaultMode}
        promptMessage={authPromptMessage}
      />

      {/* 10. Interactive Order Modal (Places real orders into Firestore DB) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
        currentUser={currentUser}
        initialPlan={selectedPlan}
        initialQuantity={orderQuantity}
      />

      {/* 11. Customer Order Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      {/* 12. Store Owner Order Management Dashboard Modal */}
      <AdminOrderModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

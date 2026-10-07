import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { registerWithEmail, loginWithEmail, AppUser } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
  defaultMode?: 'login' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();

    // 1. Common email validation
    if (!cleanEmail) {
      setErrorMessage('이메일 주소를 입력해 주세요.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('이메일 형식이 올바르지 않습니다. (예: user@example.com)');
      return;
    }

    // 2. Password validation: Required minimum 6 characters
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(
        `비밀번호는 6자 이상이어야 합니다. (현재 입력: ${password.length}자) 안전을 위해 6자리 이상으로 입력해 주세요.`
      );
      return;
    }

    // 3. Signup specific validation
    if (mode === 'signup') {
      const cleanName = name.trim();
      if (!cleanName) {
        setErrorMessage('성함(이름)을 입력해 주세요. (예: 윤성미)');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다. 다시 확인해 주세요.');
        return;
      }

      setIsLoading(true);
      try {
        const newUser = await registerWithEmail(cleanName, cleanEmail, password);
        setSuccessNotice(`${newUser.displayName} 님, 회원가입이 완료되었습니다!`);
        setTimeout(() => {
          onSuccess(newUser);
          onClose();
        }, 600);
      } catch (err: any) {
        setErrorMessage(err.message || '회원가입 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // 4. Login
      setIsLoading(true);
      try {
        const loggedUser = await loginWithEmail(cleanEmail, password);
        setSuccessNotice(`${loggedUser.displayName} 님, 환영합니다!`);
        setTimeout(() => {
          onSuccess(loggedUser);
          onClose();
        }, 500);
      } catch (err: any) {
        setErrorMessage(err.message || '로그인 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#E5DACB] overflow-hidden my-4">
        
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-[#E8DDCF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22482B] text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20]">
              {mode === 'login' ? '하루한잔 로그인' : '하루한잔 간편 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#EAE0D3] flex items-center justify-center text-[#55695A] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prompt banner if required for ordering */}
        {promptMessage && (
          <div className="bg-[#EAF2EC] px-5 py-3 border-b border-[#D5E4D8] flex items-center gap-2 text-xs sm:text-sm font-bold text-[#22482B]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Segmented Mode Selector Tabs */}
        <div className="p-4 bg-[#F5EFEB] border-b border-[#E8DDCF] flex gap-2">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-base font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#22482B] text-white shadow-sm'
                : 'bg-white text-[#526657] hover:bg-[#EAE0D3] border border-[#DDD0C0]'
            }`}
          >
            기존 회원 로그인
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 rounded-xl text-base font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#22482B] text-white shadow-sm'
                : 'bg-white text-[#526657] hover:bg-[#EAE0D3] border border-[#DDD0C0]'
            }`}
          >
            신규 회원가입
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
          
          {/* Success notice */}
          {successNotice && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error notice (Clear Korean explanation) */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-800 text-sm font-semibold rounded-xl border border-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-red-900">확인해 주세요:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Name Field (Only for Signup) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-[#2A3D2F] mb-1.5">
                성함 / 이름 <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="예: 윤성미"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] pl-10 pr-4 py-3 rounded-xl border border-[#D8C9BC] text-base text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
                <UserIcon className="w-4 h-4 text-[#889B8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-xs text-[#708475] mt-1 block">
                로그인 시 상단에 "윤성미 님 환영합니다"로 표시됩니다.
              </span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-[#2A3D2F] mb-1.5">
              이메일 주소 <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="예: user@naver.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] pl-10 pr-4 py-3 rounded-xl border border-[#D8C9BC] text-base text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
              />
              <Mail className="w-4 h-4 text-[#889B8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-[#2A3D2F]">
                비밀번호 <span className="text-red-600">*</span>
              </label>
              <span className="text-xs font-semibold text-[#829586]">
                6자 이상 필수
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="비밀번호는 6자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] pl-10 pr-4 py-3 rounded-xl border border-[#D8C9BC] text-base text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
              />
              <Lock className="w-4 h-4 text-[#889B8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {password.length > 0 && password.length < 6 && (
              <span className="text-xs font-bold text-red-600 mt-1 block">
                현재 {password.length}자입니다. 6자 이상 입력해야 합니다.
              </span>
            )}
          </div>

          {/* Confirm Password (Only for Signup) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-[#2A3D2F] mb-1.5">
                비밀번호 확인 <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 한 번 더 입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] pl-10 pr-4 py-3 rounded-xl border border-[#D8C9BC] text-base text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
                <Lock className="w-4 h-4 text-[#889B8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <span className="text-xs font-bold text-red-600 mt-1 block">
                  비밀번호가 일치하지 않습니다.
                </span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-black text-white bg-[#22482B] hover:bg-[#18361E] disabled:opacity-50 active:scale-[0.99] rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>처리 중...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>로그인하기</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>회원가입 완료하기</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Bottom switch link */}
          <div className="pt-2 text-center text-sm text-[#5B6F60]">
            {mode === 'login' ? (
              <p>
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-[#22482B] hover:underline cursor-pointer"
                >
                  간편 회원가입 (1분)
                </button>
              </p>
            ) : (
              <p>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-[#22482B] hover:underline cursor-pointer"
                >
                  로그인하기
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function LoginPage() {
  const router = useRouter()
  const { success, error } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (loginError) throw loginError

        success('🎉 Login realizado com sucesso!')
        setTimeout(() => router.push('/dashboard'), 500)
        
      } else {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password
        })

        if (signupError) throw signupError

        success('✨ Conta criada com sucesso! Faça login.')
        setMode('login')
      }
    } catch (err: any) {
      error(err.message || 'Erro ao processar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100">
        {/* Bolinhas pequenas suaves - IGUALZINHO À FOTO */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Bolinhas roxas */}
          <div className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60" style={{ top: '10%', left: '15%', animation: 'float-gentle 8s ease-in-out infinite' }} />
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full opacity-50" style={{ top: '20%', left: '80%', animation: 'float-gentle 10s ease-in-out infinite 1s' }} />
          <div className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60" style={{ top: '70%', left: '10%', animation: 'float-gentle 12s ease-in-out infinite 2s' }} />
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full opacity-50" style={{ top: '80%', left: '85%', animation: 'float-gentle 9s ease-in-out infinite 3s' }} />
          
          {/* Bolinhas teal */}
          <div className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60" style={{ top: '15%', left: '70%', animation: 'float-gentle 11s ease-in-out infinite 1s' }} />
          <div className="absolute w-3 h-3 bg-teal-500 rounded-full opacity-50" style={{ top: '30%', left: '20%', animation: 'float-gentle 13s ease-in-out infinite 2s' }} />
          <div className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60" style={{ top: '60%', left: '75%', animation: 'float-gentle 10s ease-in-out infinite 3s' }} />
          <div className="absolute w-3 h-3 bg-teal-500 rounded-full opacity-50" style={{ top: '85%', left: '30%', animation: 'float-gentle 14s ease-in-out infinite 4s' }} />
          
          {/* Bolinhas azuis */}
          <div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60" style={{ top: '25%', left: '50%', animation: 'float-gentle 9s ease-in-out infinite 2s' }} />
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-50" style={{ top: '45%', left: '90%', animation: 'float-gentle 11s ease-in-out infinite 3s' }} />
          <div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60" style={{ top: '65%', left: '40%', animation: 'float-gentle 12s ease-in-out infinite 1s' }} />
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-50" style={{ top: '90%', left: '60%', animation: 'float-gentle 10s ease-in-out infinite 4s' }} />
          
          {/* Mais bolinhas espalhadas */}
          <div className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60" style={{ top: '35%', left: '5%', animation: 'float-gentle 13s ease-in-out infinite' }} />
          <div className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60" style={{ top: '50%', left: '95%', animation: 'float-gentle 11s ease-in-out infinite 2s' }} />
          <div className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-50" style={{ top: '5%', left: '45%', animation: 'float-gentle 14s ease-in-out infinite 1s' }} />
          <div className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-60" style={{ top: '95%', left: '20%', animation: 'float-gentle 10s ease-in-out infinite 3s' }} />
          <div className="absolute w-3 h-3 bg-teal-500 rounded-full opacity-50" style={{ top: '40%', left: '65%', animation: 'float-gentle 12s ease-in-out infinite 4s' }} />
          <div className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-60" style={{ top: '75%', left: '55%', animation: 'float-gentle 9s ease-in-out infinite 2s' }} />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-teal-500" />
                <h1 className="text-4xl font-bold">
                  <span className="text-purple-600">Xp</span>
                  <span className="text-teal-500">lors</span>
                </h1>
              </div>
              <p className="text-gray-600 text-sm">Analisador de documentos com inteligência artificial</p>
            </div>

            {/* Card de Login */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'Faça login para acessar sua conta' 
                    : 'Preencha os dados para começar'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all bg-white text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all bg-white text-gray-800"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Toggle entre Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mode === 'login' ? 'Primeiro acesso?' : 'Já tem conta?'}{' '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    {mode === 'login' ? 'Criar conta' : 'Fazer login'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.6;
          }
          25% {
            transform: translate(10px, -10px);
            opacity: 0.8;
          }
          50% {
            transform: translate(-5px, 5px);
            opacity: 0.4;
          }
          75% {
            transform: translate(5px, 10px);
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  )
}
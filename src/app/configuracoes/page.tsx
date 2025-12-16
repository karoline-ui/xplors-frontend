'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { User, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [user, setUser] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifProcesso, setNotifProcesso] = useState(false)
  const [notifResumo, setNotifResumo] = useState(false)
  
  // Estados para alterar senha
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenhas, setMostrarSenhas] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [loadingNome, setLoadingNome] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setEmail(user.email || '')
      
      // Buscar nome do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single()
      
      if (profile?.nome) {
        setNome(profile.nome)
      } else {
        // Se não tiver nome, usar parte do email
        setNome(user.email?.split('@')[0] || 'Usuário')
      }
    } else {
      router.push('/')
    }
  }

  const handleSalvarNome = async () => {
    if (!nome.trim()) {
      showError('❌ Digite um nome válido')
      return
    }

    setLoadingNome(true)

    try {
      // Verificar se perfil existe
      const { data: profileExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileExists) {
        // Atualizar
        const { error } = await supabase
          .from('profiles')
          .update({ nome: nome.trim() })
          .eq('id', user.id)

        if (error) throw error
      } else {
        // Inserir
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            nome: nome.trim(),
            email: user.email
          })

        if (error) throw error
      }

      success('✅ Nome salvo com sucesso!')
    } catch (err: any) {
      console.error('Erro ao salvar nome:', err)
      showError('❌ Erro ao salvar nome: ' + err.message)
    } finally {
      setLoadingNome(false)
    }
  }

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSenha(true)

    try {
      if (novaSenha.length < 6) {
        throw new Error('A nova senha deve ter no mínimo 6 caracteres')
      }

      if (novaSenha !== confirmarSenha) {
        throw new Error('As senhas não coincidem')
      }

      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      })

      if (error) throw error

      success('🔐 Senha alterada com sucesso!')
      
      setNovaSenha('')
      setConfirmarSenha('')
      
    } catch (err: any) {
      showError(err.message || 'Erro ao alterar senha')
    } finally {
      setLoadingSenha(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
          <p className="text-gray-600 mb-8">Gerencie suas preferências e conta</p>

          {/* Perfil */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Perfil</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
                    placeholder="Seu nome"
                  />
                  <button
                    onClick={handleSalvarNome}
                    disabled={loadingNome}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingNome ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Salvar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Notificações</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Notificações por e-mail</p>
                  <p className="text-sm text-gray-600">Receba atualizações sobre suas análises</p>
                </div>
                <button
                  onClick={() => setNotifEmail(!notifEmail)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifEmail ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifEmail ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Alertas de processamento</p>
                  <p className="text-sm text-gray-600">Seja notificado quando uma análise for concluída</p>
                </div>
                <button
                  onClick={() => setNotifProcesso(!notifProcesso)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifProcesso ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifProcesso ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Resumo semanal</p>
                  <p className="text-sm text-gray-600">Receba um resumo das suas atividades</p>
                </div>
                <button
                  onClick={() => setNotifResumo(!notifResumo)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifResumo ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifResumo ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Segurança - Alterar Senha */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Segurança</h2>
            </div>

            <form onSubmit={handleAlterarSenha} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhas ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhas(!mostrarSenhas)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {mostrarSenhas ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type={mostrarSenhas ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
                  placeholder="Repita a nova senha"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loadingSenha || !novaSenha || !confirmarSenha}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingSenha ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Alterando...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Alterar Senha</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
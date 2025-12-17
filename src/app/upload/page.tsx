'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { Upload as UploadIcon, FileText, X, AlertCircle, Sparkles } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function UploadPage() {
  const router = useRouter()
  const { success, error: showError, info } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string

  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]
      
      if (!validTypes.includes(selectedFile.type)) {
        showError('❌ Tipo de arquivo inválido! Use Excel (.xlsx, .xls) ou CSV.')
        return
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        showError('❌ Arquivo muito grande! Máximo 10MB.')
        return
      }

      setFile(selectedFile)
      info('📄 Arquivo selecionado com sucesso!')
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      showError('⚠️ Selecione um arquivo primeiro!')
      return
    }

    setIsAnalyzing(true)
    info('🤖 Enviando para análise... A IA vai analisar tudo automaticamente!')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        showError('❌ Você precisa estar logado')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('user_id', user.id)

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
  })


      const data = await response.json()

      if (!response.ok) {
        // MUDANÇA: Não expor erro técnico, apenas mensagem amigável
        if (response.status === 429) {
          showError('❌ Arquivo muito grande. Tente com uma planilha menor.')
        } else if (response.status === 500) {
          showError('❌ Erro ao processar arquivo. Tente novamente.')
        } else if (response.status === 400) {
          showError('❌ Arquivo inválido ou corrompido.')
        } else {
          showError('❌ Erro ao analisar. Tente novamente.')
        }
        return
      }

      success('🎉 Análise concluída! PDF completo gerado com sucesso!')
      setFile(null)
      
      setTimeout(() => {
        router.push('/historico')
      }, 1500)
      
    } catch (err: any) {
      // MUDANÇA: NÃO logar erro no console, apenas mensagem amigável
      showError('❌ Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Upload de Documento</h1>
          </div>
          <p className="text-gray-600 mb-8">Faça upload da sua planilha e deixe a IA analisar tudo automaticamente!</p>

          {/* EXPLICAÇÃO LEIGA */}
          <div className="bg-gradient-to-br from-purple-50 to-teal-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-purple-900 mb-3 text-base">🤖 Como funciona:</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">1.</span>
                    <p><strong>Selecione seu arquivo Excel ou CSV</strong> com os dados da sua empresa</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">2.</span>
                    <p><strong>Clique em "Analisar com IA"</strong> e aguarde uns segundos</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">3.</span>
                    <p><strong>Pronto!</strong> A IA vai gerar um relatório completo em PDF</p>
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-4 mb-4">
                  <p className="font-bold text-purple-900 mb-2">✨ O que a IA analisa AUTOMATICAMENTE:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">🎯</span>
                      <p><strong>Concorrência:</strong> Compara preços, identifica competidores</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-teal-600">💰</span>
                      <p><strong>Preços:</strong> Analisa estratégia e margens</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">🏪</span>
                      <p><strong>Merchandising:</strong> Avalia exposição e visibilidade</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600">😊</span>
                      <p><strong>Feedback:</strong> Classifica sentimentos dos clientes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="text-sm">
                    <strong className="text-purple-900">💡 Importante:</strong> A IA identifica AUTOMATICAMENTE o que tem na sua planilha e analisa tudo! 
                    Não precisa escolher tipo de análise. Quanto mais dados, melhor o resultado!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              {file ? (
                <div>
                  <FileText className="w-20 h-20 text-green-600 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-800 mb-2">{file.name}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-green-600 mb-4">
                    ✅ Pronto para análise!
                  </p>
                  <button
                    onClick={() => {
                      setFile(null)
                      info('📄 Arquivo removido')
                    }}
                    className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mx-auto transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Remover arquivo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative inline-block mb-4">
                    <UploadIcon className="w-20 h-20 text-gray-400 mx-auto" />
                    <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-2">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-800 mb-2">
                    Arraste seu arquivo aqui
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    📊 Formatos aceitos: <strong>.xlsx, .xls, .csv</strong> (máximo 10MB)
                  </p>
                  <label className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-xl font-semibold cursor-pointer transition-all hover:shadow-lg hover:scale-105">
                    Selecionar Arquivo
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Botão Analisar */}
          {file && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analisando com IA... Aguarde!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>🚀 Analisar com IA</span>
                </>
              )}
            </button>
          )}

          {/* Info adicional */}
          {file && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>⏱️ A análise leva cerca de 10-30 segundos dependendo do tamanho da planilha</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
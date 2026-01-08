'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { Upload, Store, Camera, AlertCircle, CheckCircle, Loader2, Sparkles, TrendingUp, Eye, Lightbulb } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ToastProvider'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnaliseImagemPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [contexto, setContexto] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setResultado(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateProgress = (step: string, targetProgress: number) => {
    setCurrentStep(step)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= targetProgress) {
          clearInterval(interval)
          return targetProgress
        }
        return prev + 2
      })
    }, 80)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    const file = fileInput?.files?.[0]
    
    if (!file) {
      showError('📸 Tire uma foto do stand primeiro')
      return
    }

    if (!file.type.startsWith('image/')) {
      showError('❌ Apenas imagens são permitidas')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('❌ Imagem muito grande (máx: 10MB)')
      return
    }

    setUploading(true)
    setProgress(0)
    setResultado(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('user_id', user.id)
      formData.append('tipo', 'merchandising')
      if (contexto) {
        formData.append('contexto', contexto)
      }

      // Passo 1: Upload
      simulateProgress('📤 Enviando foto do stand...', 15)
      await new Promise(resolve => setTimeout(resolve, 600))

      // Passo 2: Processando imagem
      simulateProgress('🖼️ Processando imagem...', 30)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Passo 3: Analisando com IA Vision
      simulateProgress('👁️ Analisando organização visual...', 50)
      await new Promise(resolve => setTimeout(resolve, 400))

      // Fazer requisição real
      const response = await axios.post(`${apiUrl}/upload-imagem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Passo 4: Avaliando posicionamento
      simulateProgress('📐 Avaliando posicionamento de produtos...', 70)
      await new Promise(resolve => setTimeout(resolve, 600))

      // Passo 5: Gerando sugestões
      simulateProgress('💡 Gerando sugestões de melhoria...', 90)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Passo 6: Finalizando
      simulateProgress('✨ Finalizando análise profissional...', 98)
      await new Promise(resolve => setTimeout(resolve, 400))

      if (response.data.success) {
        setProgress(100)
        setCurrentStep('✅ Análise completa! Veja as sugestões abaixo.')
        setResultado(response.data)
        
        setTimeout(() => {
          success('🎉 Stand analisado! Confira as sugestões de melhoria.')
        }, 500)
      }

    } catch (err: any) {
      console.error('Erro:', err)
      
      if (err.response?.status === 429) {
        showError('❌ Limite mensal atingido! Verifique seus custos.')
      } else {
        showError('❌ Erro ao analisar stand. Tente novamente.')
      }
    } finally {
      setTimeout(() => {
        setUploading(false)
      }, 1000)
    }
  }

  const limparFormulario = () => {
    setPreviewUrl(null)
    setResultado(null)
    setContexto('')
    setProgress(0)
    setCurrentStep('')
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header com animação */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Store className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Análise de Merchandising
                </h1>
                <p className="text-gray-600">
                  Tire foto do stand e receba sugestões profissionais em segundos
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dicas com animação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-xl p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">
                  📸 Dicas para uma foto perfeita:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Tire de frente, com boa iluminação natural
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Capture todo o stand/display na foto
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Foque nos produtos e organização visual
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Evite pessoas ou obstáculos na frente
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Formulário */}
          <motion.form 
            onSubmit={handleUpload}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            
            {/* Contexto */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Contexto (opcional):
              </label>
              <input
                type="text"
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Ex: Stand de produtos de limpeza no supermercado"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Adicione informações sobre local, tipo de produto, promoções, etc.
              </p>
            </motion.div>

            {/* Upload Area */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label 
                htmlFor="file-input"
                className={`
                  flex flex-col items-center justify-center w-full h-80 
                  border-2 border-dashed rounded-2xl cursor-pointer 
                  transition-all duration-300
                  ${previewUrl 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-purple-300 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-400'
                  }
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {previewUrl ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full h-full p-4"
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview do stand" 
                      className="max-w-full max-h-full mx-auto object-contain rounded-xl shadow-lg"
                    />
                    {!uploading && (
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all rounded-xl flex items-center justify-center">
                        <p className="text-white font-semibold opacity-0 hover:opacity-100 transition-opacity">
                          Clique para trocar
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="text-center"
                  >
                    <Store className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <p className="text-xl font-bold text-purple-700 mb-2">
                      Clique para adicionar foto do stand
                    </p>
                    <p className="text-sm text-purple-600 mb-4">
                      ou arraste a imagem aqui
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">
                        PNG, JPG (máx: 10MB)
                      </span>
                    </div>
                  </motion.div>
                )}
                
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </motion.div>

            {/* Progress Bar com animação */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                        <span className="text-sm font-semibold text-gray-800">
                          {currentStep}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-purple-600 bg-white px-3 py-1 rounded-full">
                        {progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </motion.div>
                    </div>
                    
                    <p className="text-xs text-center text-gray-600 mt-3">
                      🤖 Analisando com Inteligência Artificial Vision...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                whileTap={{ scale: uploading ? 1 : 0.98 }}
                type="submit"
                disabled={uploading || !previewUrl}
                className="
                  flex-1 bg-gradient-to-r from-purple-600 to-teal-500 
                  text-white py-4 rounded-xl font-bold text-lg 
                  hover:shadow-xl transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2
                "
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando Stand...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Analisar e Receber Sugestões
                  </>
                )}
              </motion.button>

              {previewUrl && !uploading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={limparFormulario}
                  className="
                    px-6 py-4 bg-gray-200 text-gray-700 rounded-xl 
                    font-semibold hover:bg-gray-300 transition-all duration-300
                  "
                >
                  Limpar
                </motion.button>
              )}
            </div>
          </motion.form>

          {/* Resultado com animação */}
          <AnimatePresence>
            {resultado && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header do Resultado */}
                <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          Análise Completa! 🎉
                        </h3>
                        <p className="text-purple-100 text-sm">
                          Sugestões profissionais para seu stand
                        </p>
                      </div>
                    </div>
                    <div className="text-right bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <span className="text-xs">Custo:</span>
                      <p className="text-lg font-bold">
                        ${resultado.custo_usd.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Análise */}
                <div className="p-8">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-inner">
                      {resultado.analise}
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.print()}
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <span>📄</span>
                      Imprimir Relatório
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={limparFormulario}
                      className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Analisar Outro Stand
                    </motion.button>
                  </div>

                  {/* Limite Status */}
                  {resultado.limite_status && resultado.limite_status.alerta && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          ⚠️ Você está em {resultado.limite_status.percentual.toFixed(1)}% 
                          do seu limite mensal. Considere verificar seus gastos em <strong>/custos</strong>.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards (quando não tem resultado) */}
          {!resultado && !uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-purple-100">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Análise Visual</h4>
                <p className="text-xs text-gray-600">
                  Avaliação profissional da organização
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-teal-100">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Visibilidade</h4>
                <p className="text-xs text-gray-600">
                  Pontos fortes e fracos identificados
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Sugestões</h4>
                <p className="text-xs text-gray-600">
                  Melhorias práticas priorizadas
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-pink-100">
                <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Impacto</h4>
                <p className="text-xs text-gray-600">
                  Estimativa de aumento nas vendas
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
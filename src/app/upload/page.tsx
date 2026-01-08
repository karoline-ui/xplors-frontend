'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ToastProvider'
import { motion, AnimatePresence } from 'framer-motion'

export default function UploadPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resultado, setResultado] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResultado(null)
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
    }, 100)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      showError('Selecione um arquivo primeiro')
      return
    }

    // Validar tipo
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!validTypes.includes(selectedFile.type)) {
      showError('Apenas arquivos Excel (.xlsx, .xls) ou CSV')
      return
    }

    // Validar tamanho (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showError('Arquivo muito grande (máx: 10MB)')
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
      formData.append('file', selectedFile)
      formData.append('user_id', user.id)

      // Passo 1: Upload
      simulateProgress('📤 Enviando arquivo...', 20)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Passo 2: Lendo dados
      simulateProgress('📊 Lendo dados da planilha...', 40)
      await new Promise(resolve => setTimeout(resolve, 600))

      // Passo 3: Analisando com IA
      simulateProgress('🤖 Analisando com Inteligência Artificial...', 60)

      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Passo 4: Gerando gráficos
      simulateProgress('📈 Gerando gráficos e visualizações...', 80)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Passo 5: Finalizando
      simulateProgress('✨ Finalizando relatório...', 95)
      await new Promise(resolve => setTimeout(resolve, 500))

      if (response.data.success) {
        setProgress(100)
        setCurrentStep('✅ Análise concluída com sucesso!')
        setResultado(response.data)
        
        setTimeout(() => {
          success('🎉 Análise concluída! PDF gerado com sucesso.')
        }, 500)
      }

    } catch (err: any) {
      console.error('Erro:', err)
      
      if (err.response?.status === 429) {
        showError('❌ Limite mensal atingido! Verifique seus custos.')
      } else {
        showError('❌ Erro ao processar arquivo. Tente novamente.')
      }
    } finally {
      setTimeout(() => {
        setUploading(false)
      }, 1000)
    }
  }

  const limparFormulario = () => {
    setSelectedFile(null)
    setResultado(null)
    setProgress(0)
    setCurrentStep('')
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header com animação */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-8 h-8 text-purple-600" />
              Upload de Planilha
            </h1>
            <p className="text-gray-600">
              Envie sua planilha e receba análise profissional com gráficos em segundos
            </p>
          </motion.div>

          {/* Formulário */}
          <motion.form 
            onSubmit={handleUpload}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            
            {/* Upload Area */}
            <div className="mb-6">
              <label 
                htmlFor="file-input"
                className={`
                  flex flex-col items-center justify-center w-full h-64 
                  border-2 border-dashed rounded-xl cursor-pointer 
                  transition-all duration-300
                  ${selectedFile 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-purple-300'
                  }
                `}
              >
                {selectedFile ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-purple-700 mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-purple-600 mt-3">
                      Clique para trocar o arquivo
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="text-center"
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Clique ou arraste seu arquivo aqui
                    </p>
                    <p className="text-sm text-gray-500">
                      Excel (.xlsx, .xls) ou CSV (máx: 10MB)
                    </p>
                  </motion.div>
                )}
                
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Progress Bar com animação */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {currentStep}
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 to-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center mt-4">
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin mr-2" />
                      <span className="text-sm text-gray-600">
                        Processando... Isso pode levar alguns segundos
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading || !selectedFile}
                className="
                  flex-1 bg-gradient-to-r from-purple-600 to-teal-500 
                  text-white py-4 rounded-xl font-bold text-lg 
                  hover:shadow-lg transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2
                "
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analisar com IA
                  </>
                )}
              </motion.button>

              {selectedFile && !uploading && (
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Análise Concluída! 🎉
                      </h3>
                      <p className="text-sm text-gray-600">
                        {resultado.total_linhas.toLocaleString()} linhas analisadas
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-600">Custo:</span>
                    <p className="text-lg font-bold text-purple-600">
                      ${resultado.custo_usd?.toFixed(4) || '0.0000'}
                    </p>
                  </div>
                </div>

                {/* Card de Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-600 mb-1">Tipo</p>
                    <p className="font-bold text-gray-800">
                      {resultado.tipo_analise}
                    </p>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-xl">
                    <p className="text-sm text-teal-600 mb-1">Linhas</p>
                    <p className="font-bold text-gray-800">
                      {resultado.total_linhas.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 mb-1">Status</p>
                    <p className="font-bold text-green-600">
                      ✓ Completo
                    </p>
                  </div>
                </div>

                {/* Botão de Download */}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={resultado.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full block text-center bg-gradient-to-r 
                    from-green-600 to-teal-600 text-white py-4 
                    rounded-xl font-bold text-lg hover:shadow-lg 
                    transition-all duration-300
                  "
                >
                  📥 Baixar Relatório PDF com Gráficos
                </motion.a>

                {/* Limite Status */}
                {resultado.limite_status && resultado.limite_status.alerta && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        ⚠️ Você está em {resultado.limite_status.percentual.toFixed(1)}% 
                        do seu limite mensal
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Botão Nova Análise */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={limparFormulario}
                  className="
                    w-full mt-4 py-3 border-2 border-purple-600 
                    text-purple-600 rounded-xl font-semibold 
                    hover:bg-purple-50 transition-all duration-300
                  "
                >
                  📊 Fazer Nova Análise
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          {!resultado && !uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Análise Completa</h4>
                <p className="text-sm text-gray-600">
                  Insights profissionais com IA em segundos
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Gráficos Automáticos</h4>
                <p className="text-sm text-gray-600">
                  3 gráficos gerados automaticamente no PDF
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">PDF Profissional</h4>
                <p className="text-sm text-gray-600">
                  Relatório completo pronto para apresentar
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
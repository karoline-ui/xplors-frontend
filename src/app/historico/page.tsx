'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { Search, Calendar, Filter, Download, Trash2, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HistoricoPage() {
  const [analises, setAnalises] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Carregar IMEDIATAMENTE, verificar auth depois
    carregarHistorico()
  }, [])

  const carregarHistorico = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/')
        return
      }

      // Buscar análises
      const { data, error } = await supabase
        .from('analises')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setAnalises(data || [])
    } catch (error: any) {
      console.error('Erro:', error)
    }
  }

  const baixarPDF = async (pdfUrl: string, filename: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Você precisa estar logado')
        return
      }

      const urlParts = pdfUrl.split('/relatorios-pdf/')
      if (urlParts.length < 2) {
        alert('URL do PDF inválida')
        return
      }
      
      const filePath = urlParts[1]
      
      const { data, error } = await supabase.storage
        .from('relatorios-pdf')
        .createSignedUrl(filePath, 60)

      if (error) throw error
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      } else {
        alert('Não foi possível gerar link de download')
      }
    } catch (error: any) {
      console.error('Erro ao baixar PDF:', error)
      alert(`Erro ao baixar PDF: ${error.message}`)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoIcon = (tipo: string) => {
    const icons: any = {
      'concorrencia': '🎯',
      'merchandising': '🏪',
      'preco': '💰'
    }
    return icons[tipo] || '📊'
  }

  const getTipoNome = (tipo: string) => {
    const nomes: any = {
      'concorrencia': 'Concorrência',
      'merchandising': 'Merchandising',
      'preco': 'Preços'
    }
    return nomes[tipo] || tipo
  }

  const filteredAnalises = analises.filter(analise => 
    analise.nome_arquivo_original?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTipoNome(analise.tipo_analise).toLowerCase().includes(searchTerm.toLowerCase())
  )

  // RENDERIZAR SEMPRE! Sem tela branca
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Histórico</h1>
          <p className="text-gray-600 mb-8">Todos os seus documentos analisados</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Total de Relatórios</p>
              <p className="text-3xl font-bold text-gray-800">{analises.length}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Espaço Utilizado</p>
              <p className="text-3xl font-bold text-gray-800">13.8 MB</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Último Upload</p>
              <p className="text-3xl font-bold text-gray-800">Hoje</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5" />
              Data
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Tabela */}
          {filteredAnalises.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Nenhuma análise ainda
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Nenhum resultado encontrado para sua busca' : 'Faça upload de uma planilha para começar'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/upload')}
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  ⬆️ Nova Análise
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Arquivo Original
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAnalises.map((analise) => (
                    <tr key={analise.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                            {getTipoIcon(analise.tipo_analise)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {getTipoNome(analise.tipo_analise)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {analise.total_linhas} linhas
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {analise.nome_arquivo_original || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatarData(analise.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => baixarPDF(analise.pdf_url, analise.pdf_filename)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                            title="Baixar PDF"
                          >
                            <Download className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => baixarPDF(analise.pdf_url, analise.pdf_filename)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Visualizar"
                          >
                            <ExternalLink className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Excluir">
                            <Trash2 className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
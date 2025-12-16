const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function uploadArquivo(file: File, token: string) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao fazer upload')
  }

  return response.json()
}

export async function buscarHistorico(token: string) {
  const response = await fetch(`${API_URL}/historico`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar histórico')
  }

  return response.json()
}

export async function buscarDashboard(token: string) {
  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar dados do dashboard')
  }

  return response.json()
}

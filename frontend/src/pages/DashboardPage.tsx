import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { BarChart, Users, Shop, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { name: 'Total de Clientes', value: '0', icon: Users, color: 'bg-blue-500' },
    { name: 'Lojas Ativas', value: '0', icon: Shop, color: 'bg-green-500' },
    { name: 'Pedidos Hoje', value: '0', icon: BarChart, color: 'bg-purple-500' },
    { name: 'Receita Mensal', value: 'R$ 0,00', icon: DollarSign, color: 'bg-yellow-500' },
  ]

  return (
    <DashboardLayout>
      <div className="px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo(a), {user?.name || 'Usuário'}! Aqui está o resumo do seu sistema.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              Nenhuma atividade recente para exibir.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

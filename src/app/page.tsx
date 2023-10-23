'use client'
import Layout from '../components/Layout'
import Tabela from '../components/Tabela'
import Cliente from '../core/Cliente'
import Botao from '../components/Botao'
import Formulario from '../components/Formulario'
import { useEffect, useState } from 'react'
import ClienteRepositorio from '@/core/ClienteRepositorio'
import ColecaoCliente from '@/backend/db/ColecaoCliente'

export default function Home() {

  const [cliente, setCliente] = useState<Cliente>(Cliente.vazio())
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [visivel, setVisivel] = useState<'tabela' | 'form'>('tabela')
  const repo: ClienteRepositorio = new ColecaoCliente()

  const clienteSelecionado = (cliente: Cliente) => {
    setCliente(cliente)
    setVisivel('form')
  }

  const novoCliente = () => {
    setCliente(Cliente.vazio())
    setVisivel('form')
  }
  
  const obterTodos = () => {
    repo.obterTodos().then(clientes => {
      setClientes(clientes)
      setVisivel('tabela')
    })
  }
    
  useEffect(obterTodos, [])

  const salvarCliente = async (cliente: Cliente) => {
    await repo.salvar(cliente)
    obterTodos()
  }
  
  const clienteExcluido = async (cliente: Cliente) => {
    await repo.excluir(cliente)
    obterTodos()
  }
  
  return (
    <div className={`
      flex h-screen justify-center items-center 
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white
    `}>
      <Layout titulo="Cadastro Simples">
        {visivel === 'tabela' ? (
          <>
            <div className="flex justify-end">
              <Botao className='mb-5' onClick={novoCliente}>Novo Cliente</Botao>
            </div>
            <Tabela clientes={clientes} clienteSelecionado={clienteSelecionado}
              clienteExcluido={clienteExcluido}></Tabela>
          </>
        ) : (
          <Formulario cliente={cliente} cancelado={() => setVisivel('tabela')}
            clienteMudou={salvarCliente} />
        )}
      </Layout>
    </div>
  )
}

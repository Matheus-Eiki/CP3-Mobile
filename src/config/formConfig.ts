import type { FormConfig } from '../types/form';

const formConfig: FormConfig = {
  title: 'Cadastro de Usuário',
  description: 'Preencha os campos abaixo. Os campos com * são obrigatórios.',
  fields: [
    { id: 'name', label: 'Nome completo', type: 'text', required: true, placeholder: 'Digite seu nome' },
    { id: 'email', label: 'E-mail', type: 'email', required: true, placeholder: 'voce@exemplo.com' },
    { id: 'password', label: 'Senha', type: 'password', required: true, placeholder: 'Mínimo de 6 caracteres' },
    { id: 'age', label: 'Idade', type: 'number', required: true, placeholder: 'Ex.: 20' },
    { id: 'about', label: 'Sobre você', type: 'multiline', required: false, placeholder: 'Escreva algumas informações...' },
    {
      id: 'state',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { label: 'São Paulo', value: 'SP' },
        { label: 'Rio de Janeiro', value: 'RJ' },
        { label: 'Minas Gerais', value: 'MG' },
        { label: 'Paraná', value: 'PR' }
      ]
    },
    {
      id: 'gender',
      label: 'Gênero',
      type: 'radio',
      required: true,
      options: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
        { label: 'Prefiro não informar', value: 'not_informed' }
      ]
    },
    { id: 'terms', label: 'Aceito os termos de uso', type: 'checkbox', required: true },
    { id: 'newsletter', label: 'Quero receber novidades por e-mail', type: 'switch', required: false },
    { id: 'birthDate', label: 'Data de nascimento (AAAA-MM-DD)', type: 'date', required: true, placeholder: '2000-12-31' }
  ]
};

export default formConfig;

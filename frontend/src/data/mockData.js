// src/data/mockData.js
export let mockUsers = localStorage.getItem('mockUsers')
  ? JSON.parse(localStorage.getItem('mockUsers'))
  : [
      { id: 1, login: 'client1', password: '123', full_name: 'Иванов Иван Иванович', role: 'client', email: 'client@mail.ru' },
      { id: 2, login: 'emp1', password: '123', full_name: 'Петров Пётр Петрович', role: 'employee', email: 'emp@mail.ru' },
      { id: 3, login: 'admin', password: 'admin', full_name: 'Администратор Системы', role: 'admin', email: 'admin@bank.ru' }
    ];

export let mockClients = localStorage.getItem('mockClients')
  ? JSON.parse(localStorage.getItem('mockClients'))
  : [
      { id_client: 1, login: 'client1', full_name: 'Иванов Иван Иванович', email: 'client@mail.ru', created_at: '2025-01-01' },
      { id_client: 2, login: 'client2', full_name: 'Сидорова Анна Сергеевна', email: 'anna@mail.ru', created_at: '2025-02-15' }
    ];

export let mockAccounts = localStorage.getItem('mockAccounts')
  ? JSON.parse(localStorage.getItem('mockAccounts'))
  : [
      { id_account: 1, id_client: 1, account_number: '40817810000000000001', balance: 50000.00, currency_code: 'RUB', is_blocked: false },
      { id_account: 2, id_client: 1, account_number: '40817810000000000002', balance: 120000.50, currency_code: 'RUB', is_blocked: false },
      { id_account: 3, id_client: 2, account_number: '40817810000000000003', balance: 8000.00, currency_code: 'USD', is_blocked: false }
    ];

export let mockTransactions = localStorage.getItem('mockTransactions')
  ? JSON.parse(localStorage.getItem('mockTransactions'))
  : [
      { id_transaction: 1, sender_account_id: 1, receiver_account_id: 2, amount: 10000, description: 'Перевод самому себе', created_at: '2025-12-01 10:30:00', status_code: 'completed' },
      { id_transaction: 2, sender_account_id: 1, amount: 5000, description: 'Пополнение через банкомат', created_at: '2025-12-10 14:20:00', status_code: 'completed' },
      { id_transaction: 3, sender_account_id: 2, amount: 20000, description: 'Снятие наличных', created_at: '2025-12-20 09:15:00', status_code: 'completed' }
    ];

export let mockProducts = localStorage.getItem('mockProducts')
  ? JSON.parse(localStorage.getItem('mockProducts'))
  : [
      { id_product: 1, name: 'Депозит "Надёжный"', interest_rate: 7.5, term_months: 12, min_amount: 10000, currency_code: 'RUB' },
      { id_product: 2, name: 'Кредит "Потребительский"', interest_rate: 15.0, term_months: 36, max_amount: 500000, currency_code: 'RUB' }
    ];

export let mockCreditApplications = localStorage.getItem('mockCreditApplications')
  ? JSON.parse(localStorage.getItem('mockCreditApplications'))
  : [
      {
        id: 1,
        client_id: 1,
        client_name: 'Иванов Иван Иванович',
        amount: 300000,
        term_months: 36,
        product_type: 'кредит',
        status: 'pending'
      }
    ];

export let mockCredits = localStorage.getItem('mockCredits')
  ? JSON.parse(localStorage.getItem('mockCredits'))
  : [];

export function saveData() {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  localStorage.setItem('mockClients', JSON.stringify(mockClients));
  localStorage.setItem('mockAccounts', JSON.stringify(mockAccounts));
  localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
  localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
  localStorage.setItem('mockCreditApplications', JSON.stringify(mockCreditApplications));
  localStorage.setItem('mockCredits', JSON.stringify(mockCredits));
}
// src/data/mockData.js
export let mockUsers = localStorage.getItem('mockUsers')
  ? JSON.parse(localStorage.getItem('mockUsers'))
  : [
      {
        id: 1,
        login: 'client1',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 от '123'
        full_name: 'Иванов Иван Иванович',
        role: 'client',
        email: 'client@mail.ru'
      },
      {
        id: 2,
        login: 'emp1',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 от '123'
        full_name: 'Петров Пётр Петрович',
        role: 'employee',
        email: 'emp@mail.ru'
      },
      {
        id: 3,
        login: 'admin',
        password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA256 от 'admin'
        full_name: 'Администратор Системы',
        role: 'admin',
        email: 'admin@bank.ru'
      },
      {
        id: 4,
        login: 'client2',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 от '123'
        full_name: 'Сидорова Анна Сергеевна',
        role: 'client',
        email: 'anna@mail.ru'
      }
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
      { id_account: 3, id_client: 2, account_number: '40817810000000000003', balance: 8000.00, currency_code: 'USD', is_blocked: false },
      { id_account: 4, id_client: 2, account_number: '40817810000000000004', balance: 75000.00, currency_code: 'RUB', is_blocked: false }
    ];

export let mockTransactions = localStorage.getItem('mockTransactions')
  ? JSON.parse(localStorage.getItem('mockTransactions'))
  : [
      { id_transaction: 1, sender_account_id: 1, receiver_account_id: 2, amount: 10000, description: 'Перевод самому себе', created_at: '2025-12-01 10:30:00', status_code: 'completed' },
      { id_transaction: 2, sender_account_id: 1, amount: 5000, description: 'Пополнение через банкомат', created_at: '2025-12-10 14:20:00', status_code: 'completed' },
      { id_transaction: 3, sender_account_id: 2, amount: 20000, description: 'Снятие наличных', created_at: '2025-12-20 09:15:00', status_code: 'completed' },
      { id_transaction: 4, sender_account_id: 3, receiver_account_id: 4, amount: 1000, description: 'Перевод внутри клиента 2', created_at: '2025-12-25 15:00:00', status_code: 'completed' }
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
      },
      {
        id: 2,
        client_id: 2,
        client_name: 'Сидорова Анна Сергеевна',
        amount: 200000,
        term_months: 24,
        product_type: 'кредит',
        status: 'pending'
      }
    ];

export let mockCredits = localStorage.getItem('mockCredits')
  ? JSON.parse(localStorage.getItem('mockCredits'))
  : [];

export let mockCards = localStorage.getItem('mockCards')
  ? JSON.parse(localStorage.getItem('mockCards'))
  : [
      { id_card: 1, id_client: 1, card_number: '1234 5678 9012 3456', card_type: 'Visa Gold', expiry_date: '12/28', status: 'active' },
      { id_card: 2, id_client: 1, card_number: '9876 5432 1098 7654', card_type: 'Mastercard Standard', expiry_date: '06/27', status: 'active' },
      { id_card: 3, id_client: 2, card_number: '1111 2222 3333 4444', card_type: 'Visa Classic', expiry_date: '12/29', status: 'active' },
      { id_card: 4, id_client: 2, card_number: '5555 6666 7777 8888', card_type: 'Mastercard Platinum', expiry_date: '03/28', status: 'active' }
    ];

export let mockDeposits = localStorage.getItem('mockDeposits')
  ? JSON.parse(localStorage.getItem('mockDeposits'))
  : []; // Будет заполняться при одобрении заявки на депозит

export let mockInterestPayments = localStorage.getItem('mockInterestPayments')
  ? JSON.parse(localStorage.getItem('mockInterestPayments'))
  : []; // Начисленные проценты

// Обнови функцию saveData()
export function saveData() {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  localStorage.setItem('mockClients', JSON.stringify(mockClients));
  localStorage.setItem('mockAccounts', JSON.stringify(mockAccounts));
  localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
  localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
  localStorage.setItem('mockCreditApplications', JSON.stringify(mockCreditApplications));
  localStorage.setItem('mockCredits', JSON.stringify(mockCredits));
  localStorage.setItem('mockCards', JSON.stringify(mockCards));
  localStorage.setItem('mockDeposits', JSON.stringify(mockDeposits));
  localStorage.setItem('mockInterestPayments', JSON.stringify(mockInterestPayments));
}
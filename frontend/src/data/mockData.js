export const mockUsers = [
  { id: 1, login: 'client1', password: '123', full_name: 'Иванов Иван Иванович', role: 'client', email: 'client@mail.ru' },
  { id: 2, login: 'emp1', password: '123', full_name: 'Петров Пётр Петрович', role: 'employee', email: 'emp@mail.ru' },
  { id: 3, login: 'admin', password: 'admin', full_name: 'Администратор Системы', role: 'admin', email: 'admin@bank.ru' }
];

export const mockClients = [
  { id_client: 1, login: 'client1', full_name: 'Иванов Иван Иванович', email: 'client@mail.ru', created_at: '2025-01-01' },
  { id_client: 2, login: 'client2', full_name: 'Сидорова Анна Сергеевна', email: 'anna@mail.ru', created_at: '2025-02-15' }
];

export const mockAccounts = [
  { id_account: 1, id_client: 1, account_number: '40817810000000000001', balance: 50000.00, currency_code: 'RUB', is_blocked: false },
  { id_account: 2, id_client: 1, account_number: '40817810000000000002', balance: 120000.50, currency_code: 'RUB', is_blocked: false },
  { id_account: 3, id_client: 2, account_number: '40817810000000000003', balance: 8000.00, currency_code: 'USD', is_blocked: false }
];

export const mockTransactions = [
  { id_transaction: 1, sender_account_id: 1, receiver_account_id: 2, amount: 10000, description: 'Перевод самому себе', created_at: '2025-12-01 10:30:00', status_code: 'completed' },
  { id_transaction: 2, sender_account_id: 1, amount: 5000, description: 'Пополнение через банкомат', created_at: '2025-12-10 14:20:00', status_code: 'completed' },
  { id_transaction: 3, sender_account_id: 2, amount: 20000, description: 'Снятие наличных', created_at: '2025-12-20 09:15:00', status_code: 'completed' }
];

export const mockProducts = [
  { id_product: 1, name: 'Депозит "Надёжный"', interest_rate: 7.5, term_months: 12, min_amount: 10000, currency_code: 'RUB' },
  { id_product: 2, name: 'Кредит "Потребительский"', interest_rate: 15.0, term_months: 36, max_amount: 500000, currency_code: 'RUB' }
];

export const mockContracts = [
  { id_contract: 1, id_client: 1, id_product: 1, id_account: 1, amount: 50000, start_date: '2025-06-01', status: 'active' }
];
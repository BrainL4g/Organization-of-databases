// src/pages/Clients/ClientList.js
import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { mockClients } from '../../data/mockData';

const ClientList = () => {
  const [clients] = useState(mockClients);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Мок: просто закрываем
    setShowDeleteModal(false);
    alert(`Клиент ${clientToDelete.full_name} удалён (мок)`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Справочник клиентов</h2>
        <Button>Добавить клиента</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ФИО</th>
            <th>Логин</th>
            <th>Email</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id_client}>
              <td>{client.full_name}</td>
              <td>{client.login}</td>
              <td>{client.email}</td>
              <td>{new Date(client.created_at).toLocaleDateString()}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">Ред.</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(client)}>Уд.</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Удалить клиента {clientToDelete?.full_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Отмена</Button>
          <Button variant="danger" onClick={confirmDelete}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClientList;
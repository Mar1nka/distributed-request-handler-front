import { useEffect, useState } from 'react'
import { Button, Snackbar, Alert } from '@mui/material';
import io from 'socket.io-client';

import './App.css'
import ResourcesTable from './components/ResourcesTable.tsx';
import CreateResourceModal from './components/CreateResourceModal.tsx';
import { createResource, fetchResources } from './api';

export interface Resource {
  id: string;
  url: string;
  status: string;
  httpCode: string | null;
}

interface ResourcesResponse {
  total: number;
  page: number;
  limit: number;
  data: Resource[]
}

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

function App() {
  const apiUrl: string = import.meta.env.VITE_API_URL;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setOpenSnackbar(true);
  };

  function handleOpenModal() {
    setIsOpenModal(true);
  }

  function handleCloseModal() {
    setIsOpenModal(false);
  }

  async function handleSubmitForm(url: string) {
    try {
      await createResource(url, apiUrl);

      showSnackbar('Resource created successfully!', 'success');

      if (page === 0) {
        await fetchResourcesData();
      } else {
        setPage(0);
      }
    } catch (error) {
      console.error('Failed to create resource:', error);
      showSnackbar('Failed to create resource.', 'error');
    }
  }

  async function fetchResourcesData() {
    setLoading(true);

    try {
      const resourcesResponse: ResourcesResponse = await fetchResources(page, pageSize, apiUrl);
      setResources(resourcesResponse.data);
      setPage(resourcesResponse.page - 1);
      setTotal(resourcesResponse.total);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResourcesData();
  }, [page, pageSize]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('resource.update', (data) => {
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.id === data.id ? data : resource
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="main">
      <h1>Distributed request handler</h1>
      <Button className="create-button" onClick={handleOpenModal} variant="contained">Create</Button>
      <CreateResourceModal isOpen={isOpenModal} handleClose={handleCloseModal} handleSubmitForm={handleSubmitForm}/>
      <ResourcesTable
        resources={resources}
        page={page}
        pageSize={pageSize}
        total={total}
        loading={loading}
        setPage={setPage}
        setPageSize={setPageSize}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default App

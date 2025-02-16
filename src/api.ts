export const createResource = async (url: string, apiUrl: string) => {
  const response = await fetch(`${apiUrl}/api/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to create resource');
  }

  return response.json();
};

export const fetchResources = async (page: number, pageSize: number, apiUrl: string) => {
  const response = await fetch(`${apiUrl}/api/resources?page=${page + 1}&limit=${pageSize}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

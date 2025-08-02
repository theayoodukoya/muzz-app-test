import { http, HttpResponse } from 'msw';

const mockUsers = [
  {
    id: 1,
    name: 'Alisha',
    profile: 'https://randomuser.me/api/portraits/women/89.jpg',
  },
  {
    id: 2,
    name: 'John',
    profile: 'https://randomuser.me/api/portraits/men/38.jpg',
  },
  {
    id: 3,
    name: 'Maddie',
    profile: 'https://randomuser.me/api/portraits/women/88.jpg',
  },
];

export const handlers = [
  // Mock API endpoints
  http.get('/api/user/all.json', () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get('/api/user/:id.json', ({ params }) => {
    const id = Number.parseInt(params.id as string);
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // Mock message endpoints
  http.post('/api/messages', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      timestamp: new Date().toISOString(),
    });
  }),
];

const { beforeAll, test, expect } = require('@jest/globals');

const request = require('supertest');
const app = require('../src/service');
const { DB } = require('../src/database/database.js');
const { Role } = require('../src/model/model.js');

async function createAdminUser() {
	const timestamp = Date.now();
	let user = { 
	  password: 'toomanysecrets',
	  roles: [{ role: Role.Admin }],
	  name: `admin-test-${timestamp}`,
	  email: `admin-${timestamp}@test.com`
	};
	
	await DB.addUser(user);
	user.password = 'toomanysecrets';

	return user;
  }
  
  

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserAuthToken;

let adminUser;
let adminAuthToken;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;

  adminUser = await createAdminUser();
  const adminLoginRes = await request(app)
    .put('/api/auth')
    .send({ email: adminUser.email, password: adminUser.password });
  adminAuthToken = adminLoginRes.body.token;
});

test('Get menu (public access)', async () => {
  const response = await request(app).get('/api/order/menu');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

test('Add menu item (admin only)', async () => {
  const menuItem = {
    title: 'Test Pizza',
    description: 'A test pizza',
    image: 'test.png',
    price: 0.0001
  };

  const response = await request(app)
    .put('/api/order/menu')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send(menuItem);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.some(item => item.title === menuItem.title)).toBe(true);
});

test('Add menu item fails without admin auth', async () => {
  const menuItem = {
    title: 'Test Pizza',
    description: 'A test pizza',
    image: 'test.png',
    price: 0.0001
  };

  const response = await request(app)
    .put('/api/order/menu')
    .set('Authorization', `Bearer ${testUserAuthToken}`)
    .send(menuItem);

  expect(response.status).toBe(403);
});

test('Get orders (authenticated user)', async () => {
  const response = await request(app)
    .get('/api/order')
    .set('Authorization', `Bearer ${testUserAuthToken}`);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('dinerId');
  expect(response.body).toHaveProperty('orders');
  expect(Array.isArray(response.body.orders)).toBe(true);
});

test('Create order (authenticated user)', async () => {
  const order = {
    franchiseId: 1,
    storeId: 1,
    items: [
      {
        menuId: 1,
        description: 'Test Pizza',
        price: 0.0001
      }
    ]
  };

  const response = await request(app)
    .post('/api/order')
    .set('Authorization', `Bearer ${testUserAuthToken}`)
    .send(order);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('order');
  expect(response.body.order).toHaveProperty('id');
  expect(response.body).toHaveProperty('jwt');
});

test('Get orders fails without auth', async () => {
  const response = await request(app).get('/api/order');
  expect(response.status).toBe(401);
});

test('Create order fails without auth', async () => {
  const order = {
    franchiseId: 1,
    storeId: 1,
    items: [
      {
        menuId: 1,
        description: 'Test Pizza',
        price: 0.0001
      }
    ]
  };

  const response = await request(app)
    .post('/api/order')
    .send(order);

  expect(response.status).toBe(401);
});
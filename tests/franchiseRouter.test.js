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
let testUserId;

let adminUser;
let adminAuthToken;
let createdFranchiseId;

beforeAll(async () => {
	testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
	const registerRes = await request(app).post('/api/auth').send(testUser);
	testUserAuthToken = registerRes.body.token;
	testUserId = registerRes.body.user.id;

	adminUser = await createAdminUser();
	const adminLoginRes = await request(app)
	.put('/api/auth')
	.send({ email: adminUser.email, password: adminUser.password });
	adminAuthToken = adminLoginRes.body.token;
});

test('list all the franchises', async () => {
	const response = await request(app).get('/api/franchise');
	expect(response.status).toBe(200);
});

test('View user franchises', async () => {
	const response = (await request(app).get(`/api/franchise/${testUserId}`).set('Authorization', `Bearer ${testUserAuthToken}`));
	expect(response.status).toBe(200);
	expect(response.body).toBeInstanceOf(Array);
	expect(response.body.length).toEqual(0);
});

test('Create a new franchise', async () => {
  const timestamp = Date.now();
  const response = await request(app)
    .post('/api/franchise')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send({
      name: `test franchise ${timestamp}`,
      description: 'test description',
      admins: [{ email: testUser.email }]
    });
  
  expect(response.status).toBe(200);
  expect(response.body.admins.some(a => a.email === testUser.email)).toBe(true);
  createdFranchiseId = response.body.id;
});

test('Create franchise fails without admin auth', async () => {
  const response = await request(app)
    .post('/api/franchise')
    .set('Authorization', `Bearer ${testUserAuthToken}`)
    .send({
      name: 'test franchise',
      description: 'test description',
      admins: [{ email: testUser.email }]
    });
  expect(response.status).toBe(403);
});

test('Create franchise fails with invalid admin email', async () => {
  const response = await request(app)
    .post('/api/franchise')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send({
      name: 'test franchise',
      description: 'test description',
      admins: [{ email: 'nonexistent@email.com' }]
    });
  expect(response.status).toBe(404);
});

test('Create store in franchise', async () => {
  const response = await request(app)
    .post(`/api/franchise/${createdFranchiseId}/store`)
    .set('Authorization', `Bearer ${testUserAuthToken}`)
    .send({
      name: 'Test Store Location'
    });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe('Test Store Location');
});

test('Create store fails with invalid franchise id', async () => {
  const response = await request(app)
    .post('/api/franchise/999999/store')
    .set('Authorization', `Bearer ${testUserAuthToken}`)
    .send({
      name: 'Test Store Location'
    });
  expect(response.status).toBe(403);
});

test('Create store fails without auth', async () => {
  const response = await request(app)
    .post(`/api/franchise/${createdFranchiseId}/store`)
    .send({
      name: 'Test Store Location'
    });
  expect(response.status).toBe(401);
});

test('Delete franchise fails without admin auth', async () => {
  const response = await request(app)
    .delete(`/api/franchise/${createdFranchiseId}`)
    .set('Authorization', `Bearer ${testUserAuthToken}`);
  expect(response.status).toBe(403);
});

test('Delete franchise succeeds with admin auth', async () => {
  const response = await request(app)
    .delete(`/api/franchise/${createdFranchiseId}`)
    .set('Authorization', `Bearer ${adminAuthToken}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('franchise deleted');
});

test('Delete franchise fails with invalid id', async () => {
  const response = await request(app)
    .delete('/api/franchise/999999')
    .set('Authorization', `Bearer ${adminAuthToken}`);
  expect(response.status).toBe(200); // Deleting non-existent franchise still returns 200
});
  


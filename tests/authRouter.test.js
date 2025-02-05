const request = require('supertest');
const app = require('../src/service');

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserAuthToken;
let testUserId;

beforeAll(async () => {
	testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
	const registerRes = await request(app).post('/api/auth').send(testUser);
	testUserAuthToken = registerRes.body.token;
	testUserId = registerRes.body.user.id;
});

test('Register New User', async () => {
	const registerResponse = await request(app).post('/api/auth').send(testUser);
	expect(registerResponse.status).toBe(200);
	expect(registerResponse.body.token).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);
	
});

test('Login User', async () => {
	const loginResponse = await request(app).put('/api/auth').send(testUser);
	expect(loginResponse.status).toBe(200);
	expect(loginResponse.body.token).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);

	const { password, ...user } = { ...testUser, roles: [{ role: 'diner' }] };
	expect(loginResponse.body.user).toMatchObject(user);
});

test('Update User', async () => {
	const updateResponse = await request(app)
		.put(`/api/auth/${testUserId}`)
		.set('Authorization', `Bearer ${testUserAuthToken}`)
		.send(testUser);
	expect(updateResponse.status).toBe(200);
});

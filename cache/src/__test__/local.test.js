"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
/* beforeAll(async () => {
    await connect();
    app.listen(4000)
}) */
const testObjectToCreate = {
    telefono: "999999953",
    direccion: "Local de Prueba desde test",
    distrito: "LIMA"
};
const credentials = {
    email: 'cchumpitaz@idat.com',
    password: 'carlitos'
};
describe('Test to Locals routes', () => {
    let token;
    beforeAll(async () => {
        const data = await (0, supertest_1.default)(app_1.default).post('/users/signin').send(credentials);
        token = data.body.token;
    });
    describe('GET /commons/locals', () => {
        let res;
        beforeEach(async () => {
            res = await (0, supertest_1.default)(app_1.default).get('/commons/locals')
                .set('Authorization', `Bearer ${token}`);
        });
        it('should return 200', async () => {
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.status).toEqual(200);
        });
        it('should return an array of locals', async () => {
            expect(res.body).toEqual(expect.any((Array)));
        });
        it('should return an locals array with the correct properties', async () => {
            const local = res.body[0];
            expect(local).toHaveProperty('_id');
            expect(local).toHaveProperty('telefono');
            expect(local).toHaveProperty('direccion');
            expect(local).toHaveProperty('distrito');
            expect(local).toHaveProperty('slug');
            expect(local).toHaveProperty('active');
        });
        it('should return an error if the token is not provided', async () => {
            const rs = await (0, supertest_1.default)(app_1.default).get('/commons/locals');
            expect(rs.status).toEqual(403);
            expect(rs.body).toHaveProperty('message');
        });
    });
    describe('POST /commons/addLocals', () => {
        let response;
        beforeEach(async () => {
            response = await (0, supertest_1.default)(app_1.default).post('/commons/addLocals')
                .send(testObjectToCreate)
                .set('Authorization', `Bearer ${token}`);
        });
        it('should added a new local', async () => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('distrito');
            expect(response.body).toHaveProperty('local');
            expect(response.body).toHaveProperty('message');
        });
        it('should return an error if the phone number is already registered', async () => {
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty('message');
        });
    });
    describe('PATCH /commons/inactiveLocal/:id', () => {
        let response;
        beforeEach(async () => {
            response = await (0, supertest_1.default)(app_1.default).patch('/commons/inactiveLocal/63f43b7436a4540997f56dc6')
                .set('Authorization', `Bearer ${token}`);
        });
        it('should inactive a local', async () => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('message');
        });
        it('should return an error if the id is not found', async () => {
            let rs = await (0, supertest_1.default)(app_1.default).patch('/commons/inactiveLocal/63f43b7436a4540997f56dc7')
                .set('Authorization', `Bearer ${token}`);
            expect(rs.status).toEqual(404);
            expect(rs.body).toHaveProperty('message');
        });
        it('should return an erro if the id is not valid', async () => {
            let rs = await (0, supertest_1.default)(app_1.default).patch('/commons/inactiveLocal/adasdas')
                .set('Authorization', `Bearer ${token}`);
            expect(rs.status).toEqual(500);
            expect(rs.body).toHaveProperty('message');
        });
    });
});

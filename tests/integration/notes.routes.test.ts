import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { makeApp } from '../../src/app';

describe('Integración: Rutas de Notas (Ejercicios 3, 4 y 5)', () => {
  let app: Express.Application;

  beforeEach(async () => {
    app = makeApp(':memory:');
    
    await request(app).post('/__test__/reset');
  });

  describe('Ejercicio 3: GET /notes/:id', () => {
    it('debe devolver 404 si la nota no existe', async () => {
      const res = await request(app).get('/notes/9999');
      
      expect(res.status).toBe(404);
    });

    it('debe devolver 200 y el objeto de la nota si existe', async () => {
      const createRes = await request(app).post('/notes').send({
        title: 'Nota de prueba',
        content: 'Contenido para el GET'
      });
      const noteId = createRes.body.id;

      const res = await request(app).get(`/notes/${noteId}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', noteId);
      expect(res.body).toHaveProperty('title', 'Nota de prueba');
      expect(res.body).toHaveProperty('content', 'Contenido para el GET');
    });
  });

  describe('Ejercicio 4: PATCH /notes/:id', () => {
    it('debe devolver 404 si se intenta modificar una nota inexistente', async () => {
      const res = await request(app).patch('/notes/9999').send({
        title: 'Título nuevo'
      });
      
      expect(res.status).toBe(404);
    });

    it('debe devolver 200 y modificar parcialmente la nota (sin pisar campos omitidos)', async () => {
      const createRes = await request(app).post('/notes').send({
        title: 'Título original',
        content: 'Contenido original'
      });
      const noteId = createRes.body.id;
      const res = await request(app).patch(`/notes/${noteId}`).send({
        title: 'Título modificado'
      });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Título modificado');
      expect(res.body).toHaveProperty('content', 'Contenido original');
    });
  });

  describe('Ejercicio 5: DELETE /notes/:id', () => {
    it('debe devolver 404 si se intenta eliminar una nota inexistente', async () => {
      const res = await request(app).delete('/notes/9999');
      
      expect(res.status).toBe(404);
    });

    it('debe eliminar la nota correctamente y devolver status 200 o 204', async () => {
      const createRes = await request(app).post('/notes').send({
        title: 'Nota a borrar',
        content: 'Este mensaje se va a eliminar'
      });
      const noteId = createRes.body.id;

      const res = await request(app).delete(`/notes/${noteId}`);
      expect([200, 204]).toContain(res.status);

      const getRes = await request(app).get(`/notes/${noteId}`);
      expect(getRes.status).toBe(404);
    });
  });
});
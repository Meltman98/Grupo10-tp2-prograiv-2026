import { test, expect, request } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('E2E /notes', () => {
  test.beforeEach(async ({ baseURL }) => {
    await resetAndSeed(baseURL!);
  });

  test('Happy path: Crear, consultar y eliminar una nota exitosamente', async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });

    const postRes = await ctx.post('/notes', {
      data: {
        title: 'Nota E2E',
        content: 'Probando el ciclo completo'
      }
    });
    expect([200, 201]).toContain(postRes.status());

    const createdNote = await postRes.json();
    expect(createdNote).toHaveProperty('id');

    const noteId = createdNote.id;

    const getRes = await ctx.get(`/notes/${noteId}`);
    expect(getRes.status()).toBe(200);

    const fetchedNote = await getRes.json();
    expect(fetchedNote.title).toBe('Nota E2E');

    const deleteRes = await ctx.delete(`/notes/${noteId}`);
    expect([200, 204]).toContain(deleteRes.status());

    const getDeletedRes = await ctx.get(`/notes/${noteId}`);
    expect(getDeletedRes.status()).toBe(404);

    await ctx.dispose();
  });

  test('Caso de error: Intentar modificar una nota inexistente devuelve 404', async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });

    const patchRes = await ctx.patch('/notes/9999', {
      data: {
        title: 'Título hackeado'
      }
    });
    expect(patchRes.status()).toBe(404);

    await ctx.dispose();
  });
});
import { beforeEach, describe, expect, it } from 'vitest';
import { createDb } from '../../src/db/connection';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';

describe('NoteService - updateNote (Ejercicio 4)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    service = new NoteServiceImpl(new SqliteNoteRepository(db));
  });

  it('actualiza el título sin cambiar el contenido', () => {
    const note = service.createNote({ title: 'Título original', content: 'Contenido original' });

    const updated = service.updateNote(note.id, { title: 'Título nuevo' });

    expect(updated).toMatchObject({ title: 'Título nuevo', content: 'Contenido original' });
  });

  it('actualiza el contenido sin cambiar el título', () => {
    const note = service.createNote({ title: 'Título original', content: 'Contenido original' });

    const updated = service.updateNote(note.id, { content: 'Contenido nuevo' });

    expect(updated).toMatchObject({ title: 'Título original', content: 'Contenido nuevo' });
  });

  it('devuelve undefined para un id inexistente', () => {
    expect(service.updateNote(999, { title: 'Título nuevo' })).toBeUndefined();
  });
});
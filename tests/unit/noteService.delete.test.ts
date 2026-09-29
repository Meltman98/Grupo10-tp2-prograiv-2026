import { beforeEach, describe, expect, it } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { NoteServiceImpl } from '../../src/services/NoteService';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    service = new NoteServiceImpl(new SqliteNoteRepository(db));
  });

  it('elimina una nota existente', () => {
    const note = service.createNote({ title: 'Nota', content: 'Contenido' });

    expect(service.deleteNote(note.id)).toBe(true);
    expect(service.getNote(note.id)).toBeUndefined();
  });

  it('devuelve false para un id inexistente', () => {
    expect(service.deleteNote(999)).toBe(false);
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getNote (Ejercicio 3)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve la nota para un id existente', () => {
    const createdNote = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    expect(service.getNote(createdNote.id)).toEqual(createdNote);
  });

  it('devuelve undefined para un id inexistente', () => {
    expect(service.getNote(999)).toBeUndefined();
  });
});
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

    expect(service.getNote(createdNote.id)).toEqual(createdNote);//crea una nota y luego verificar que al buscarla por su id, se obtenga la misma nota creada.
  });

  it('devuelve undefined para un id inexistente', () => { //crea una nota y luego verificar que al buscar un id que no existe, se obtenga undefined.
    expect(service.getNote(999)).toBeUndefined();
  });
});
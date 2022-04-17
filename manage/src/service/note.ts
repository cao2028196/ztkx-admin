
import { Note as NoteApi } from './api/note';
import { JsonResponse } from './api/base';
import { baseURL } from './env';

class Note extends NoteApi {
  
}

export default new Note(baseURL.note, '/api/note');

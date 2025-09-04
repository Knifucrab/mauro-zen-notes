const noteRepository = require('../repositories/note.repository');
const tagRepository = require('../repositories/tag.repository');

class NoteService {
  async createNote(noteData, userId) {
    const { title, content, tagIds } = noteData;

    // Validate required fields
    if (!title?.trim()) {
      throw new Error('Title is required');
    }

    // Validate tags exist if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await Promise.all(
        tagIds.map(tagId => tagRepository.findById(tagId))
      );

      const invalidTags = existingTags.filter(tag => !tag);
      if (invalidTags.length > 0) {
        throw new Error('One or more tags not found');
      }
    }

    const note = await noteRepository.create({
      title: title.trim(),
      content: content?.trim() || '',
      userId,
      tagIds: tagIds || []
    });

    return note;
  }

  async getNotes(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      tagId,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = options;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 notes per page

    // Validate sort parameters
    const validSortFields = ['title', 'createdAt', 'updatedAt'];
    const validSortOrders = ['asc', 'desc'];

    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'updatedAt';
    const safeSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    return await noteRepository.findAll(userId, {
      page: pageNum,
      limit: limitNum,
      search: search?.trim(),
      tagId,
      sortBy: safeSortBy,
      sortOrder: safeSortOrder
    });
  }

  async getNoteById(id, userId) {
    const note = await noteRepository.findById(id, userId);
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  }

  async updateNote(id, noteData, userId) {
    // Check if note exists and belongs to user
    const existingNote = await noteRepository.findById(id, userId);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    // Validate title if provided
    if (noteData.title !== undefined && !noteData.title?.trim()) {
      throw new Error('Title cannot be empty');
    }

    // Validate tags exist if provided
    if (noteData.tagIds && noteData.tagIds.length > 0) {
      const existingTags = await Promise.all(
        noteData.tagIds.map(tagId => tagRepository.findById(tagId))
      );

      const invalidTags = existingTags.filter(tag => !tag);
      if (invalidTags.length > 0) {
        throw new Error('One or more tags not found');
      }
    }

    const updateData = {
      ...(noteData.title !== undefined && { title: noteData.title.trim() }),
      ...(noteData.content !== undefined && { content: noteData.content?.trim() || '' }),
      ...(noteData.tagIds !== undefined && { tagIds: noteData.tagIds })
    };

    return await noteRepository.update(id, userId, updateData);
  }

  async deleteNote(id, userId) {
    // Check if note exists and belongs to user
    const existingNote = await noteRepository.findById(id, userId);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    return await noteRepository.delete(id, userId);
  }

  async addTagToNote(noteId, tagId, userId) {
    // Check if note exists and belongs to user
    const note = await noteRepository.findById(noteId, userId);
    if (!note) {
      throw new Error('Note not found');
    }

    // Check if tag exists
    const tag = await tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    // Check if tag is already added
    const isTagAlreadyAdded = note.tags.some(t => t.id === tagId);
    if (isTagAlreadyAdded) {
      throw new Error('Tag already added to this note');
    }

    return await noteRepository.addTag(noteId, userId, tagId);
  }

  async removeTagFromNote(noteId, tagId, userId) {
    // Check if note exists and belongs to user
    const note = await noteRepository.findById(noteId, userId);
    if (!note) {
      throw new Error('Note not found');
    }

    // Check if tag is associated with the note
    const isTagAssociated = note.tags.some(t => t.id === tagId);
    if (!isTagAssociated) {
      throw new Error('Tag is not associated with this note');
    }

    return await noteRepository.removeTag(noteId, userId, tagId);
  }

  async getNotesStats(userId) {
    return await noteRepository.getNotesStats(userId);
  }

  async searchNotes(userId, query, options = {}) {
    if (!query?.trim()) {
      return await this.getNotes(userId, options);
    }

    return await this.getNotes(userId, {
      ...options,
      search: query.trim()
    });
  }

  async getNotesByTag(userId, tagId, options = {}) {
    // Validate that tag exists
    const tag = await tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    return await this.getNotes(userId, {
      ...options,
      tagId
    });
  }

  async archiveNote(id, userId) {
    // Check if note exists and belongs to user
    const note = await noteRepository.findById(id, userId);
    if (!note) throw new Error('Note not found');
    if (note.archived) throw new Error('Note is already archived');
    return await noteRepository.archiveNote(id, userId);
  }

  async unarchiveNote(id, userId) {
    // Check if note exists and belongs to user
    const note = await noteRepository.findById(id, userId);
    if (!note) throw new Error('Note not found');
    if (!note.archived) throw new Error('Note is not archived');
    return await noteRepository.unarchiveNote(id, userId);
  }
}

module.exports = { NoteService: new NoteService() };

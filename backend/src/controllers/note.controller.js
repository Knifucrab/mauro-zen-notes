const { NoteService } = require('../services/note.service');

class NoteController {
  async createNote(req, res) {
    try {
      const userId = req.user.id;
      const { title, content, tagIds } = req.body;

      // Validate input
      if (!title?.trim()) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Title is required'
        });
      }

      const note = await NoteService.createNote({
        title,
        content,
        tagIds
      }, userId);

      res.status(201).json({
        message: 'Note created successfully',
        data: note
      });
    } catch (error) {
      console.error('Create note error:', error);
      
      if (error.message === 'Title is required' || 
          error.message === 'One or more tags not found') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create note'
      });
    }
  }

  async getNotes(req, res) {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        search,
        tagId,
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await NoteService.getNotes(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        tagId,
        sortBy,
        sortOrder
      });

      res.json({
        message: 'Notes retrieved successfully',
        data: result.notes,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve notes'
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const note = await NoteService.getNoteById(id, userId);

      res.json({
        message: 'Note retrieved successfully',
        data: note
      });
    } catch (error) {
      console.error('Get note error:', error);
      
      if (error.message === 'Note not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve note'
      });
    }
  }

  async updateNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { title, content, tagIds } = req.body;

      const updatedNote = await NoteService.updateNote(id, {
        title,
        content,
        tagIds
      }, userId);

      res.json({
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Update note error:', error);
      
      if (error.message === 'Note not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      if (error.message === 'Title cannot be empty' || 
          error.message === 'One or more tags not found') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update note'
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await NoteService.deleteNote(id, userId);

      res.json({
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('Delete note error:', error);
      
      if (error.message === 'Note not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete note'
      });
    }
  }

  async addTagToNote(req, res) {
    try {
      const userId = req.user.id;
      const { id, tagId } = req.params;

      const updatedNote = await NoteService.addTagToNote(id, tagId, userId);

      res.json({
        message: 'Tag added to note successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Add tag to note error:', error);
      
      if (error.message === 'Note not found' || error.message === 'Tag not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      if (error.message === 'Tag already added to this note') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to add tag to note'
      });
    }
  }

  async removeTagFromNote(req, res) {
    try {
      const userId = req.user.id;
      const { id, tagId } = req.params;

      const updatedNote = await NoteService.removeTagFromNote(id, tagId, userId);

      res.json({
        message: 'Tag removed from note successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Remove tag from note error:', error);
      
      if (error.message === 'Note not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      if (error.message === 'Tag is not associated with this note') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to remove tag from note'
      });
    }
  }

  async getNotesStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await NoteService.getNotesStats(userId);

      res.json({
        message: 'Notes statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get notes stats error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve notes statistics'
      });
    }
  }

  async searchNotes(req, res) {
    try {
      const userId = req.user.id;
      const { q: query, page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

      const result = await NoteService.searchNotes(userId, query, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      res.json({
        message: 'Notes search completed successfully',
        data: result.notes,
        pagination: result.pagination,
        query: query || ''
      });
    } catch (error) {
      console.error('Search notes error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to search notes'
      });
    }
  }

  async getNotesByTag(req, res) {
    try {
      const userId = req.user.id;
      const { tagId } = req.params;
      const { page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

      const result = await NoteService.getNotesByTag(userId, tagId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      res.json({
        message: 'Notes by tag retrieved successfully',
        data: result.notes,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get notes by tag error:', error);
      
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve notes by tag'
      });
    }
  }
}

module.exports = new NoteController();

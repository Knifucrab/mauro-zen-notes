const prisma = require('../config/database');

class NoteRepository {
  async create(noteData) {
    return await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        userId: noteData.userId,
        ...(noteData.tagIds && noteData.tagIds.length > 0 && {
          tags: {
            connect: noteData.tagIds.map(id => ({ id }))
          }
        })
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async findAll(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      tagId,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    
    const where = {
      userId,
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }),
      ...(tagId && {
        tags: {
          some: {
            id: tagId
          }
        }
      })
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          tags: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.note.count({ where })
    ]);

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async findById(id, userId) {
    return await prisma.note.findFirst({
      where: {
        id,
        userId
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async update(id, userId, noteData) {
    const updateData = {
      ...(noteData.title !== undefined && { title: noteData.title }),
      ...(noteData.content !== undefined && { content: noteData.content })
    };

    // Handle tags update
    if (noteData.tagIds !== undefined) {
      // First disconnect all current tags
      await prisma.note.update({
        where: { id },
        data: {
          tags: {
            set: []
          }
        }
      });

      // Then connect new tags if any
      if (noteData.tagIds.length > 0) {
        updateData.tags = {
          connect: noteData.tagIds.map(tagId => ({ id: tagId }))
        };
      }
    }

    return await prisma.note.update({
      where: {
        id
      },
      data: updateData,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async delete(id, userId) {
    return await prisma.note.delete({
      where: {
        id,
        userId
      }
    });
  }

  async addTag(noteId, userId, tagId) {
    return await prisma.note.update({
      where: {
        id: noteId,
        userId
      },
      data: {
        tags: {
          connect: {
            id: tagId
          }
        }
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    });
  }

  async removeTag(noteId, userId, tagId) {
    return await prisma.note.update({
      where: {
        id: noteId,
        userId
      },
      data: {
        tags: {
          disconnect: {
            id: tagId
          }
        }
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    });
  }

  async getNotesStats(userId) {
    const [total, withTags, recentCount] = await Promise.all([
      prisma.note.count({
        where: { userId }
      }),
      prisma.note.count({
        where: {
          userId,
          tags: {
            some: {}
          }
        }
      }),
      prisma.note.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    return {
      total,
      withTags,
      withoutTags: total - withTags,
      recentCount
    };
  }
}

module.exports = new NoteRepository();

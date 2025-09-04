const prisma = require('../config/database');

class TagRepository {
  async create(tagData) {
    return await prisma.tag.create({
      data: tagData,
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    });
  }

  async findAll(options = {}) {
    const {
      page,
      limit,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = options;

    const where = {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    let queryOptions = {
      where,
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    };

    // Add pagination if specified
    if (page && limit) {
      const skip = (page - 1) * limit;
      queryOptions.skip = skip;
      queryOptions.take = limit;

      const [tags, total] = await Promise.all([
        prisma.tag.findMany(queryOptions),
        prisma.tag.count({ where })
      ]);

      return {
        tags,
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

    const tags = await prisma.tag.findMany(queryOptions);
    return { tags };
  }

  async findById(id) {
    return await prisma.tag.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    });
  }

  async findByName(name) {
    return await prisma.tag.findUnique({
      where: {
        name
      }
    });
  }

  async update(id, tagData) {
    return await prisma.tag.update({
      where: {
        id
      },
      data: tagData,
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.tag.delete({
      where: {
        id
      }
    });
  }

  async getTagsWithNotes(userId, options = {}) {
    const {
      page,
      limit,
      search
    } = options;

    const where = {
      notes: {
        some: {
          userId
        }
      },
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    let queryOptions = {
      where,
      include: {
        notes: {
          where: {
            userId
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        },
        _count: {
          select: {
            notes: {
              where: {
                userId
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    };

    if (page && limit) {
      const skip = (page - 1) * limit;
      queryOptions.skip = skip;
      queryOptions.take = limit;

      const [tags, total] = await Promise.all([
        prisma.tag.findMany(queryOptions),
        prisma.tag.count({ where })
      ]);

      return {
        tags,
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

    const tags = await prisma.tag.findMany(queryOptions);
    return { tags };
  }

  async getMostUsedTags(userId, limit = 10) {
    return await prisma.tag.findMany({
      where: {
        notes: {
          some: {
            userId
          }
        }
      },
      include: {
        _count: {
          select: {
            notes: {
              where: {
                userId
              }
            }
          }
        }
      },
      orderBy: {
        notes: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }

  async getTagStats() {
    const [total, withNotes, avgNotesPerTag] = await Promise.all([
      prisma.tag.count(),
      prisma.tag.count({
        where: {
          notes: {
            some: {}
          }
        }
      }),
      prisma.tag.aggregate({
        _avg: {
          id: true
        },
        where: {
          notes: {
            some: {}
          }
        }
      })
    ]);

    return {
      total,
      withNotes,
      unused: total - withNotes,
      averageNotesPerTag: avgNotesPerTag._avg?.id || 0
    };
  }
}

module.exports = new TagRepository();

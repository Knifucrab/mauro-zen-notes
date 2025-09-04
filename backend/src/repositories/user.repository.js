const prisma = require('../config/database');

class UserRepository {
  async create(userData) {
    return await prisma.user.create({
      data: userData,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByUsername(username) {
    return await prisma.user.findUnique({
      where: {
        username
      }
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByIdWithPassword(id) {
    return await prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id, userData) {
    return await prisma.user.update({
      where: {
        id
      },
      data: userData,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: {
        id
      }
    });
  }

  async getUserStats(id) {
    const [notesCount, tagsCount] = await Promise.all([
      prisma.note.count({
        where: {
          userId: id
        }
      }),
      prisma.tag.count({
        where: {
          notes: {
            some: {
              userId: id
            }
          }
        }
      })
    ]);

    return {
      notesCount,
      tagsCount
    };
  }
}

module.exports = new UserRepository();

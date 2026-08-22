import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsPrismaService } from '../../prisma/approval-workflow-prisma.service';
import { AwsUser } from '../common/aws-auth.guard';
import {
  requestInclude,
  toRequestResponse,
} from '../common/request.mapper';
import { RequestResponse } from '../common/request.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: AwsPrismaService) {}

  /** 当前登录用户（信息来自 JWT，无需查库） */
  getMe(user: AwsUser) {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department,
      managerId: user.managerId,
    };
  }

  async listUsers(department?: string, role?: string) {
    return this.prisma.user.findMany({
      where: {
        department: department ?? undefined,
        role: role ?? undefined,
      },
      orderBy: { employeeId: 'asc' },
    });
  }

  async getUser(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) throw new NotFoundException('用户不存在');
    return u;
  }

  async getUserRequests(id: string): Promise<RequestResponse[]> {
    const rows = await this.prisma.request.findMany({
      where: { applicantId: id },
      include: requestInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(toRequestResponse);
  }
}

# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 全量安装依赖 
RUN npm ci
# RUN npm ci --only=production # 不安装devDependencies

# 复制源码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建项目
RUN npm run build

# 运行阶段：只装生产依赖，仅拷贝编译产物
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# 从构建层复制打包好的代码 + prisma生成文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# 启动命令：先执行数据库迁移和种子数据，再启动服务
# CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/main"]
# npx prisma migrate dev 生成迁移文件，可以本地开发部署前手动执行
# npx prisma migrate deploy 部署docker前执行
# npx ts-node prisma/seed.ts 更新mock数据，不建议放容器启动流程
# 不会数据库初始化，执行快
CMD ["node", "dist/main.js"] 
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

# 生成 Prisma Client（三份 schema）
RUN npm run prisma:generate

# 构建项目
RUN npm run build

# 运行阶段：只装生产依赖，仅拷贝编译产物
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
# 部署阶段需要 prisma CLI 执行 migrate deploy（仅运行时依赖，不进生产包会导致命令缺失）
RUN npm install prisma@^5.0.0

# 从构建层复制打包好的代码 + prisma生成文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# 启动命令：先按三份 schema 执行 migrate deploy 同步库结构，再启动服务
CMD ["sh", "-c", "npm run prisma:deploy && node dist/main.js"]
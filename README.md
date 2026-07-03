# ws-design-server

BPM管理系统 - 后端服务

## 技术栈

- **框架**: NestJS 9
- **ORM**: Prisma 5
- **数据库**: MySQL 5.7
- **认证**: JWT
- **语言**: TypeScript
- **容器化**: Docker + Docker Compose

## 项目结构

```
ws-design-server/
├── src/
│   ├── main.ts                  # 入口文件
│   ├── app.module.ts            # 根模块
│   ├── auth/                    # 认证模块（登录、JWT）
│   ├── tenant/                  # 租户模块
│   ├── app/                     # 应用模块
│   └── prisma/                  # 数据库服务
├── prisma/
│   ├── schema.prisma            # 数据模型
│   └── seed.ts                  # Mock 数据
├── docker-compose.yml           # Docker 编排
├── Dockerfile                   # Docker 镜像
├── .env                         # 环境变量
└── package.json
```

## 数据库表

| 表名 | 说明 |
|------|------|
| sys_user | 用户表 |
| sys_tenant | 租户表 |
| sys_user_tenant | 用户-租户关联表 |
| sys_app | 应用表 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/ws/admin/auth/token` | 用户密码登录 |
| GET | `/ws/admin/auth/token/ticket` | SSO Ticket 登录 |
| GET | `/ws/admin/auth/user/getUserByNetuserid` | 获取用户信息 |
| GET | `/ws/admin/tenant/getTenantListByUserId` | 获取租户列表 |
| GET | `/ws/admin/authorization/apps` | 获取应用列表 |

## 快速开始

### 前置条件

- Node.js >= 18（推荐 v20.12.0）
- Docker & Docker Compose
- MySQL 5.7（或通过 Docker 启动）

### 1. 安装依赖

```bash
# 切换到 Node 20
nvm use 20.12.0

# 安装 npm 依赖
npm install

# 生成 Prisma Client
npx prisma generate
```

### 2. 启动 MySQL

```bash
# 通过 Docker 启动 MySQL
docker-compose up -d mysql
```

### 3. 初始化数据库

```bash
# 执行数据库迁移（创建表结构）
npx prisma migrate dev --name init

# 插入 Mock 数据
npx ts-node prisma/seed.ts
```

### 4. 启动后端服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm run build
npm run start:prod
```

服务默认运行在 `http://localhost:3000`。

### 5. 启动前端服务

```bash
# 切换到前端项目目录
cd ../ws-design-view/ws-design

# 启动前端开发服务
npm run dev
```

前端默认运行在 `http://localhost:9528`。

## 测试账号

| 用户名 | 密码 |
|--------|------|
| `admin` | `admin123` |

### 登录流程

1. 访问 `http://localhost:9528`
2. 输入用户名 `admin`
3. 选择租户（自动加载）
4. 输入密码 `admin123`
5. 点击登录

## 环境变量

`.env` 文件配置：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | MySQL 连接地址 | `mysql://ws_design:ws_design_2024@localhost:3306/ws_design_db` |
| `JWT_SECRET` | JWT 签名密钥 | `ws-design-jwt-secret-key-2024` |
| `PORT` | 服务端口 | `3000` |

## Docker 部署

```bash
# 完整启动（MySQL + 后端服务）
docker-compose up -d

# 查看日志
docker-compose logs -f server

# 停止服务
docker-compose down
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务（热重载） |
| `npm run build` | 编译项目 |
| `npm run start:prod` | 启动生产服务 |
| `npx prisma generate` | 生成 Prisma Client |
| `npx prisma migrate dev` | 执行数据库迁移 |
| `npx prisma studio` | 打开 Prisma 数据管理界面 |

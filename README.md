# qy-core-server

- 对接两套**独立前端项目**: 
    - 配置/设计：低代码工单配置平台 ws-design-view
    - 流程/审批：通用审批工作流系统 approval-workflow-system

## 技术栈

- **框架**: NestJS 9
- **ORM**: Prisma 5
- **数据库**: MySQL 5.7
- **认证**: JWT
- **语言**: TypeScript
- **容器化**: Docker + Docker Compose

## 项目结构

```
qy-core-server/
├── src/
│   ├── main.ts                  # 入口文件
│   ├── app.module.ts            # 根模块（ENABLE_MODULE 开关）
│   ├── common/                  # 全局拦截器 / 过滤器 / 异常
│   ├── auth/                    # 认证/用户模块（顶层共享，后续统一用户管理）@Controller('ws/admin/auth')
│   ├── ws-design/               # ws-design 产品（配置/设计端）
│   │   ├── ws-design.product.module.ts   # 产品模块入口（引用 AuthModule + 下列子模块）
│   │   ├── ws-design.module.ts           # 设计包子模块
│   │   ├── tenant/              # 租户模块 @Controller('ws/admin/tenant')
│   │   └── app/                 # 应用模块 @Controller('ws/admin/authorization')
│   ├── approval-workflow/       # approval-workflow 产品（流程/审批端）
│   │   ├── approval-workflow.product.module.ts
│   │   └── approval-workflow.controller.ts  # @Controller('aws')
│   └── prisma/                  # 数据库服务
├── prisma/
│   ├── schema.prisma            # 数据模型
│   └── seed.ts                  # Mock 数据
├── docker-compose.yml           # Docker 编排（当前单实例）
├── Dockerfile                   # Docker 镜像
├── .env                         # 默认环境变量（单实例）
├── .env.wdv                    # ws-design-view 实例配置（ENV_FILE 选择）
├── .env.aws                    # approval-workflow 实例配置
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

项目通过 `@nestjs/config` 自动加载 env 文件，用 `ENV_FILE` 指定加载哪一份配置（不指定则加载 `.env`）。

```bash
# 默认（加载 .env，加载全部产品模块，端口 3000，前缀 ws/admin + aws）
npm run start:prod

# 开发模式（热重载）
npm run dev

# 按产品启动独立实例（双实例部署）：ENV_FILE 选配置，ENABLE_MODULE 控制只加载该产品模块
ENV_FILE=.env.wdv ENABLE_MODULE=ws-design npm run start:prod          # ws-design-view 实例：3000 / ws/admin
ENV_FILE=.env.aws ENABLE_MODULE=approval-workflow npm run start:prod  # approval-workflow 实例：3001 / aws
```

服务默认运行在 `http://localhost:3000`（`ENV_FILE=.env.aws` 时为 `http://localhost:3001`）。

### 多产品实例（两套独立前端）

本后端对接两个独立产品，分别为其准备了实例配置：

| 实例配置 | 对应前端 | 端口 | 路由前缀 | 数据库 |
|----------|----------|------|----------|--------|
| `.env.wdv` | ws-design-view（配置/设计） | 3000 | `ws/admin` | `ws_design_db` |
| `.env.aws` | approval-workflow-system（流程/审批） | 3001 | `aws` | `approval-workflow_db` |

#### 启动单个产品实例（双实例部署）

`ENV_FILE` 选择实例配置，`ENABLE_MODULE` 控制只加载对应产品模块（不设置则加载全部，便于本地联调）：

```bash
# 仅启动 ws-design（端口 3000，前缀 ws/admin，连 ws_design_db）
ENV_FILE=.env.wdv ENABLE_MODULE=ws-design npm run start:prod

# 仅启动 approval-workflow（端口 3001，前缀 aws，连 approval-workflow_db）
ENV_FILE=.env.aws ENABLE_MODULE=approval-workflow npm run start:prod

# 开发模式同样可加 ENV_FILE / ENABLE_MODULE
ENV_FILE=.env.wdv ENABLE_MODULE=ws-design npm run dev
```

> `ENABLE_MODULE` 取值：`ws-design`、`approval-workflow`；逗号分隔可同时加载多个（如 `ws-design,approval-workflow`）。
> `approval-workflow_db` 需在阶段三创建并迁移后，aws 实例方可启动。

#### 验证路由（无需前端）

启动后可用 curl 验证两产品前缀是否生效：

```bash
# —— ws-design 产品（路径与重构前一致，前端无需改造）——
curl -X POST http://localhost:3000/ws/admin/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"userId":"admin","password":"admin123"}'
curl 'http://localhost:3000/ws/admin/tenant/getTenantListByUserId?userId=1'
curl 'http://localhost:3000/ws/admin/authorization/apps'

# —— approval-workflow 产品占位接口 ——
curl http://localhost:3001/aws/health
```

> approval-workflow 的真实业务接口（用户/角色、申请类型、步骤、申请单详情等）将根据其前端项目反推后补充。

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
| `DATABASE_URL` | MySQL 连接地址 | `mysql://ws_design:ws_design_2026@localhost:3306/ws_design_db` |
| `JWT_SECRET` | JWT 签名密钥 | `ws-design-jwt-secret-key-2026` |
| `PORT` | 服务端口 | `3000` |
| `API_PREFIX` | 全局路由前缀（双前端对接时按产品区分） | `ws/admin` |
| `CORS_ORIGINS` | 跨域白名单，逗号分隔；留空则反射任意来源 | 留空（默认放开） |

> 以上为默认 `.env` 变量。多产品实例请使用 `.env.wdv` / `.env.aws`，通过 `ENV_FILE`
> 指定加载哪一份；其中 `PORT` / `DATABASE_URL` / `JWT_SECRET` / `API_PREFIX` / `CORS_ORIGINS`
> 同样适用。

## Docker 部署

```bash
# 完整启动（MySQL + 后端服务）
docker-compose up -d

# 查看日志
docker-compose logs -f server

# 停止服务
docker-compose down
```

> 当前 `docker-compose.yml` 为单实例（加载 `.env`）。多产品双实例编排（独立 server / mysql
> 服务 + `ENV_FILE` 注入）在阶段三实施。

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务（热重载） |
| `npm run build` | 编译项目 |
| `npm run start:prod` | 启动生产服务 |
| `npx prisma generate` | 生成 Prisma Client |
| `npx prisma migrate dev` | 执行数据库迁移 |
| `npx prisma studio` | 打开 Prisma 数据管理界面 |

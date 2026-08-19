-- 三库建库脚本：docker-compose 的 mysql 服务会在首次启动时自动执行
-- （挂载 ./prisma/init.sql -> /docker-entrypoint-initdb.d/init.sql）
-- 以 root 身份运行，创建三个独立 schema 并授权给应用用户 ws_design。

CREATE DATABASE IF NOT EXISTS auth_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS ws_design_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `approval_workflow_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- docker-compose 用 MYSQL_USER=ws_design 创建的用户默认只拥有 ws_design_db，
-- 这里显式授予其对三个库的权限，保证应用以单一账号访问三库。
GRANT ALL PRIVILEGES ON auth_db.* TO 'ws_design'@'%';
GRANT ALL PRIVILEGES ON ws_design_db.* TO 'ws_design'@'%';
GRANT ALL PRIVILEGES ON `approval_workflow_db`.* TO 'ws_design'@'%';

FLUSH PRIVILEGES;

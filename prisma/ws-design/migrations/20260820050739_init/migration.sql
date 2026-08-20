-- CreateTable
CREATE TABLE `SysTenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` VARCHAR(64) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `code` VARCHAR(64) NULL,
    `prvCode` VARCHAR(64) NULL,
    `regFullCode` VARCHAR(128) NULL,
    `regFullName` VARCHAR(256) NULL,
    `teamFullCode` VARCHAR(128) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SysTenant_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SysApp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appId` VARCHAR(64) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `code` VARCHAR(64) NOT NULL,
    `description` TEXT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SysApp_appId_key`(`appId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WsDesignPackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `wsTypeName` VARCHAR(256) NOT NULL,
    `wsTypeCode` VARCHAR(128) NOT NULL,
    `wsPrefix` VARCHAR(64) NULL,
    `designGroup` VARCHAR(128) NULL,
    `remark` TEXT NULL,
    `processDesignId` VARCHAR(128) NULL,
    `processXml` LONGTEXT NULL,
    `taskForms` LONGTEXT NULL,
    `usableRange` VARCHAR(32) NULL DEFAULT 'v2',
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WsDesignDeploy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wsTypeCode` VARCHAR(128) NOT NULL,
    `wsTypeName` VARCHAR(256) NULL,
    `wsPrefix` VARCHAR(64) NULL,
    `wsDesignPackageId` INTEGER NULL,
    `createFormInfo` LONGTEXT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

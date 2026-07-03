-- CreateTable
CREATE TABLE `SysUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(64) NOT NULL,
    `username` VARCHAR(128) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `email` VARCHAR(128) NULL,
    `mobilephone` VARCHAR(32) NULL,
    `companyName` VARCHAR(256) NULL,
    `companyCode` VARCHAR(64) NULL,
    `netuserId` VARCHAR(64) NULL,
    `userType` VARCHAR(32) NULL,
    `prvId` VARCHAR(64) NULL,
    `prvName` VARCHAR(128) NULL,
    `regId` VARCHAR(64) NULL,
    `regName` VARCHAR(128) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SysUser_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `SysUserTenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SysUserTenant_userId_tenantId_key`(`userId`, `tenantId`),
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

-- AddForeignKey
ALTER TABLE `SysUserTenant` ADD CONSTRAINT `SysUserTenant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `SysUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SysUserTenant` ADD CONSTRAINT `SysUserTenant_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `SysTenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

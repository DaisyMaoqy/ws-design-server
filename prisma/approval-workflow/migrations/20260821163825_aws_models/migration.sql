/*
  Warnings:

  - You are about to drop the `AwsProcess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `AwsProcess`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `title` VARCHAR(128) NULL,
    `department` VARCHAR(128) NOT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'employee',
    `managerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_employeeId_key`(`employeeId`),
    INDEX `User_department_idx`(`department`),
    INDEX `User_managerId_idx`(`managerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(16) NOT NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(128) NOT NULL,
    `department` VARCHAR(128) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `reason` VARCHAR(500) NOT NULL,
    `urgency` VARCHAR(16) NULL,
    `leaveType` VARCHAR(16) NULL,
    `leaveStart` VARCHAR(16) NULL,
    `leaveEnd` VARCHAR(16) NULL,
    `note` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `submittedAt` DATETIME(3) NULL,

    INDEX `Request_applicantId_idx`(`applicantId`),
    INDEX `Request_status_idx`(`status`),
    INDEX `Request_type_idx`(`type`),
    INDEX `Request_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripLeg` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `from` VARCHAR(64) NOT NULL,
    `to` VARCHAR(64) NOT NULL,
    `departDate` VARCHAR(16) NOT NULL,
    `returnDate` VARCHAR(16) NOT NULL,
    `transport` VARCHAR(16) NOT NULL,

    INDEX `TripLeg_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Budget` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `transport` DECIMAL(15, 2) NOT NULL,
    `hotel` DECIMAL(15, 2) NOT NULL,
    `allowance` DECIMAL(15, 2) NOT NULL,
    `other` DECIMAL(15, 2) NOT NULL,
    `note` VARCHAR(500) NULL,

    UNIQUE INDEX `Budget_requestId_key`(`requestId`),
    INDEX `Budget_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditEntry` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actorId` VARCHAR(191) NOT NULL,
    `actorName` VARCHAR(128) NOT NULL,
    `action` VARCHAR(16) NOT NULL,
    `from` VARCHAR(32) NOT NULL,
    `to` VARCHAR(32) NOT NULL,
    `comment` VARCHAR(500) NULL,

    INDEX `AuditEntry_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TripLeg` ADD CONSTRAINT `TripLeg_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEntry` ADD CONSTRAINT `AuditEntry_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEntry` ADD CONSTRAINT `AuditEntry_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

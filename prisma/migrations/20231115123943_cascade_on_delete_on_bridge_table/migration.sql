-- DropForeignKey
ALTER TABLE `role_has_permissions` DROP FOREIGN KEY `role_has_permissions_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `role_has_permissions` DROP FOREIGN KEY `role_has_permissions_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_has_roles` DROP FOREIGN KEY `user_has_roles_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_has_roles` DROP FOREIGN KEY `user_has_roles_userId_fkey`;

-- AddForeignKey
ALTER TABLE `user_has_roles` ADD CONSTRAINT `user_has_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_roles` ADD CONSTRAINT `user_has_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

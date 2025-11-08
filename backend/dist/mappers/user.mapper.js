"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toLoginResponse(user, message) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            message,
        };
    }
    static toUserDto(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
        };
    }
    static toUserDtoArray(users) {
        return users.map((user) => this.toUserDto(user));
    }
    static toMessageResponse(message) {
        return { message };
    }
    static toProfileResponse(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePicUrl: user.profilePicUrl,
            profilePicKey: user.profilePicKey
        };
    }
}
exports.UserMapper = UserMapper;

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    /**
     * Find a user by auth provider ID
     * @param providerId - The authentication provider ID
     */
    async findUserByAuthId(providerId: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ "sp.pId": providerId }).exec();
    }

    /**
     * Upsert (update or insert) a user based on provider ID
     * @param providerId - The authentication provider ID
     * @param upsertData - The data to insert/update
     */
    async upsertUserByAuthId(providerId: string, upsertData: Partial<User>): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(
            { sp: { $elemMatch: { pId: providerId } } },
            upsertData,
            { upsert: true, new: true }
        ).exec();
    }

    /**
     * Find user by email
     */
    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    /**
     * Create a new user
     */
    async createUser(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    /**
     * Update a user by ID
     */
    async updateUser(userId: string, updateData: Partial<User>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }
}

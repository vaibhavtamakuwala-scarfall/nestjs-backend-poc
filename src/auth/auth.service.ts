import { BadRequestException, Injectable } from '@nestjs/common';
import { userDetailsToStore } from './interfaces/auth-user.interface';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) { }

  async checkAndStoreUser(deatils: userDetailsToStore) {
    try {
      const { providerId, name, email, authType, profileImg } = deatils;
      let upsertObj = {
        nm: name,
        email: email,
        dp: profileImg,
        $push: {}
      }
      const findUser = await this.userRepository.findUserByAuthId(providerId);
      if (!findUser) {
        upsertObj = {
          ...upsertObj,
          $push: {
            sp: {
              inp: authType,
              pId: providerId
            }
          },
        }
      }
      const upsertedUser = await this.userRepository.upsertUserByAuthId(providerId, upsertObj);
      return {
        email,
        _id: upsertedUser._id
      }
    } catch (error) {
      console.error("Error - checkAndStoreUser: ", error);
      throw new BadRequestException(error);
    }
  };
}

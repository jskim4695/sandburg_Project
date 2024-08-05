import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Announce } from './entities/announce.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnounceDto } from './dto/create-announce.dto';
import { UpdateAnnounceDto } from './dto/update-announce.dto';


@Injectable()
export class AnnounceService {
  constructor(
    @InjectRepository(Announce)
    private readonly manageRepository: Repository<Announce>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

      // 게시물 생성
      async create(user: User, createManageDto: CreateAnnounceDto) {
        const users = await this.userRepository.findOne({
          where: {id: user.id},
        })
    
        if (!users) {
          throw new BadRequestException('사용자를 찾을 수 없습니다.');
        }
    
        const newManagePost = new Announce()
        newManagePost.user_id = user.id
        newManagePost.title_a = createManageDto.title_a;
        newManagePost.contents_a = createManageDto.contents_a;
    
        const post =  await this.manageRepository.save(newManagePost);
    
        return post
      }

      // 게시물 전체 조회
      async findAllPost() {
        const posts = await this.manageRepository.find();
        return posts;
      }

       // 운영 게시물 단건 조회
      async findOneAnnByPostId(postId: number) {
        const post = await this.manageRepository.findOne({ where: { id: postId } });
        if (!post) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.');
        }
        return post;
      }

    // 게시물 삭제
  async removeAnnPost(user: User, postId: number) {
    const post = await this.findOneAnnByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.user_id !== user.id) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }
    await this.manageRepository.remove(post);
    return { message: '게시물이 삭제되었습니다.' };
  }

  // 게시물 수정
  async updateAnnPost(postId: number, updateManageDto: UpdateAnnounceDto, 
    user: User
  ) {
    const post = await this.findOneAnnByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.user_id !== user.id) {
      throw new BadRequestException('작성자만 수정할 수 있습니다.');
    }
    const isChangedData =
      user.id !== undefined ||
      updateManageDto.title_a !== undefined ||
      updateManageDto.contents_a !== undefined;
    if (!isChangedData) {
      throw new BadRequestException('변경된 내용이 없습니다.')
    }
    await this.manageRepository.update({ id: postId }, updateManageDto);
    return { message: '게시물이 수정되었습니다.' };
  }
}

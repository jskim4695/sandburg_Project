import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Free } from './entities/free.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateFreeDto } from './dto/create-free.dto';
import { UpdateFreeDto } from './dto/update-free.dto';

@Injectable()
export class FreeService {
  constructor(
    @InjectRepository(Free)
    private readonly freeRepository: Repository<Free>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 게시물 생성
  async create(user: User, createFreeDto: CreateFreeDto) {
    const users = await this.userRepository.findOne({
      where: {id: user.id},
    })

    if (!users) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const newFreePost = new Free()
    newFreePost.user_id = user.id
    newFreePost.title = createFreeDto.title;
    newFreePost.contents = createFreeDto.contents;

    const post =  await this.freeRepository.save(newFreePost);

    return post
  }

  // 게시물 전체 조회
  async findAllPost() {
    const posts = await this.freeRepository.find();
    return posts;
  }

    // 게시물 단건 조회
    async findOnePostByPostId(postId: number) {
      const post = await this.freeRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }
      return post;
    }

    // 게시물 삭제
  async removePost(user: User, postId: number) {
    const post = await this.findOnePostByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.user_id !== user.id) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }
    await this.freeRepository.remove(post);
    return { message: '게시물이 삭제되었습니다.' };
  }

    // 게시물 수정
    async updatePost(postId: number, updateFreeDto: UpdateFreeDto, user: User) {
      const post = await this.findOnePostByPostId(postId);
      if (!post) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }
      if (post.user_id !== user.id) {
        throw new BadRequestException('작성자만 수정할 수 있습니다.');
      }
      const isChangedData =
        user.id !== undefined ||
        updateFreeDto.title !== undefined ||
        updateFreeDto.contents !== undefined;
      if (!isChangedData) {
        throw new BadRequestException('변경된 내용이 없습니다.')
      }
      await this.freeRepository.update({ id: postId }, updateFreeDto);
      return { message: '게시물이 수정되었습니다.' };
    }
}

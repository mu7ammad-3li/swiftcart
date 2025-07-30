import { BaseService } from '../shared/BaseService';
import {
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogPost,
  BlogPostResponse,
  BlogCategory,
  BlogCategoryResponse,
  CreateCommentDTO,
  BlogCommentResponse,
  BlogComment
} from './types';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { slugify } from '../../lib/utils';

export class BlogMutationService extends BaseService {
  private readonly postsCollection = 'blog_posts';
  private readonly categoriesCollection = 'blog_categories';
  private readonly commentsCollection = 'blog_comments';

  async createBlogPost(data: CreateBlogPostDTO): Promise<BlogPostResponse> {
    return this.withErrorHandling(async () => {
      const postRef = doc(collection(this.firestore, this.postsCollection));
      
      // Get author details
      const authorRef = doc(this.firestore, 'users', data.authorId);
      const authorDoc = await getDoc(authorRef);
      if (!authorDoc.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Author with ID ${data.authorId} not found`,
          },
        };
      }

      // Get categories
      const categories = await this.getCategoriesByIds(data.categoryIds);
      if (!categories.success) {
        return categories;
      }

      const slug = await this.generateUniqueSlug(data.title);
      const readTime = this.calculateReadTime(data.content);

      const postData: BlogPost = {
        id: postRef.id,
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        images: data.images || [],
        author: {
          id: authorDoc.id,
          name: authorDoc.data().name,
          avatar: authorDoc.data().avatar,
          bio: authorDoc.data().bio
        },
        categories: categories.data,
        tags: data.tags || [],
        publishedAt: data.status === 'published' ? Date.now() : 0,
        updatedAt: Date.now(),
        status: data.status || 'draft',
        isPublic: data.isPublic ?? false,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        readTime,
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.excerpt
      };

      await setDoc(postRef, postData);

      return {
        success: true,
        data: postData
      };
    }, 'createBlogPost');
  }

  async updateBlogPost(data: UpdateBlogPostDTO): Promise<BlogPostResponse> {
    return this.withErrorHandling(async () => {
      const postRef = doc(this.firestore, this.postsCollection, data.id);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Blog post with ID ${data.id} not found`,
          },
        };
      }

      const currentPost = postDoc.data() as BlogPost;
      let categories = currentPost.categories;

      if (data.categoryIds) {
        const categoriesResponse = await this.getCategoriesByIds(data.categoryIds);
        if (!categoriesResponse.success) {
          return categoriesResponse;
        }
        categories = categoriesResponse.data;
      }

      const updateData: Partial<BlogPost> = {
        ...data,
        categories,
        updatedAt: Date.now()
      };

      if (data.title) {
        updateData.slug = await this.generateUniqueSlug(data.title, data.id);
      }

      if (data.content) {
        updateData.readTime = this.calculateReadTime(data.content);
      }

      if (data.status === 'published' && currentPost.status !== 'published') {
        updateData.publishedAt = Date.now();
      }

      await updateDoc(postRef, updateData);

      return this.getUpdatedBlogPost(data.id);
    }, 'updateBlogPost');
  }

  async createCategory(
    name: string,
    description?: string,
    parentId?: string
  ): Promise<BlogCategoryResponse> {
    return this.withErrorHandling(async () => {
      const slug = await this.generateUniqueCategorySlug(name);
      const categoryRef = doc(collection(this.firestore, this.categoriesCollection));

      const categoryData: BlogCategory = {
        id: categoryRef.id,
        name,
        slug,
        description,
        parentId
      };

      await setDoc(categoryRef, categoryData);

      return {
        success: true,
        data: categoryData
      };
    }, 'createCategory');
  }

  async createComment(data: CreateCommentDTO): Promise<BlogCommentResponse> {
    return this.withErrorHandling(async () => {
      const commentRef = doc(collection(this.firestore, this.commentsCollection));
      
      // Get author details
      const authorRef = doc(this.firestore, 'users', data.authorId);
      const authorDoc = await getDoc(authorRef);
      if (!authorDoc.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Author with ID ${data.authorId} not found`,
          },
        };
      }

      const commentData: BlogComment = {
        id: commentRef.id,
        postId: data.postId,
        authorId: data.authorId,
        authorName: authorDoc.data().name,
        content: data.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isApproved: false,
        parentCommentId: data.parentCommentId,
        likes: 0
      };

      await runTransaction(this.firestore, async (transaction) => {
        // Create comment
        transaction.set(commentRef, commentData);

        // Update post comment count
        const postRef = doc(this.firestore, this.postsCollection, data.postId);
        transaction.update(postRef, {
          commentCount: increment(1)
        });
      });

      return {
        success: true,
        data: commentData
      };
    }, 'createComment');
  }

  async likePost(postId: string): Promise<BlogPostResponse> {
    return this.withErrorHandling(async () => {
      const postRef = doc(this.firestore, this.postsCollection, postId);
      
      await updateDoc(postRef, {
        likeCount: increment(1)
      });

      return this.getUpdatedBlogPost(postId);
    }, 'likePost');
  }

  async approveComment(commentId: string): Promise<BlogCommentResponse> {
    return this.withErrorHandling(async () => {
      const commentRef = doc(this.firestore, this.commentsCollection, commentId);
      
      await updateDoc(commentRef, {
        isApproved: true,
        updatedAt: Date.now()
      });

      return this.getUpdatedComment(commentId);
    }, 'approveComment');
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = slugify(title);
    let counter = 0;
    let isUnique = false;

    while (!isUnique) {
      const currentSlug = counter === 0 ? slug : `${slug}-${counter}`;
      const q = query(
        collection(this.firestore, this.postsCollection),
        where('slug', '==', currentSlug)
      );
      const querySnapshot = await getDocs(q);
      
      isUnique = querySnapshot.empty || 
        (querySnapshot.size === 1 && querySnapshot.docs[0].id === excludeId);

      if (!isUnique) {
        counter++;
      } else {
        slug = currentSlug;
      }
    }

    return slug;
  }

  private async generateUniqueCategorySlug(name: string): Promise<string> {
    let slug = slugify(name);
    let counter = 0;
    let isUnique = false;

    while (!isUnique) {
      const currentSlug = counter === 0 ? slug : `${slug}-${counter}`;
      const q = query(
        collection(this.firestore, this.categoriesCollection),
        where('slug', '==', currentSlug)
      );
      const querySnapshot = await getDocs(q);
      
      isUnique = querySnapshot.empty;

      if (!isUnique) {
        counter++;
      } else {
        slug = currentSlug;
      }
    }

    return slug;
  }

  private async getCategoriesByIds(categoryIds: string[]): Promise<BlogCategoryResponse> {
    try {
      const categories: BlogCategory[] = [];

      for (const id of categoryIds) {
        const categoryRef = doc(this.firestore, this.categoriesCollection, id);
        const categoryDoc = await getDoc(categoryRef);

        if (!categoryDoc.exists()) {
          return {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: `Category with ID ${id} not found`,
            },
          };
        }

        categories.push({ id: categoryDoc.id, ...categoryDoc.data() } as BlogCategory);
      }

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error fetching categories',
        },
      };
    }
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private async getUpdatedBlogPost(postId: string): Promise<BlogPostResponse> {
    const postRef = doc(this.firestore, this.postsCollection, postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Blog post ${postId} not found`
        }
      };
    }

    return {
      success: true,
      data: postDoc.data() as BlogPost
    };
  }

  private async getUpdatedComment(commentId: string): Promise<BlogCommentResponse> {
    const commentRef = doc(this.firestore, this.commentsCollection, commentId);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Comment ${commentId} not found`
        }
      };
    }

    return {
      success: true,
      data: commentDoc.data() as BlogComment
    };
  }
} 
import { BaseService } from '../shared/BaseService';
import { QueryOptions } from '../shared/types';
import {
  BlogPost,
  BlogPostResponse,
  BlogPostsResponse,
  BlogCategory,
  BlogCategoryResponse,
  BlogCategoriesResponse,
  BlogComment,
  BlogCommentResponse,
  BlogCommentsResponse,
  BlogSearchFilters,
  BlogStats,
  BlogStatsResponse
} from './types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  QuerySnapshot,
  DocumentData,
  Timestamp
} from 'firebase/firestore';

export class BlogQueryService extends BaseService {
  private readonly postsCollection = 'blog_posts';
  private readonly categoriesCollection = 'blog_categories';
  private readonly commentsCollection = 'blog_comments';

  async getBlogPostById(id: string): Promise<BlogPostResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.postsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Blog post with ID ${id} not found`,
          },
        };
      }

      // Increment view count
      await this.incrementPostViewCount(id);

      return {
        success: true,
        data: this.formatBlogPostData(docSnap.data() as BlogPost),
      };
    }, 'getBlogPostById');
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.postsCollection),
        where('slug', '==', slug),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Blog post with slug ${slug} not found`,
          },
        };
      }

      const postId = querySnapshot.docs[0].id;
      await this.incrementPostViewCount(postId);

      return {
        success: true,
        data: this.formatBlogPostData(querySnapshot.docs[0].data() as BlogPost),
      };
    }, 'getBlogPostBySlug');
  }

  async getBlogPosts(options?: QueryOptions<BlogSearchFilters>): Promise<BlogPostsResponse> {
    return this.withErrorHandling(async () => {
      let q = collection(this.firestore, this.postsCollection);

      if (options?.filters) {
        const { status, isPublic, categoryId, authorId, tag, publishedAfter, publishedBefore } = options.filters;
        
        if (status) {
          q = query(q, where('status', '==', status));
        }
        
        if (typeof isPublic === 'boolean') {
          q = query(q, where('isPublic', '==', isPublic));
        }
        
        if (categoryId) {
          q = query(q, where('categories', 'array-contains', categoryId));
        }
        
        if (authorId) {
          q = query(q, where('author.id', '==', authorId));
        }
        
        if (tag) {
          q = query(q, where('tags', 'array-contains', tag));
        }
        
        if (publishedAfter) {
          q = query(q, where('publishedAt', '>=', publishedAfter));
        }
        
        if (publishedBefore) {
          q = query(q, where('publishedAt', '<=', publishedBefore));
        }
      }

      if (options?.sort) {
        q = query(q, orderBy(options.sort.field, options.sort.direction));
      } else {
        q = query(q, orderBy('publishedAt', 'desc'));
      }

      if (options?.pagination) {
        q = query(q, limit(options.pagination.limit));
        if (options.pagination.page > 1) {
          const snapshot = await this.getPaginationSnapshot(q, options.pagination.page);
          if (snapshot) {
            q = query(q, startAfter(snapshot));
          }
        }
      }

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => 
          this.formatBlogPostData({ id: doc.id, ...doc.data() } as BlogPost)
        ),
      };
    }, 'getBlogPosts');
  }

  async getBlogCategories(): Promise<BlogCategoriesResponse> {
    return this.withErrorHandling(async () => {
      const querySnapshot = await getDocs(
        query(collection(this.firestore, this.categoriesCollection), orderBy('name'))
      );
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }) as BlogCategory),
      };
    }, 'getBlogCategories');
  }

  async getBlogComments(postId: string): Promise<BlogCommentsResponse> {
    return this.withErrorHandling(async () => {
      const querySnapshot = await getDocs(
        query(
          collection(this.firestore, this.commentsCollection),
          where('postId', '==', postId),
          where('isApproved', '==', true),
          orderBy('createdAt', 'desc')
        )
      );
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => 
          this.formatBlogCommentData({ id: doc.id, ...doc.data() } as BlogComment)
        ),
      };
    }, 'getBlogComments');
  }

  async getBlogStats(): Promise<BlogStatsResponse> {
    return this.withErrorHandling(async () => {
      const postsSnapshot = await getDocs(collection(this.firestore, this.postsCollection));
      
      const stats: BlogStats = {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        archivedPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        popularCategories: [],
        popularTags: []
      };

      const categoryCount = new Map<string, number>();
      const tagCount = new Map<string, number>();

      postsSnapshot.docs.forEach(doc => {
        const post = doc.data() as BlogPost;
        stats.totalPosts++;
        
        switch (post.status) {
          case 'published':
            stats.publishedPosts++;
            break;
          case 'draft':
            stats.draftPosts++;
            break;
          case 'archived':
            stats.archivedPosts++;
            break;
        }

        stats.totalViews += post.viewCount;
        stats.totalLikes += post.likeCount;
        stats.totalComments += post.commentCount;

        // Count categories
        post.categories.forEach(category => {
          const count = categoryCount.get(category.id) || 0;
          categoryCount.set(category.id, count + 1);
        });

        // Count tags
        post.tags.forEach(tag => {
          const count = tagCount.get(tag) || 0;
          tagCount.set(tag, count + 1);
        });
      });

      // Convert category counts to array and sort
      stats.popularCategories = Array.from(categoryCount.entries())
        .map(([categoryId, postCount]) => ({ categoryId, postCount }))
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 10);

      // Convert tag counts to array and sort
      stats.popularTags = Array.from(tagCount.entries())
        .map(([tag, postCount]) => ({ tag, postCount }))
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 10);

      return {
        success: true,
        data: stats,
      };
    }, 'getBlogStats');
  }

  private async incrementPostViewCount(postId: string): Promise<void> {
    const postRef = doc(this.firestore, this.postsCollection, postId);
    await updateDoc(postRef, {
      viewCount: increment(1)
    });
  }

  private formatBlogPostData(post: BlogPost): BlogPost {
    return {
      ...post,
      publishedAt: post.publishedAt instanceof Timestamp 
        ? post.publishedAt.toMillis() 
        : post.publishedAt,
      updatedAt: post.updatedAt instanceof Timestamp 
        ? post.updatedAt.toMillis() 
        : post.updatedAt,
    };
  }

  private formatBlogCommentData(comment: BlogComment): BlogComment {
    return {
      ...comment,
      createdAt: comment.createdAt instanceof Timestamp 
        ? comment.createdAt.toMillis() 
        : comment.createdAt,
      updatedAt: comment.updatedAt instanceof Timestamp 
        ? comment.updatedAt.toMillis() 
        : comment.updatedAt,
    };
  }

  private async getPaginationSnapshot(
    q: any,
    page: number
  ): Promise<QuerySnapshot<DocumentData> | null> {
    try {
      const snapshot = await getDocs(q);
      const lastVisible = snapshot.docs[(page - 1) * 10 - 1];
      return lastVisible || null;
    } catch (error) {
      console.error('Error getting pagination snapshot:', error);
      return null;
    }
  }
} 
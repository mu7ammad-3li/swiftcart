import { BaseServiceConfig } from '../shared/BaseService';
import { BlogQueryService } from './blogQueries';
import { BlogMutationService } from './blogMutations';

export class BlogService {
  private static instance: BlogService;
  private queryService: BlogQueryService;
  private mutationService: BlogMutationService;

  private constructor(config: BaseServiceConfig) {
    this.queryService = new BlogQueryService(config);
    this.mutationService = new BlogMutationService(config);
    this.initializeMethods();
  }

  private initializeMethods(): void {
    // Query Methods
    this.getBlogPostById = this.queryService.getBlogPostById.bind(this.queryService);
    this.getBlogPostBySlug = this.queryService.getBlogPostBySlug.bind(this.queryService);
    this.getBlogPosts = this.queryService.getBlogPosts.bind(this.queryService);
    this.getBlogCategories = this.queryService.getBlogCategories.bind(this.queryService);
    this.getBlogComments = this.queryService.getBlogComments.bind(this.queryService);
    this.getBlogStats = this.queryService.getBlogStats.bind(this.queryService);

    // Mutation Methods
    this.createBlogPost = this.mutationService.createBlogPost.bind(this.mutationService);
    this.updateBlogPost = this.mutationService.updateBlogPost.bind(this.mutationService);
    this.createCategory = this.mutationService.createCategory.bind(this.mutationService);
    this.createComment = this.mutationService.createComment.bind(this.mutationService);
    this.likePost = this.mutationService.likePost.bind(this.mutationService);
    this.approveComment = this.mutationService.approveComment.bind(this.mutationService);
  }

  public static initialize(config: BaseServiceConfig): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService(config);
    }
    return BlogService.instance;
  }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      throw new Error('BlogService must be initialized before use');
    }
    return BlogService.instance;
  }

  // Query Methods
  public getBlogPostById!: typeof BlogQueryService.prototype.getBlogPostById;
  public getBlogPostBySlug!: typeof BlogQueryService.prototype.getBlogPostBySlug;
  public getBlogPosts!: typeof BlogQueryService.prototype.getBlogPosts;
  public getBlogCategories!: typeof BlogQueryService.prototype.getBlogCategories;
  public getBlogComments!: typeof BlogQueryService.prototype.getBlogComments;
  public getBlogStats!: typeof BlogQueryService.prototype.getBlogStats;

  // Mutation Methods
  public createBlogPost!: typeof BlogMutationService.prototype.createBlogPost;
  public updateBlogPost!: typeof BlogMutationService.prototype.updateBlogPost;
  public createCategory!: typeof BlogMutationService.prototype.createCategory;
  public createComment!: typeof BlogMutationService.prototype.createComment;
  public likePost!: typeof BlogMutationService.prototype.likePost;
  public approveComment!: typeof BlogMutationService.prototype.approveComment;
}

// Export types
export * from './types'; 
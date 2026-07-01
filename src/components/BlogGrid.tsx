import { useState, FormEvent, useMemo } from "react";
import { Clock, User, Calendar, MessageSquare, ChevronLeft, Send, Sparkles } from "lucide-react";
import { marked } from "marked";
import { BlogPost, BlogComment } from "../types";

interface BlogGridProps {
  blogs: BlogPost[];
  onNewCommentAdded: (blogId: string, newComment: BlogComment) => void;
}

function ContentRenderer({ markdown }: { markdown: string }) {
  const html = useMemo(() => {
    return marked(markdown);
  }, [markdown]);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html as string }}
      className="prose prose-sm max-w-none prose-headings:font-serif prose-h3:text-base prose-h3:font-bold prose-p:text-gray-700 prose-strong:font-semibold prose-li:text-gray-700 prose-ul:space-y-2 prose-ol:space-y-2"
    />
  );
}

export default function BlogGrid({ blogs, onNewCommentAdded }: BlogGridProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Comment Form State
  const [commenterName, setCommenterName] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!commenterName || !commentText) {
      setErrorMsg("Please provide your name and a comment.");
      return;
    }

    if (!selectedPost) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blog/${selectedPost.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: commenterName,
          comment: commentText
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to post comment.");
      }

      onNewCommentAdded(selectedPost.id, data);
      
      // Update local view of comments
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, data]
      });
      
      setCommenterName("");
      setCommentText("");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedPost) {
    // Single Post Reader Layout
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="blog-reader-view">
        
        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-gray-500 hover:text-imperial mb-8 cursor-pointer group"
          id="blog-back-btn"
        >
          <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 space-y-6">
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-2 items-center text-xs font-mono text-gray-400">
            <span className="bg-imperial text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
              {selectedPost.category}
            </span>
            <span>&bull;</span>
            <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" />{selectedPost.date}</span>
            <span>&bull;</span>
            <span className="flex items-center"><User className="h-3.5 w-3.5 mr-1" />By {selectedPost.author}</span>
            <span>&bull;</span>
            <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" />{selectedPost.readTime}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 leading-tight">
            {selectedPost.title}
          </h1>

          {/* Featured Image */}
          <div className="h-64 sm:h-96 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
            <img src={selectedPost.image} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Content Body */}
          <div className="text-gray-700 font-light leading-relaxed text-sm sm:text-base space-y-4 font-sans pt-4 prose prose-sm max-w-none">
            <ContentRenderer markdown={selectedPost.content} />
          </div>

        </article>

        {/* Comments Section */}
        <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-md space-y-8" id="blog-comments-section">
          <div className="flex items-center space-x-2 border-b pb-3.5">
            <MessageSquare className="h-5 w-5 text-imperial" />
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Comments & Discussion ({selectedPost.comments.length})
            </h3>
          </div>

          {/* List of comments */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {selectedPost.comments.length > 0 ? (
              selectedPost.comments.map((comment) => (
                <div key={comment.id} className="bg-stone-50 border border-gray-100 p-4 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-gray-800">{comment.userName}</strong>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed">
                    "{comment.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 font-mono text-xs">
                No comments yet. Share your thoughts below!
              </div>
            )}
          </div>

          {/* Leave a comment form */}
          <div className="bg-stone-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-serif text-sm font-bold text-gray-900 mb-3 flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>Leave a Travel Tip</span>
            </h4>

            <form onSubmit={handleCommentSubmit} className="space-y-3" id="blog-comment-form">
              {errorMsg && (
                <p className="text-xs text-red-500 font-mono">⚠️ {errorMsg}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-imperial"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience or ask a travel tip about this topic..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:border-imperial"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-charcoal hover:bg-black text-white px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold border border-gold/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5 text-gold" />
                <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    );
  }

  // Articles Grid Catalog View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="blog-section">
      
      {/* Blog Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block mb-1">Local Travel Insights</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Vienna Explorer Blog</h2>
        <p className="text-gray-500 font-light text-base sm:text-lg">
          Read insider recommendations, historical narratives, coffee house protocols, and local culinary tips written directly by our professional tour historians.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blogs-grid-container">
        {blogs.map((post) => (
          <div 
            key={post.id}
            id={`blog-card-${post.id}`}
            onClick={() => setSelectedPost(post)}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gold/25 transition-all duration-300 cursor-pointer flex flex-col h-full group"
          >
            {/* Image banner */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt="" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-imperial text-white text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
                {post.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-charcoal/80 text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 backdrop-blur">
                {post.readTime}
              </span>
            </div>

            {/* Post details */}
            <div className="p-5 flex flex-col flex-grow">
              
              {/* Date / Author */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400 mb-2">
                <span>{post.date}</span>
                <span>&bull;</span>
                <span>By {post.author}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-imperial transition-colors duration-200 line-clamp-2 mb-2 leading-snug">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>

              {/* Action Link row */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 text-[10px] uppercase font-mono tracking-wider font-semibold">
                <span className="text-imperial group-hover:text-imperial-dark transition-colors">&rarr; Read Full Article</span>
                <span className="text-gray-400 flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  {post.comments.length}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

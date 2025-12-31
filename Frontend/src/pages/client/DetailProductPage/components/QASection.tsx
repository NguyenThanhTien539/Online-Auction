import {useState, useEffect} from "react"
import {toast} from "sonner"
import { MessageCircle, User, HelpCircle, Plus, Send, MessageSquare, Crown } from "lucide-react";
import PaginationComponent from "@/components/common/Pagination";
import Loading from "@/components/common/Loading";



interface QuestionType {
  question_id: number;
  created_at: string;
  product_id: number;
  user_id: number;
  username: string;
  content: string;
  question_parent_id: number | null;

}

export default function QASection({product_id, seller_id} : {product_id?: number, seller_id?: number}) {

  // Sample data for testing
  

  const [questions, setQuestions] = useState <QuestionType[]>([]);
  const [currentPage, setCurrentPage] = useState (1);
  const [isLoading, setIsLoading] = useState (true); // Set to false since using sample data
  const limit = 5;
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState (1);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [mainQuestions, setMainQuestions] = useState<QuestionType[]>([]);
  
  // Get replies for a question
  const getReplies = (questionId: number) => {
    return questions.filter(q => q.question_parent_id === questionId);
  };

  
  // Comment out API fetch for now, using sample data
  useEffect (() => {
    if (!product_id) return;
    setIsLoading (true);
    async function fetchQuestions () {
      try {
        const promise = fetch (`${import.meta.env.VITE_API_URL}/api/products/questions?product_id=${product_id}&page=${currentPage}&limit=${limit}`);
        const res = await promise;
        if (!res.ok){
          throw new Error ("Failed to fetch questions");
        }
        const data = await res.json();
        setQuestions (data.data);
        setTotalQuestions (Number(data.totalQuestions) || 0);
        setTotalPages (Math.ceil(Number(data.totalQuestions) / limit) || 1);
        setMainQuestions (data.data.filter((q: QuestionType) => q.question_parent_id === null));

      }
      catch (error: any) {
        toast.error (error.message || "Lỗi kết nối đến máy chủ" );
      }
    }
    fetchQuestions ();
    setIsLoading (false);
  } , [currentPage, product_id]);


  const handleSubmitQuestion = (e: any) => {
    e.preventDefault();
    if (e.target.question.value.trim() === ""){
      toast.error ("Vui lòng nhập nội dung câu hỏi/trả lời");
      return;
    }

    const dataToSend = {
      product_id: product_id,
      content: e.target.question.value.trim(),
      question_parent_id: replyingTo,
    };

    async function postQuestion () {
      try {
        const promise = fetch (`${import.meta.env.VITE_API_URL}/api/products/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify (dataToSend),
        });
        const res = await promise;
        if (!res.ok){
          throw new Error ("Failed to post question");
        }
        const data = await res.json();
        toast.success (data.message || "Gửi câu hỏi/trả lời thành công");
        // Refresh questions

        setQuestions ((prev) => [...prev, data.data]);
        setMainQuestions ((prev) => {
          if (replyingTo == null){
            return [data.data, ...prev];
          }
          else{
            return prev;
          }
        });


        if (replyingTo !== null){
          setReplyingTo (null);
        }
        else {
          setCurrentPage (1);
          setTotalQuestions ((prev) => prev + 1);
  
        }
        e.target.reset();
      }
      catch (error: any) {
        toast.error (error.message || "Lỗi kết nối đến máy chủ" );
      }
    }
    postQuestion ();

  }

  if (isLoading){
    return <Loading className = "static w-full h-full bg-transparent"/>;
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Câu hỏi về sản phẩm</h3>
        <p className="text-sm text-gray-600 mt-1">Hỏi và trả lời về sản phẩm này</p>
      </div>

      {/* Ask Question Form */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="flex-1">
            <form onSubmit = {handleSubmitQuestion}>

                <textarea
                  name="question"
                  placeholder={replyingTo === null ? "Mô tả chi tiết câu hỏi của bạn..." : "Nội dung trả lời của bạn..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  {replyingTo !== null && (
                    <button 
                      type="button" 
                      onClick={() => setReplyingTo(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Hủy
                    </button>
                  )}
                  <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-gray-400 ml-auto">
                    <Send className="w-4 h-4" />
                    {replyingTo === null ? "Gửi câu hỏi" : "Gửi trả lời"}
                  </button>
                </div>
            </form>
           
          </div>
        </div>
      </div>
      <div className = "px-6 py-4 border-b border-gray-100 text-sm text-gray-600">
        {totalQuestions} câu hỏi
      </div>
      {/* Questions List */}
      <div className="divide-y divide-gray-200">
        {questions && mainQuestions && mainQuestions.length > 0 ? (
          mainQuestions.map((item) => {
            const replies = getReplies(item.question_id);
            return (
              <div key={item.question_id} className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150">
                {/* Question */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.username}</span>
                      {item.user_id === seller_id && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          <Crown className="w-3 h-3" />
                          Người bán
                        </span>
                      )}
                      <span className="text-xs text-gray-500">• {new Date(item.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>

                {/* Replies */}
                {replies.map((reply) => (
                  <div key={reply.question_id} className="flex gap-3 ml-11 mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{reply.username}</span>
                        {reply.user_id === seller_id && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            <Crown className="w-3 h-3" />
                            Người bán
                          </span>
                        )}
                        <span className="text-xs text-gray-500">• {new Date(reply.created_at).toLocaleString('vi-VN')}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}

                {/* Reply Button */}
                <div className="ml-11 mt-2">
                  <button 
                    onClick={() => setReplyingTo(item.question_id)}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Trả lời
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === item.question_id && (
                  <div className="ml-11 mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <form onSubmit={handleSubmitQuestion}>
                          <textarea
                            name="question"
                            placeholder="Nội dung trả lời của bạn..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <button 
                              type="button" 
                              onClick={() => setReplyingTo(null)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Hủy
                            </button>
                            <button type="submit" className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-gray-400">
                              <Send className="w-3 h-3" />
                              Gửi trả lời
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Chưa có câu hỏi nào</h3>
            <p className="text-sm text-gray-500">Hãy là người đầu tiên đặt câu hỏi để nhận tư vấn từ người bán.</p>
          </div>
        )}

        <div className ="py-4 px-6">
            <PaginationComponent numberOfPages = {totalPages} currentPage={currentPage} controlPage = {setCurrentPage}/>
        </div>
        
      </div>
    </div>
  )

}
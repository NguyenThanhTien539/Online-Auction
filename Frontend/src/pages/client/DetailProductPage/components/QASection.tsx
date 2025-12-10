

import { MessageCircle, User, HelpCircle, Plus, Send } from "lucide-react";

export default function QASection({product_id} : {product_id?: number}){

  const product = {
    qa: [
      {
        id: 1,
        question: "Sản phẩm có còn mới không?",
        answer: "Vâng, sản phẩm còn mới 100%, chưa sử dụng.",
        asker: "Nguyễn Văn A",}
    ],
  };
  return(
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Câu hỏi về sản phẩm</h3>
        <p className="text-sm text-gray-600 mt-1">Hỏi và trả lời về sản phẩm này</p>
      </div>

      {/* Ask Question Form */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Đặt câu hỏi của bạn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Send className="w-4 h-4" />
                Gửi câu hỏi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-200">
        {product.qa.length > 0 ? (
          product.qa.map((item) => (
            <div key={item.id} className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150">
              {/* Question */}
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.asker}</span>
                    <span className="text-xs text-gray-500">• 2 ngày trước</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.question}</p>
                </div>
              </div>

              {/* Answer */}
              <div className="flex gap-3 ml-11">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">Người bán</span>
                    <span className="text-xs text-gray-500">• 1 ngày trước</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Chưa có câu hỏi nào</h3>
            <p className="text-sm text-gray-500">Hãy là người đầu tiên đặt câu hỏi để nhận tư vấn từ người bán.</p>
          </div>
        )}
      </div>
    </div>
  )

}
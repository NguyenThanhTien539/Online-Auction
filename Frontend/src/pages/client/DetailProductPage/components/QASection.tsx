

import { MessageCircle, User, HelpCircle, Plus } from "lucide-react";

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border p-8 transition-all duration-300 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Hỏi đáp
          </h4>
          <p className="text-sm text-gray-600 mt-1">Giải đáp thắc mắc về sản phẩm</p>
        </div>
      </div>

      {product.qa.length > 0 ? (
        <div className="space-y-6">
          {product.qa.map((item) => (
            <div key={item.id} className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-200">
              {/* Question */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-800">{item.asker}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.question}</p>
                </div>
              </div>

              {/* Answer */}
              <div className="flex items-start gap-3 ml-8">
                <div className="w-px h-8 bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
                <div className="flex-1 bg-green-50/50 p-4 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-700">Người bán trả lời:</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-gray-400 text-4xl mb-3">💬</div>
          <p className="text-gray-600 font-medium text-lg">Chưa có câu hỏi nào.</p>
          <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>
      )}

      {/* Ask Question Button */}
      <div className="mt-8 flex justify-center">
        <button className="group bg-blue-300 cursor-pointer text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Đặt câu hỏi
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-lg -z-10"></div>
    </div>
  )

}
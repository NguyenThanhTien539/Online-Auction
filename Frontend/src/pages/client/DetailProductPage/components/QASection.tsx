

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
    <div className="p-5 rounded-lg bg-blue-50 w-[90%] mt-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Hỏi đáp</h4>
      {product.qa.length > 0 ? (
        <div className="space-y-4">
          {product.qa.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-2">
                <span className="font-medium text-gray-900">{item.asker}:</span>
                <span className="ml-2 text-gray-700">{item.question}</span>
              </div>
              <div className="ml-4 pl-4 border-l-2 border-blue-200">
                <span className="font-medium text-blue-600">Người bán:</span>
                <span className="ml-2 text-gray-700">{item.answer}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Chưa có câu hỏi nào.</p>
      )}
      {/* Optional: Add a form to ask new questions */}
      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Đặt câu hỏi
        </button>
      </div>
    </div>
  )
  
}
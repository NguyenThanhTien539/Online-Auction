import { Request, Response } from "express";
import * as productsModel from "../../models/products.model.ts";
import * as usersModel from "../../models/users.model.ts";
import { uploadToCloudinary } from "../../config/cloud.config.ts";
import { sendMail } from "../../helpers/mail.helper.ts";
import fs from "fs";
import { slugify } from "../../helpers/slug.helper.ts";
import {
  sendBidderQuestionTemplate,
  sendSellerAnswerTemplate
} from "../../helpers/mail.helper.ts";

export async function getProductsPageList(req: Request, res: Response) {
  // Extract query parameters
  const cat2_id = req.query.cat2_id as string;
  const page = parseInt(req.query.page as string) || 1;
  const priceFilter = (req.query.price as string) || "";
  const timeFilter = (req.query.time as string) || "";
  const searchKeyword = (req.query.search as string) || "";

  // Validate cat2_id
  if (!cat2_id) {
    return res.status(400).json({ message: "cat2_id is required" });
  }

  const result = await productsModel.getProductsPageList(
    parseInt(cat2_id),
    page,
    priceFilter,
    timeFilter,
    searchKeyword
  );

  if (result === null) {
    return res.status(500).json({ message: "Error in fetching products" });
  }
  let { data, numberOfPages, quantity } = result;
  return res.status(200).json({
    message: "Success",
    data: data,
    numberOfPages: numberOfPages,
    quantity: quantity,
  });
}

export async function getProductDetailBySlugId(req: Request, res: Response) {
  try {
    // Check slugid parameters
    const product_id = req.query.product_id as string;
    const product_slug = req.query.product_slug as string;
    if (!product_id || !product_slug) {
      return res.status(400).json({
        status: "error",
        message: "product_id and product_slug are required",
      });
    }

    // Find product by product_id
    const productDetail = await productsModel.getProductDetail(
      product_id,
      product_slug
    );
    if (!productDetail) {
      return res.status(404).json({
        status: "error",
        message: "Sản phẩm không tồn tại",
      });
    }
    return res.status(200).json({
      status: "success",
      data: productDetail,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function postNewProduct(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    for (let file of files) {
      const uploadResult = await uploadToCloudinary(
        file.path,
        "product_images"
      );
      // delete local file
      fs.unlinkSync(file.path);

      file.path = uploadResult.secure_url; // Update file path to Cloudinary URL
    }
    const user = (req as any).user;

    const newProductData = {
      product_name: req.body.product_name,
      seller_id: user.user_id,
      step_price: parseFloat(req.body.step_price),
      start_price: parseFloat(req.body.start_price),
      buy_now_price: parseFloat(req.body.buy_now_price),
      current_price: parseFloat(req.body.start_price),
      cat2_id: parseInt(req.body.cat2_id),
      start_time: req.body.start_time,
      bid_turns: 0,
      end_time: req.body.end_time,
      description: req.body.description,
      auto_extended: req.body.auto_extended === "true" ? true : false,
      product_images: files.map((file) => file.path), // Assuming 'path' contains the file URL or path
    };
    await productsModel.postNewProduct(newProductData);
    return res.status(201).json({
      status: "success",
      message: "Sản phẩm đã được đăng thành công",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function getMyProductsList(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const type = req.query.type as string;
    const page = parseInt(req.query.page as string) || 1;

    let result;
    switch (type) {
      case "my-favorites":
        result = await productsModel.getMyFavoriteProducts(user.user_id, page);
        break;
      case "my-selling":
        result = await productsModel.getMySellingProducts(user.user_id, page);
        break;
      case "my-sold":
        result = await productsModel.getMySoldProducts(user.user_id, page);
        break;
      case "my-won":
        result = await productsModel.getMyWonProducts(user.user_id, page);
        break;
      case "my-bidding":
        result = await productsModel.getMyBiddingProducts(user.user_id, page);
        break;
      case "my-inventory":
        result = await productsModel.getMyInventoryProducts(user.user_id, page);
        break;
      default:
        return res.status(400).json({
          status: "error",
          message: "Invalid type parameter",
        });
    }

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "No products found",
      });
    }
    let { data, numberOfPages, quantity } = result;
    return res.status(200).json({
      status: "success",
      data: data,
      numberOfPages: numberOfPages,
      quantity: quantity,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const query = req.query.query as string;
    console.log("Search query received: ", query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const result = await productsModel.searchProducts({
      query: query,
      page: page,
      limit: limit,
    });
    return res.status(200).json({
      status: "success",
      data: {
        products: result.data,
        total_pages: result.numberOfPages,
        quantity: result.quantity,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function getLoveStatus(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const product_id = req.query.product_id as string;
    if (!product_id) {
      return res.status(400).json({
        status: "error",
        message: "product_id is required",
      });
    }
    let isLoved = false;
    let total = 0;
    const loveStatus = await productsModel.getLoveStatus(
      user ? user.user_id : null,
      parseInt(product_id)
    );
    if (loveStatus) {
      isLoved = loveStatus.is_loved;
      total = Number(loveStatus.total_loves);
    }

    return res.status(200).json({
      status: "success",
      data: {
        is_loved: isLoved,
        total_loves: total,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function updateLoveStatus(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const product_id = req.body.product_id as string;
    const love_status = req.body.love_status as boolean;

    await productsModel.updateLoveStatus(
      user.user_id,
      parseInt(product_id),
      love_status
    );
    return res.status(200).json({
      status: "success",
      message: "Cập nhật trạng thái yêu thích thành công",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function getProductQuestions(req: Request, res: Response) {
  const product_id = req.query.product_id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

  if (!product_id) {
    return res.status(400).json({
      status: "error",
      message: "product_id is required",
    });
  }

  const result = await productsModel.getProductQuestions({
    product_id: parseInt(product_id),
    page: page,
    limit: limit,
  });
  if (!result) {
    return res.status(500).json({
      status: "error",
      message: "Error in fetching questions",
    });
  }

  return res.status(200).json({
    status: "success",
    data: result.data,
    totalQuestions: result.total_questions,
  });
}

export async function postProductQuestion(req: Request, res: Response) {
  const user = (req as any).user;
  const product_id = req.body.product_id as string;
  const content = req.body.content as string;
  const question_parent_id = req.body.question_parent_id
    ? parseInt(req.body.question_parent_id as string)
    : null;

  if (!product_id || !content) {
    return res.status(400).json({
      status: "error",
      message: "product_id and content are required",
    });
  }

  const result = await productsModel.postProductQuestion({
    product_id: parseInt(product_id),
    user_id: user.user_id,
    content: content,
    question_parent_id: question_parent_id,
  });

  // Email notificcation to seller
  const sellerInfo = await productsModel.getSellerOfProduct(
    parseInt(product_id)
  );
  if (sellerInfo && sellerInfo.user_id !== user.user_id) {
    const product_name = sellerInfo.product_name;
    const product_name_slug = slugify(product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;

    const emailContent = sendBidderQuestionTemplate({
      seller_username: sellerInfo.username,
      product_name: product_name,
      productUrl: productUrl,
      content: content,
    })
    sendMail(sellerInfo.email, "Câu hỏi mới về sản phẩm của bạn", emailContent);
  }

  // Email notification to user if seller answered them
  let userInParentQuestion = null;
  if (question_parent_id) {
    userInParentQuestion = await productsModel.getUserInParentQuestion(
      question_parent_id
    );
  }
  if (
    userInParentQuestion && // This is a reply to a question
    userInParentQuestion.user_id !== sellerInfo.user_id && // Not seller reply to their own question
    user.user_id === sellerInfo.user_id // The replier is the seller
  ) {
    const product_name = sellerInfo.product_name;
    const product_name_slug = slugify(product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;

    const emailContent = sendSellerAnswerTemplate({
      bidder_username: userInParentQuestion.username,
      seller_username: sellerInfo.username,
      product_name: product_name,
      productUrl: productUrl,
      bidder_question: userInParentQuestion.content,
      content: content,
    })
    sendMail(
      userInParentQuestion.email,
      "Người bán đã trả lời câu hỏi của bạn",
      emailContent
    );
  }

  if (!result) {
    return res.status(500).json({
      status: "error",
      message: "Error in posting question",
    });
  }

  return res.status(201).json({
    status: "success",
    message: "Question posted successfully",
    data: result,
  });
}

export async function getRelatedProducts(req: Request, res: Response) {
  try {
    const category_id = req.query.category_id as string;
    const product_id = req.query.product_id as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    if (!category_id) {
      return res.status(400).json({
        status: "error",
        message: "category_id is required",
      });
    }
    const products = await productsModel.getRelatedProducts({
      category_id: parseInt(category_id),
      product_id: product_id ? parseInt(product_id) : null,
      limit: limit,
    });
    return res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {}
}

export async function updateProductDescription(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const product_id = req.body.product_id as number;
    const newDescription = req.body.description as string;
    const promise = await productsModel.updateProductDescription({
      product_id: product_id,
      seller_id: user.user_id,
      new_description: newDescription,
    });

    if (!promise) {
      return res.status(500).json({
        status: "error",
        message: "Error in updating product description",
      });
    }
    if (promise.status === "403") {
      return res.status(403).json({
        status: "error",
        message: promise.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Cập nhật mô tả sản phẩm thành công",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function getProductDetailForWinner(req: Request, res: Response) {
  try {
    // Check slugid parameters
    const product_id = req.query.product_id as string;
    if (!product_id) {
      return res.status(400).json({
        status: "error",
        message: "Sản phẩm không tồn tại",
      });
    }
    const winner_id = (req as any).user.user_id;
    const productDetail = await productsModel.getProductDetailForWinner(
      parseInt(product_id),
      winner_id
    );

    const infoSeller = await usersModel.getUserById(productDetail.seller_id);

    if (!productDetail) {
      return res.status(404).json({
        status: "error",
        message: "Sản phẩm không tồn tại hoặc bạn không phải người chiến thắng",
      });
    }
    return res.status(200).json({
      status: "success",
      data: productDetail,
      infoSeller: infoSeller,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Có lỗi xảy ra, vui lòng thử lại sau",
    });
  }
}

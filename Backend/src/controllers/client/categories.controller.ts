import { Request, Response } from "express";

export function getAllCategoriesLv1(_ : Request, res : Response) {
    
    // Handle select all categories level 1
    const resultData = [
        {
            id: 1, 
            name: "Điện tử",
            image: "https://public-files.gumroad.com/uu1tshtnlfu7eltombvnyhxt2ntf"
        },  
        {
            id: 2,
            name: "Thời trang",
            image: "https://public-files.gumroad.com/uu1tshtnlfu7eltombvnyhxt2ntf"
        }
    ]
    return res.status(200).json({
        code: "success",
        message: "Lấy tất cả danh mục cấp 1 thành công",
        data: resultData
    })

}

export function getAllCategoriesLv2(req : Request, res : Response) {
    const id = req.query.cat_id;
    const slug = req.query.cat_slug;

    console.log("Category ID received: ", id);
    console.log("Category Slug received: ", slug);

    // Handle select all categories level 2 with lv1 id
    //
    //
    const resultData = [
        {
            id: 1,
            name: "Điện thoại",
            image: "https://public-files.gumroad.com/uu1tshtnlfu7eltombvnyhxt2ntf"
        }
    ]

    return res.status(200).json({
        code: "success",
        message: "Lấy tất cả danh mục cấp 2 thành công",
        data: resultData
    })
}
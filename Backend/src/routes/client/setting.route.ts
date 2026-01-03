import express from "express";
const route = express.Router();
import db from "../../config//database.config.ts";
import {Request, Response} from "express";

route.get("/auto_extend_time", async function (_: Request, res: Response) {
    try {
        let query = await db.raw(`
                select extend_time, threshold_time from extend_bidding_time limit 1
            `);
        let result = await query.rows[0];
        res.status(200).json({
            status: "success",
            data: {
                extend_time_minutes: result.extend_time,
                threshold_minutes: result.threshold_time,
            },
        })

    }
    catch (error) {
        console.error("Error fetching auto extend time setting:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
})

export default route;
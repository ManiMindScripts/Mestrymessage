// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import {  z } from "zod";
// import { usernameValidation } from "@/schemas/signUpSchema";

// const UsernameQuerySchema = z.object({
//     username: usernameValidation
// })

// export async function GET(request: Request) {
//     await dbConnect()
//     console.log("Db connect is username")

//     try {
//         const { searchParams } = new URL(request.url)
//         const queryParam = {
//             username: searchParams.get('username') ?? ''
//         }
//         const res = UsernameQuerySchema.safeParse(queryParam)
//         console.log(res)
//         if (!res.success) {
//             const usernameError = res.error.format().username?._errors || []
//             return Response.json({
//                 success: false,
//                 message: "Invalid Parameter"
//             }, { status: 400 })
//         }

//         const { username  } = res.data
//         const existingUser = await UserModel.findOne({ username, isVerified: true })
//         if (existingUser) {
//             return Response.json({
//                 success: false,
//                 message: "Username is not available"
//             }, { status: 400 })
//         }
//         return Response.json({
//             success: true,
//             message: "Username is unique"
//         }, { status: 200 })
//     } catch (error) {
//         console.error("Error Finding username", error)
//         return Response.json({
//             success: false,
//             message: "Error finding username"
//         }, { status: 500 }
//         )
//     }
// }


import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // ✅ Step 1: Try to connect DB
  try {
    await dbConnect();
    console.log("✅ DB connected for username check");
  } catch (err: any) {
    console.error("❌ DB connect failed:", err.message);
    return Response.json(
      { success: false, message: "Database connection failed", error: err.message },
      { status: 500 }
    );
  }

  try {
    // ✅ Step 2: Extract query param
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username") ?? "",
    };

    // ✅ Step 3: Validate username with Zod
    const res = UsernameQuerySchema.safeParse(queryParam);
    if (!res.success) {
      console.log("❌ Invalid username param:", res.error.format());
      return Response.json(
        { success: false, message: "Invalid Parameter" },
        { status: 400 }
      );
    }

    // ✅ Step 4: Check DB for username
    const { username } = res.data;
    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Username is not available" },
        { status: 400 }
      );
    }

    // ✅ Step 5: Success
    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error Finding username:", error.message, error.stack);
    return Response.json(
      { success: false, message: "Error finding username", error: error.message },
      { status: 500 }
    );
  }
}

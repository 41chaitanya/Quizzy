import { signupService, loginService, profileService } from "../services/auth.service.js";


export const signupController = async (req, res) => {

    try {

        const result = await signupService(req.body);
        console.log("controller body result..", result);
        res.status(201).json({
            success: true,  // indicates the request was successful
            ...result,  //
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const loginController = async (req, res) => {

    try {
        const result = await loginService(req.body);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const profileController = async (req, res) => {

    try {
        const result = await profileService(req.user.id);

        res.status(200).json({
            succesS: true,
            user: result,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
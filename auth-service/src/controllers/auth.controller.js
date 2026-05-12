

export const handleRegister = async(req, res)=>{
    const {fullname, email, password} = req.body;
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while register",
            error: error.message
        })
    }
}
export const handleLogin = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while login",
            error: error.message
        })
    }
}
export const handleLogout = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logout",
            error: error.message
        })
    }
}
export const handleGetMe = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getMe",
            error: error.message
        })
    }
}
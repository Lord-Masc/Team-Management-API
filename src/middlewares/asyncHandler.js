const asyncHandler = (fun)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch(next)
    }
}

module.exports = asyncHandler
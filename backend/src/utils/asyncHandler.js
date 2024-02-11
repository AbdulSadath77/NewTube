// THIS IS ONE OF THE METHOD WITH TRYCATCH
// const asyncHandler = (fun) => async (err, req, res, next) => {
//   try {
//     await fun(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// THIS IS BASICALLY WITH THE PROMICES
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

export { asyncHandler };

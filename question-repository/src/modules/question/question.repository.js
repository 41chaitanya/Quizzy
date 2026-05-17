export async function updateQuestionById(questionId, updateData) {
  return await Question.findOneAndUpdate(
    { 
        _id: questionId,
        isActive: true
     },
    { 
        $set: updateData
     },
    {
         new: true, 
         runValidators: true 
    }
  );
}

export async function softDeleteQuestionById(questionId) {
  return await Question.findOneAndUpdate(
    { 
       _id: questionId, 
       isActive: true
    },
    { 
       $set: { 
        isActive: false 
       } 
    },
    {
       new: true 
    }
  );
}